import OpenAI from 'openai';
import type { GeneratedPlan, GeneratedTask } from '../../../shared/src/index';

const SYSTEM_PROMPT = `You are LifeCTRL's AI action-plan generator. Your role is to help people who are facing overwhelming life situations by creating clear, practical, step-by-step action plans.

## YOUR OUTPUT FORMAT
You MUST respond with valid JSON only — no markdown, no extra text. The JSON structure:
{
  "title": "short, warm, actionable plan title (max 60 chars)",
  "description": "2-3 sentence empathetic summary of what this plan covers and why it helps",
  "disclaimer": "Disclaimer: This is administrative guidance, not legal, financial, or medical advice. For personalized professional advice, consult a qualified expert.",
  "tasks": [
    {
      "title": "specific actionable step (max 80 chars)",
      "description": "detailed explanation with concrete tips, what to prepare, and pitfalls to avoid (2-4 sentences)",
      "priority": 5,
      "estimated_time": "realistic time estimate (e.g., '1-2 hours', '30 minutes', '3-5 days')",
      "category": "documentation",
      "resources": ["url or description of helpful resource"]
    }
  ]
}

## PRIORITY SCALE
- 5: URGENT — must do immediately, has hard deadline, or blocks other tasks
- 4: HIGH — very important, time-sensitive, should do this week
- 3: MEDIUM — important but flexible timing
- 2: LOW — helpful but not critical
- 1: NICE-TO-HAVE — worth doing when everything else is handled

## TASK CATEGORIES
Choose from: documentation, financial, healthcare, housing, employment, legal, other

## GUIDELINES
- Generate between 6 and 15 tasks depending on situation complexity
- Prioritize by urgency AND dependency — what MUST happen before other things?
- Include realistic deadlines and time estimates
- Each task should reference specific, real-world resources: government websites (.gov), official forms, reputable guides, hotlines
- Be specific about which offices, portals, or forms are relevant to the user's described situation
- Use a warm, supportive, practical, non-judgmental tone
- Never suggest anything illegal, dangerous, or deceptive
- Never provide medical diagnoses, legal opinions, or financial advice — frame everything as administrative guidance
- For benefit-related tasks, include eligibility considerations and typical timelines
- For document tasks, specify exactly which documents and where they might be found
- Include the disclaimer EXACTLY as specified in the output format

## EXAMPLES OF GOOD TASKS
- "File your unemployment claim online at [state]'s Department of Labor portal" with priority 5, category "financial", resource link to actual .gov URL
- "Gather last 18 months of pay stubs, termination letter, and photo ID" with priority 5, category "documentation"
- "Compare COBRA continuation vs ACA marketplace plans at healthcare.gov" with priority 4, category "healthcare"
- "Create a bare-bones monthly budget with your emergency fund estimate" with priority 3, category "financial"`;

function validateGeneratedPlan(data: any): GeneratedPlan {
  if (!data || typeof data !== 'object') {
    throw new Error('AI response is not a valid object');
  }
  if (typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error('AI response missing valid title');
  }
  if (typeof data.description !== 'string' || !data.description.trim()) {
    throw new Error('AI response missing valid description');
  }
  if (!Array.isArray(data.tasks) || data.tasks.length === 0) {
    throw new Error('AI response missing tasks array');
  }

  const tasks: GeneratedTask[] = data.tasks.map((t: any, i: number) => {
    if (typeof t.title !== 'string' || !t.title.trim()) {
      throw new Error(`Task ${i + 1} missing title`);
    }
    if (typeof t.description !== 'string') {
      throw new Error(`Task ${i + 1} missing description`);
    }
    const priority = Number(t.priority);
    if (isNaN(priority) || priority < 1 || priority > 5) {
      throw new Error(`Task ${i + 1} has invalid priority: ${t.priority}`);
    }
    const validCategories = ['documentation', 'financial', 'healthcare', 'housing', 'employment', 'legal', 'other'];
    const category = typeof t.category === 'string' && validCategories.includes(t.category) ? t.category : 'other';
    const resources = Array.isArray(t.resources) ? t.resources.map(String) : [];
    return {
      title: t.title.trim(),
      description: (t.description || '').trim(),
      priority,
      estimated_time: typeof t.estimated_time === 'string' ? t.estimated_time.trim() : 'Varies',
      category,
      resources,
    };
  });

  const disclaimer = typeof data.disclaimer === 'string' && data.disclaimer.trim()
    ? data.disclaimer.trim()
    : 'Disclaimer: This is administrative guidance, not legal, financial, or medical advice. For personalized professional advice, consult a qualified expert.';

  return {
    title: data.title.trim(),
    description: data.description.trim(),
    tasks,
    disclaimer,
  };
}

export async function generatePlan(situation: string): Promise<GeneratedPlan> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'sk-placeholder') {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
  }

  const openai = new OpenAI({ apiKey });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    // Try gpt-4o first, fall back to gpt-4o-mini
    let completion: any;
    const models = ['gpt-4o', 'gpt-4o-mini'];

    for (const model of models) {
      try {
        completion = await openai.chat.completions.create(
          {
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              {
                role: 'user',
                content: `Please create an action plan for someone in this situation:\n\n${situation}\n\nRespond with valid JSON only.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: 'json_object' },
          },
          { signal: controller.signal }
        );
        break; // success, don't try next model
      } catch (err: any) {
        if (err?.status === 404 || err?.code === 'model_not_found') {
          // Model not available, try next
          continue;
        }
        throw err;
      }
    }

    if (!completion) {
      throw new Error('No AI model was available to generate the plan. Please try again later.');
    }

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('AI returned an empty response. Please try again.');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          throw new Error('AI response could not be parsed. Please try again with a more specific description of your situation.');
        }
      } else {
        throw new Error('AI response could not be parsed. Please try again with a more specific description of your situation.');
      }
    }

    return validateGeneratedPlan(parsed);
  } catch (err: any) {
    if (err.name === 'AbortError' || err.code === 'ETIMEDOUT') {
      throw new Error('Plan generation timed out. Please try again — your situation may need a more focused description.');
    }
    // Re-throw if it's already one of our errors
    if (err.message && (
      err.message.includes('AI response') ||
      err.message.includes('Plan generation') ||
      err.message.includes('OpenAI API key') ||
      err.message.includes('No AI model')
    )) {
      throw err;
    }
    // For unknown errors
    console.error('OpenAI API error:', err);
    throw new Error('Unable to generate plan right now. Please try again in a moment, or try describing your situation more specifically.');
  } finally {
    clearTimeout(timeoutId);
  }
}
