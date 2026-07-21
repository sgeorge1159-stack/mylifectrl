import OpenAI from 'openai';
import type { DocumentAnalysis, DocCategory } from '../../../shared/src/index';

const VALID_CATEGORIES: DocCategory[] = [
  'financial', 'employment', 'housing', 'legal', 'healthcare',
  'identification', 'tax', 'insurance', 'education', 'correspondence', 'other'
];

const SYSTEM_PROMPT = `You are LifeCTRL's document analysis AI. Your role is to examine documents and extract practical administrative information.

## YOUR OUTPUT FORMAT
You MUST respond with valid JSON only — no markdown, no extra text. The JSON structure:
{
  "category": "one of: financial, employment, housing, legal, healthcare, identification, tax, insurance, education, correspondence, other",
  "summary": "2-3 sentence summary of what this document is and what it contains",
  "key_details": [
    { "label": "Date", "value": "January 15, 2026" },
    { "label": "Amount", "value": "$1,200.00" },
    { "label": "Reference Number", "value": "ABC-12345" }
  ],
  "suggested_tags": ["tag1", "tag2", "tag3"]
}

## CATEGORIES
- financial: pay stubs, bank statements, bills, invoices, expense reports, benefit statements
- employment: offer letters, termination notices, performance reviews, employment contracts
- housing: leases, rental agreements, mortgage documents, property tax, utility bills
- legal: court documents, legal notices, contracts, summons, official notices
- healthcare: medical bills, insurance EOBs, prescription info, doctor correspondence
- identification: IDs, passports, birth certificates, SSN cards, driver's licenses
- tax: tax returns, W-2s, 1099s, tax notices, IRS correspondence
- insurance: policy documents, coverage letters, claim documents
- education: transcripts, diplomas, enrollment documents, student loan docs
- correspondence: emails, letters, official communications
- other: anything that doesn't fit above

## GUIDELINES
- Focus on extracting practical admin info: dates, dollar amounts, reference/account numbers, names of parties, deadlines
- The summary should help someone understand what this document is at a glance
- key_details should include only information actually present in the document
- suggested_tags should be 2-5 lowercase, single-word tags that help with search
- If you cannot determine the content, use "other" category and note that in the summary
- Never guess amounts or dates — only extract what's clearly present`;

// ── Filename-based fallback categorization (no AI needed) ──
export function categorizeByFilename(filename: string): DocumentAnalysis {
  const lower = filename.toLowerCase();

  // Category detection by keywords in filename
  let category: DocCategory = 'other';

  if (/pay.?stub|payroll|salary|wage|income|direct.?deposit|compensation/i.test(lower)) {
    category = 'financial';
  } else if (/bank.?statement|credit.?card|invoice|bill|receipt|expense|transaction/i.test(lower)) {
    category = 'financial';
  } else if (/offer.?letter|termination|severance|layoff|resign|application|resume|cv|cover.?letter|job/i.test(lower)) {
    category = 'employment';
  } else if (/lease|rent|mortgage|landlord|tenant|property|deed|housing/i.test(lower)) {
    category = 'housing';
  } else if (/court|summons|legal|attorney|lawyer|complaint|judgment|notice.?to/i.test(lower)) {
    category = 'legal';
  } else if (/medical|doctor|health|hospital|prescription|patient|diagnosis|treatment/i.test(lower)) {
    category = 'healthcare';
  } else if (/passport|birth.?cert|id.?card|driver.?license|ssn|social.?security.?card|identification/i.test(lower)) {
    category = 'identification';
  } else if (/w-?2|1099|tax.?return|irs|tax.?notice|tax.?document|schedule.?[a-z]/i.test(lower)) {
    category = 'tax';
  } else if (/insurance|policy|coverage|claim|premium|deductible/i.test(lower)) {
    category = 'insurance';
  } else if (/transcript|diploma|degree|enrollment|student.?loan|fafsa|tuition|university|college/i.test(lower)) {
    category = 'education';
  } else if (/email|letter|correspondence|notice|communication/i.test(lower)) {
    category = 'correspondence';
  }

  return {
    category,
    summary: `Document uploaded: ${filename}`,
    key_details: [],
    suggested_tags: [category],
  };
}

// ── AI-powered document analysis ──
export async function analyzeDocument(
  filePath: string,
  fileType: string,
  displayName?: string
): Promise<DocumentAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'sk-placeholder') {
    // Fallback to filename-based categorization
    const fileName = displayName || filePath.split('/').pop() || filePath;
    return categorizeByFilename(fileName);
  }

  const openai = new OpenAI({ apiKey });

  // Read file content for analysis
  let fileContent = '';
  try {
    if (fileType.startsWith('text/') || fileType === 'application/eml') {
      // For text files and emails, read the content directly
      const file = Bun.file(filePath);
      if (await file.exists()) {
        const text = await file.text();
        fileContent = text.slice(0, 8000); // Limit to first 8000 chars
      }
    } else if (fileType === 'application/pdf') {
      // For PDFs, we can't easily extract text without a PDF library
      // Send the filename and note it's a PDF for the AI to work with what it can
      const fileName = filePath.split('/').pop() || '';
      fileContent = `[PDF Document: ${fileName}]\n\nThis is a PDF file. Please analyze based on the filename and categorize accordingly.`;
    } else if (fileType.startsWith('image/')) {
      // For images, we can use vision API (if available) or filename-based
      const fileName = filePath.split('/').pop() || '';
      const file = Bun.file(filePath);

      if (await file.exists()) {
        try {
          // Try vision API with the image as base64
          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Please analyze this document image. The filename is "${fileName}". Extract key details, categorize it, and provide a summary.`,
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${fileType};base64,${base64}`,
                      detail: 'low',
                    },
                  },
                ],
              },
            ],
            temperature: 0.3,
            max_tokens: 1000,
            response_format: { type: 'json_object' },
          });

          const content = completion.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            return validateAndClean(parsed);
          }
        } catch {
          // Vision API failed, fall through to text-based approach
        }
      }

      fileContent = `[Image Document: ${fileName}]\n\nThis is an image file. Please categorize based on filename.`;
    }
  } catch {
    // If file reading fails, use filename-based
    const fileName = filePath.split('/').pop() || filePath;
    return categorizeByFilename(fileName);
  }

  if (!fileContent.trim()) {
    const fileName = filePath.split('/').pop() || filePath;
    return categorizeByFilename(fileName);
  }

  // Text-based AI analysis
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20_000);

    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Analyze this document:\n\n${fileContent}\n\nRespond with valid JSON only.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      },
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      const fileName = filePath.split('/').pop() || filePath;
      return categorizeByFilename(fileName);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        const fileName = filePath.split('/').pop() || filePath;
        return categorizeByFilename(fileName);
      }
    }

    return validateAndClean(parsed);
  } catch {
    // On any error, fall back to filename-based
    const fileName = filePath.split('/').pop() || filePath;
    return categorizeByFilename(fileName);
  }
}

function validateAndClean(data: any): DocumentAnalysis {
  const category: DocCategory = VALID_CATEGORIES.includes(data?.category)
    ? data.category
    : 'other';

  const summary: string = typeof data?.summary === 'string' && data.summary.trim()
    ? data.summary.trim()
    : 'Document analysis in progress.';

  const key_details = Array.isArray(data?.key_details)
    ? data.key_details
        .filter((kd: any) => kd && typeof kd.label === 'string' && typeof kd.value === 'string')
        .map((kd: any) => ({ label: kd.label, value: kd.value }))
    : [];

  const suggested_tags = Array.isArray(data?.suggested_tags)
    ? data.suggested_tags.filter((t: any) => typeof t === 'string').map(String)
    : [category];

  return { category, summary, key_details, suggested_tags };
}
