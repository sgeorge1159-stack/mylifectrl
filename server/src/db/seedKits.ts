import type { Database } from 'bun:sqlite';

interface KitContent {
  overview: string;
  steps: { order: number; title: string; description: string; resources: string[] }[];
  checklist: string[];
  templates: { name: string; description: string }[];
  tips: string[];
}

interface KitSeed {
  title: string;
  description: string;
  category: string;
  price_cents: number;
  content: string;
}

function kit(c: KitContent): string {
  return JSON.stringify(c);
}

export function seedKits(db: Database): void {
  const count = (db.prepare('SELECT COUNT(*) as count FROM kits').get() as { count: number }).count;
  if (count > 0) return;

  const kits: KitSeed[] = [
    {
      title: 'Job Loss Recovery Kit',
      description: 'Navigate unemployment with confidence — from filing claims and securing health insurance to rebuilding your career with a structured job search system.',
      category: 'employment',
      price_cents: 2900,
      content: kit({
        overview: "Losing a job is one of life's most disorienting events. This kit walks you through the critical first days and weeks — securing benefits, protecting your health insurance, stabilizing your finances, and launching a focused job search. Every step is designed to move you from panic to purposeful action, with checklists you can tick off to build momentum.",
        steps: [
          {
            order: 1,
            title: 'File for Unemployment Immediately',
            description: "Don't wait — file for unemployment benefits the same week you're laid off. Most states have a one-week waiting period before benefits begin, and delays in filing mean delays in receiving funds. Before you start: gather your employment history for the past 18 months, including employer names, addresses, dates, and earnings. Have your Social Security number and driver's license ready.",
            resources: ['https://www.careeronestop.org/LocalHelp/UnemploymentBenefits/', 'https://www.dol.gov/general/topic/unemployment-insurance']
          },
          {
            order: 2,
            title: 'Secure Health Insurance (COBRA vs ACA)',
            description: 'You typically have 60 days from your last day of coverage to elect COBRA, or 60 days from job loss to enroll in an ACA marketplace plan through a Special Enrollment Period. COBRA lets you keep your existing plan but you pay the full premium (employer portion + your portion), often $600-800/month. ACA marketplace plans are frequently 50-70% cheaper — and you may qualify for subsidies based on your reduced income. Compare both before deciding. If you have ongoing medical needs, continuity of care and provider networks should factor into your decision.',
            resources: ['https://www.healthcare.gov/unemployed/coverage/', 'https://www.healthcare.gov/lower-costs/']
          },
          {
            order: 3,
            title: 'Conduct a Financial Triage',
            description: 'Calculate exactly how many months your savings will last. List every essential monthly expense (housing, utilities, food, insurance, minimum debt payments). Add up your emergency fund, severance, unused PTO payout, and any expected unemployment benefits. Divide total resources by monthly expenses — that is your financial runway in months. If it is under 3 months, prioritize expense reduction immediately. Cancel non-essential subscriptions, pause streaming services, call service providers to ask about hardship plans.',
            resources: []
          },
          {
            order: 4,
            title: 'Review Your Severance Agreement',
            description: 'If you received a severance agreement, do not sign it immediately. You generally have 21 days (or 45 days if part of a group layoff) to review it. Have an employment attorney review the terms — they typically charge $300-800 for a review but can often negotiate thousands more in severance, extended benefits, or removal of restrictive clauses. Pay special attention to: non-compete scope, release of claims language, continuation of benefits dates, and any clawback provisions.',
            resources: ['https://www.nela.org/find-an-attorney']
          },
          {
            order: 5,
            title: 'Refresh Your Professional Brand',
            description: 'Update your resume with measurable achievements, not just responsibilities. Replace "managed a team" with "led a 5-person team that increased quarterly revenue by 22%." Update your LinkedIn profile: write a compelling headline (not just your last job title), update your "About" section with your career narrative, and rebuild your skills section with keywords recruiters search for. Set your profile to "Open to Work" (you can control who sees this). Order fresh business cards if relevant to your industry.',
            resources: ['https://www.linkedin.com/help/linkedin/answer/a507508']
          },
          {
            order: 6,
            title: 'Build a Job Search System',
            description: 'Treat job searching as a structured project. Set weekly targets: 5-10 quality applications (tailored resumes and cover letters), 3 networking conversations, 2 skill-building sessions. Create a tracking spreadsheet with columns for company, role, application date, referral source, follow-up dates, and status. Focus on quality — a tailored application to 10 well-researched companies beats 50 generic applications. Set up job alerts on LinkedIn, Indeed, and industry-specific boards.',
            resources: []
          },
          {
            order: 7,
            title: 'Protect Your Mental Health',
            description: 'Job loss triggers genuine grief — denial, anger, bargaining, depression, and eventually acceptance. This is normal. Maintain a daily routine: wake up at a set time, exercise, shower, and dress as if going to work. Schedule job-search blocks (e.g., 9am-12pm) and then stop. Connect with former colleagues and friends — isolation makes everything harder. Consider a career counselor or therapist; many offer sliding-scale fees. Your identity is not your employment status.',
            resources: ['https://www.psychologytoday.com/us/therapists', 'https://www.careeronestop.org/FindTraining/career-counseling.aspx']
          }
        ],
        checklist: [
          'File unemployment claim with your state agency',
          'Confirm exact last day of employer health insurance coverage',
          'Get COBRA election notice from employer (if applicable)',
          'Compare COBRA cost vs ACA marketplace plans with subsidies',
          'Calculate your total liquid assets (savings + severance + PTO)',
          'Determine your monthly essential-expense baseline',
          'Calculate financial runway in months',
          'Cancel or pause all non-essential subscriptions',
          'Have severance agreement reviewed by an employment attorney',
          'Update resume with metrics-driven accomplishments',
          'Refresh LinkedIn profile, headline, and skills',
          'Set up job application tracking spreadsheet',
          'Set up job alerts on LinkedIn and Indeed',
          'Schedule 3 networking coffee chats or calls this week',
          'Create a daily routine with fixed job-search hours',
          'Research local career counseling or support groups'
        ],
        templates: [
          { name: 'Severance Negotiation Request', description: 'Professional email template requesting a severance review meeting or extension of the consideration period.' },
          { name: 'Networking Outreach Message', description: 'Warm, authentic template to reconnect with former colleagues and expand your professional network.' },
          { name: 'Job Application Tracking Spreadsheet', description: 'Structured template with columns for company, role, referral source, dates, and follow-up tracking.' },
          { name: 'Post-Layoff Budget Worksheet', description: 'Template to recalculate your monthly budget around essentials during the transition period.' },
          { name: 'Informational Interview Request', description: 'Template for requesting 20-minute conversations with people in target roles or companies.' }
        ],
        tips: [
          'File for unemployment on Day 1 — every day you delay is a day of benefits you will never recover.',
          'ACA marketplace plans with subsidies are often 50-70% cheaper than COBRA. Always compare both before defaulting to COBRA.',
          'Most people underestimate their job search timeline. Plan financially for 3-6 months even if you think it will be faster.',
          'Take at least one full week to decompress before diving into full-time job searching. Mental clarity produces better applications.',
          '70-85% of jobs are found through networking, not job boards. Prioritize conversations over application volume.',
          'Do not make major financial decisions (moving, large purchases) in the first 30 days unless absolutely necessary.'
        ]
      })
    },
    {
      title: 'Moving & Relocation Kit',
      description: 'Everything you need to plan, pack, and execute a smooth move — timelines, change-of-address checklists, utility transfers, and settling-in guides.',
      category: 'housing',
      price_cents: 1900,
      content: kit({
        overview: "Moving is consistently ranked as one of life's most stressful events — right up there with job loss and divorce. This kit turns chaos into order with a structured 8-week moving timeline, comprehensive checklists for every phase, and practical guides for everything from vetting movers to setting up utilities in your new home. Whether you're moving across town or across the country, this kit has you covered.",
        steps: [
          {
            order: 1,
            title: 'Create Your Moving Timeline (8 Weeks Out)',
            description: 'Start 8 weeks before your move date. Week 8-6: declutter, research moving companies, create an inventory. Week 5-4: book movers or truck rental, start packing non-essentials, order supplies. Week 3-2: confirm logistics, transfer medical records & prescriptions, pack most items. Final week: pack essentials bag, confirm moving day logistics, do final walkthrough. Having a written timeline reduces last-minute panic by 80%.',
            resources: []
          },
          {
            order: 2,
            title: 'Execute the Change-of-Address Checklist',
            description: 'File an official change of address with USPS (costs ~$1.10 online). This forwards mail for 12 months. But USPS forwarding does not catch everything — you must also update your address with: banks and credit cards, employer and payroll, insurance providers (auto, health, life, renters/homeowners), investment accounts, subscription services, DMV for driver\'s license and vehicle registration, voter registration, and the IRS (Form 8822). Start this list 4 weeks before moving.',
            resources: ['https://moversguide.usps.com/', 'https://www.irs.gov/faqs/irs-procedures/address-changes/address-changes']
          },
          {
            order: 3,
            title: 'Vet Moving Companies Thoroughly',
            description: 'Get at least 3 written estimates. Check each company on the FMCSA database for licensing and complaint history. Read recent reviews (sort by newest, not highest rated). Ask about: binding vs non-binding estimates, insurance coverage for damage, extra fees for stairs/elevators/long carries, and their cancellation policy. For interstate moves, movers must provide the "Your Rights and Responsibilities When You Move" booklet. Red flags: large upfront deposits, company name changes recently, significantly lower estimate than others.',
            resources: ['https://www.fmcsa.dot.gov/protect-your-move']
          },
          {
            order: 4,
            title: 'Transfer or Set Up Utilities',
            description: 'Create a list of every utility at your current home (electricity, gas, water, internet, cable, trash, security system) and schedule disconnection for the day after you move out. For your new home: call utility providers 2-3 weeks ahead to schedule connection for the day before you arrive. Some utilities require deposits for new accounts — ask about this when scheduling. Take photos of meter readings on move-out and move-in days. Pro tip: many internet providers offer "moving" promotions — call and ask rather than signing up online.',
            resources: []
          },
          {
            order: 5,
            title: 'Pack Strategically, Not Frantically',
            description: 'Start with the rooms you use least (guest room, storage, formal dining). Label every box on two sides with: room destination, contents summary, and priority (1 = need immediately, 2 = need within a week, 3 = can wait). Pack a "First Night" box with: bedding, towels, toiletries, toilet paper, phone chargers, basic tools, snacks, paper plates/cups, and one change of clothes per person. Use color-coded tape or labels by room to make unloading faster. Take photos of electronics cabling before disconnecting.',
            resources: []
          },
          {
            order: 6,
            title: 'Settle In: The First Week',
            description: 'Unpack by priority: bedroom setup (sleep), bathroom setup (hygiene), kitchen setup (food), then everything else. Locate: nearest hospital/urgent care, grocery store, pharmacy, hardware store, and post office. Introduce yourself to neighbors — they are your best source for local recommendations. Register with a new primary care doctor and dentist if you have moved far. Update your address in any recurring delivery services (Amazon, meal kits, pet food).',
            resources: []
          }
        ],
        checklist: [
          'Create 8-week moving timeline with weekly milestones',
          'Declutter: donate, sell, or discard items you do not want to move',
          'Research and get 3 written estimates from moving companies',
          'Check mover licensing and complaint history on FMCSA database',
          'Book moving company or truck rental',
          'Order moving supplies (boxes, tape, bubble wrap, mattress bags, markers)',
          'File USPS change of address online',
          'Update address with: banks, credit cards, employer payroll',
          'Update address with: insurance providers (auto, health, life, renters)',
          'Update address with: investment and retirement accounts',
          'Update address with: DMV, voter registration, IRS',
          'Notify subscription services and recurring deliveries',
          'Schedule utility disconnection at current home',
          'Schedule utility connection at new home',
          'Transfer or set up internet service at new address',
          'Pack non-essential rooms first (guest room, storage, decor)',
          'Label all boxes with room, contents, and priority level',
          'Pack a "First Night" essentials box',
          'Take photos of electronics wiring before disconnecting',
          'Photograph meter readings on move-out day',
          'Do final walkthrough of old home, check all rooms and closets',
          'Locate nearby hospital, pharmacy, grocery, and hardware store',
          'Register with new primary care physician and dentist'
        ],
        templates: [
          { name: 'Moving Timeline Planner', description: '8-week countdown template with tasks for each week and pre-move milestones.' },
          { name: 'Moving Company Comparison Sheet', description: 'Side-by-side comparison template for estimates, insurance, and key questions for each mover.' },
          { name: 'Change-of-Address Master List', description: 'Comprehensive checklist of every institution, service, and subscription to update with your new address.' },
          { name: 'Home Inventory Worksheet', description: 'Room-by-room inventory template to track items and their condition before and after the move.' }
        ],
        tips: [
          'Book movers for mid-week and mid-month if possible — demand (and prices) spike on weekends and month-ends.',
          'Moving blankets are cheaper to buy in bulk than to rent from moving companies. You can resell them afterward.',
          'Do not pack anything you would not want a stranger to see — moving crews open every box they carry.',
          'Take photos of every room before and after moving out. These are invaluable if there are damage or deposit disputes.',
          'If moving for a job, ask your new employer about relocation reimbursement — many companies cover costs that you do not ask about.',
          'Keep important documents (passports, birth certificates, financial records) with you during the move — never in the moving truck.'
        ]
      })
    },
    {
      title: 'Financial Reset Kit',
      description: 'Take control of your finances — prioritize debt, audit expenses, build an emergency fund, and communicate with creditors using proven templates.',
      category: 'financial',
      price_cents: 2400,
      content: kit({
        overview: "Financial stress is overwhelming — but clarity is the antidote. This kit helps you face your full financial picture without judgment, create a practical plan to stabilize and improve your situation, and gives you the exact scripts and templates you need to negotiate with creditors, reduce expenses, and build a safety net. No guilt, no unrealistic advice — just a clear, compassionate path forward.",
        steps: [
          {
            order: 1,
            title: 'The Full Financial Snapshot',
            description: 'Before you can fix anything, you need to see everything. List every account: checking, savings, credit cards, loans, and any debts. For each, write down the balance, interest rate, and minimum payment. List every source of income. This exercise is uncomfortable but essential — you cannot solve what you cannot see. Use a simple spreadsheet or even a notebook. The goal here is awareness, not judgment.',
            resources: []
          },
          {
            order: 2,
            title: 'Conduct a 90-Day Expense Audit',
            description: 'Go through the last 3 months of bank and credit card statements. Categorize every expense: housing, utilities, food (split groceries vs restaurants), transportation, insurance, subscriptions, debt payments, discretionary spending. Identify the "big three" — housing, transportation, and food typically account for 60-70% of spending. These are where the biggest savings opportunities live. Subscriptions and impulse purchases add up but are rarely the root cause of financial strain.',
            resources: []
          },
          {
            order: 3,
            title: 'Prioritize Your Debts Strategically',
            description: 'There are two proven methods. Avalanche method (mathematically optimal): list debts by interest rate, pay minimum on all, throw every extra dollar at the highest-rate debt. Snowball method (psychologically motivating): list debts by balance, smallest to largest, pay minimum on all, throw every extra dollar at the smallest. Avalanche saves more money; snowball builds momentum faster. Choose the method that you are more likely to stick with. Either way, never miss a minimum payment.',
            resources: []
          },
          {
            order: 4,
            title: 'Negotiate with Creditors (Yes, You Can)',
            description: 'Creditors would rather get paid something than nothing. You can negotiate: lower interest rates (especially if you have a history of on-time payments), waived late fees, modified payment plans, and in some cases, settlement offers. Call during business hours, be polite and direct, and have your account information ready. Script: "I am experiencing financial hardship and want to discuss options to keep my account in good standing. Can we review my interest rate or discuss a modified payment plan?" If the first person says no, politely ask to speak with a supervisor.',
            resources: ['https://www.consumerfinance.gov/consumer-tools/debt-collection/']
          },
          {
            order: 5,
            title: 'Build Your Emergency Fund Foundation',
            description: 'The goal is eventually 3-6 months of essential expenses. But start with a micro-goal: $1,000. This small buffer prevents a single unexpected expense from triggering a debt spiral. Keep it in a separate savings account — not your checking account — so it is accessible but not too easy to dip into. Automate a small weekly transfer ($20-50) to this account. Once you hit $1,000, slowly build toward one month of expenses, then three.',
            resources: []
          },
          {
            order: 6,
            title: 'Design a Budget That Actually Works',
            description: 'Forget rigid budgets that feel like punishment. Try the 50/30/20 framework: 50% of take-home pay for needs (housing, utilities, groceries, minimum debt payments, insurance), 30% for wants, 20% for savings and extra debt payments. If your needs exceed 50%, focus on reducing the big three before cutting small joys. Use a budgeting method that matches your personality: zero-based (every dollar has a job), envelope system (cash for discretionary categories), or automation (bills and savings auto-transfer, rest is yours).',
            resources: []
          }
        ],
        checklist: [
          'List every account with balance, interest rate, and minimum payment',
          'List every source of monthly income',
          'Pull last 3 months of bank and credit card statements',
          'Categorize every expense from the past 90 days',
          'Identify top 3 expense categories by total spend',
          'List all debts ordered by interest rate (avalanche) or balance (snowball)',
          'Identify subscriptions to cancel or pause',
          'Call 3 largest creditors to negotiate interest rates or payment plans',
          'Open a separate savings account for emergency fund',
          'Set up automatic weekly transfer of $20-50 to emergency fund',
          'Calculate your 50/30/20 allocation for current income',
          'Identify one "big three" expense to reduce this month',
          'Set up autopay for all minimum debt payments',
          'Review your credit report at annualcreditreport.com'
        ],
        templates: [
          { name: 'Creditor Negotiation Phone Script', description: 'Word-for-word script for calling creditors to request lower rates, fee waivers, or payment plans.' },
          { name: 'Hardship Letter to Creditor', description: 'Formal letter template explaining financial hardship and requesting modified payment terms.' },
          { name: 'Monthly Budget Worksheet (50/30/20)', description: 'Structured budget template based on the 50/30/20 framework with automated calculations.' },
          { name: 'Debt Payoff Tracker', description: 'Visual tracker to monitor debt balances, interest saved, and progress toward payoff.' },
          { name: 'Expense Audit Spreadsheet', description: 'Template for categorizing and analyzing 90 days of expenses to find savings opportunities.' }
        ],
        tips: [
          'A simple phone call to your credit card company can reduce your APR by 5-15% — but almost nobody asks. Be polite, persistent, and mention your history as a customer.',
          'Your credit score matters less than your financial stability. Do not prioritize credit score over eating or keeping the lights on.',
          'Debt consolidation loans only help if you have fixed the spending patterns that created the debt in the first place. Address the root cause first.',
          'Automate everything you can: bill payments, savings transfers, investment contributions. Willpower is a finite resource — systems outlast motivation.',
          'The single biggest expense-reduction lever for most people is housing. If rent/mortgage exceeds 35% of take-home pay, consider this a structural problem that needs a structural solution.',
          'Financial progress is not linear. A month where you break even is not a failure — it is stability. Celebrate not going backward.'
        ]
      })
    },
    {
      title: 'First-Time Renter Kit',
      description: 'Rent your first apartment with confidence — lease review checklists, security deposit guides, move-in inspections, and roommate agreement templates.',
      category: 'housing',
      price_cents: 1500,
      content: kit({
        overview: "Renting your first apartment is exciting — but also full of hidden pitfalls that can cost you thousands. This kit gives you the knowledge and tools to spot red flags in a lease, document your apartment's condition to protect your security deposit, understand your rights as a tenant, and set up roommate relationships that survive the lease term. Whether you are moving out of your parents' house or renting for the first time after a major life change, this kit has you covered.",
        steps: [
          {
            order: 1,
            title: 'Know Your Budget (and What Landlords Look For)',
            description: 'The 30% rule: your rent should not exceed 30% of your gross monthly income. But also account for: utilities (ask the landlord for average monthly costs), renters insurance (~$15-25/month), parking fees, and one-time costs (security deposit, first/last month rent, moving costs). Landlords typically require: gross income of 3x monthly rent, credit score of 650+, and positive rental history or a co-signer. Gather pay stubs, bank statements, and references before you start touring.',
            resources: []
          },
          {
            order: 2,
            title: 'The Apartment Inspection Checklist',
            description: 'Never rent an apartment you have not seen in person. During the tour, test everything: run all faucets and check water pressure, flush toilets, open and close every window, check for working smoke and CO detectors, look under sinks for water damage or mold, check outlets with a phone charger, note any odors (musty = moisture problems), check cell reception in every room, and ask about pest history. Visit the neighborhood at different times of day — what is quiet at 2pm may be loud at 10pm.',
            resources: []
          },
          {
            order: 3,
            title: 'Decode Your Lease (Red Flags to Spot)',
            description: 'Read the entire lease before signing. Key sections to scrutinize: rent amount and due date (including late fees — some are illegal), lease term and renewal/termination terms, security deposit amount and conditions for return (must be itemized and returned within state-mandated timeframe, usually 14-30 days), maintenance responsibilities (who handles what and response-time guarantees), subletting and guest policies, pet policies and fees, and any mandatory fees beyond rent (trash, pest control, "administrative" fees). Red flags: automatic renewal clauses, excessive late fees, clauses waiving your right to notice before entry, and any terms that seem to override state tenant laws.',
            resources: ['https://www.hud.gov/topics/rental_assistance/tenantrights']
          },
          {
            order: 4,
            title: 'Protect Your Security Deposit',
            description: 'Your security deposit (typically 1-2 months rent) is your money — the landlord must justify any deductions. Before moving a single box in, do a thorough move-in inspection: photograph every wall, floor, appliance, fixture, and window from multiple angles. Document every scratch, dent, stain, or issue in writing and send it to your landlord within the timeframe specified by your lease or state law (usually 3-7 days). Keep dated copies. This documentation is your best protection against unfair deductions when you move out.',
            resources: []
          },
          {
            order: 5,
            title: 'Get Renters Insurance (Seriously)',
            description: "Your landlord's insurance covers the building — not your belongings. Renters insurance costs $15-25/month and covers: personal property (furniture, electronics, clothes — easily $15,000+), liability (if someone is injured in your apartment), and additional living expenses (if your apartment becomes uninhabitable). Most policies also cover items stolen from your car or while traveling. Bundle with auto insurance for a discount. This is not optional — it is the best $20/month you will ever spend.",
            resources: []
          },
          {
            order: 6,
            title: 'Set Up a Roommate Agreement',
            description: 'Even (especially) if you are moving in with a friend, create a written roommate agreement. Cover: how rent and utilities are split, who pays which bills and when they are due, cleaning responsibilities and frequency, guest policy (how often overnight guests are okay), quiet hours, shared item purchases (who owns the couch?), food sharing rules, and how to handle it if someone wants to move out early. Sign it. It feels awkward now but prevents relationship-ending conflict later.',
            resources: []
          }
        ],
        checklist: [
          'Calculate total move-in costs (first month + security deposit + last month + moving)',
          'Gather pay stubs (last 3), bank statements, and references',
          'Tour at least 3 apartments and complete inspection checklist for each',
          'Visit neighborhood at different times (daytime, evening, weekend)',
          'Check rent affordability: is rent ≤ 30% of gross monthly income?',
          'Read entire lease before signing — flag anything unclear',
          'Verify late fee is reasonable and legal in your state',
          'Confirm security deposit return policy and timeframe',
          'Complete move-in inspection with dated photos of every room',
          'Send documented pre-existing damage to landlord in writing within deadline',
          'Purchase renters insurance ($15-25/month)',
          'Set up utilities in your name (electric, gas, internet, water if applicable)',
          'Create and sign roommate agreement if applicable',
          'Save landlord contact info and emergency maintenance number',
          'Locate circuit breaker, water shutoff valve, and fire extinguisher'
        ],
        templates: [
          { name: 'Move-In Inspection Report', description: 'Detailed room-by-room inspection form with photo log to document apartment condition before move-in.' },
          { name: 'Roommate Agreement Template', description: 'Comprehensive roommate contract covering bills, cleaning, guests, quiet hours, and conflict resolution.' },
          { name: 'Lease Red-Flag Checklist', description: 'One-page reference of lease terms to watch for and questions to ask before signing.' },
          { name: 'Rental Application Organizer', description: 'Template to track applications, fees, and communications across multiple apartments during your search.' }
        ],
        tips: [
          'Never pay a deposit or application fee before seeing the apartment in person. Scammers list fake rentals to collect "application fees."',
          'Photograph every inch of the apartment before move-in. Every wall, floor, appliance, and fixture. Email the photos to yourself so they are date-stamped.',
          'Get every promise from the landlord in writing. "Will fix before move-in" means nothing if it is not in an email or lease addendum.',
          'Your lease overrides verbal promises. If the landlord says pets are fine but the lease says no pets, the lease wins. Get it in writing.',
          'Renters insurance is often required by the lease — but even when optional, skipping it is risking $15,000+ to save $20/month.',
          "Know your state's tenant rights. Laws about security deposits, landlord entry, habitability, and eviction vary significantly by state."
        ]
      })
    },
    {
      title: 'Career Pivot Kit',
      description: 'Plan and execute a career change with confidence — skills audit, resume overhaul, LinkedIn optimization, networking strategy, interview prep, and salary negotiation.',
      category: 'career',
      price_cents: 3400,
      content: kit({
        overview: "Changing careers is brave — and daunting. This kit provides a structured, step-by-step system to identify your transferable skills, research new fields, rebuild your professional brand, network into your target industry, and negotiate a compelling offer. Whether you are shifting to an adjacent field or making a complete leap, this guide turns the overwhelming into the achievable.",
        steps: [
          {
            order: 1,
            title: 'Conduct a Skills Audit & Transferability Map',
            description: "List every skill you have used in your career — technical skills, soft skills, industry knowledge, tools, and methodologies. For each skill, rate your proficiency (beginner/intermediate/advanced/expert). Now research job descriptions in your target field. Map your existing skills to what those roles require. You will discover you have more transferable skills than you think. The gaps you identify become your upskilling plan. Skills that transfer across almost every field: project management, communication, data analysis, people management, client relations, problem-solving, and writing.",
            resources: ['https://www.onetonline.org/']
          },
          {
            order: 2,
            title: 'Research Your Target Industry Deeply',
            description: 'Before investing in a pivot, validate your direction. Talk to at least 5 people currently working in your target role or industry. Ask: what does a typical day look like? What is the hardest part? What skills matter most? What is the realistic salary range at different levels? What do you wish you had known before entering this field? Read industry publications, follow leaders on LinkedIn, attend virtual events or webinars. Identify whether you need additional certifications, degrees, or portfolio projects — some industries have hard requirements, others just care about demonstrated ability.',
            resources: []
          },
          {
            order: 3,
            title: 'Rebuild Your Resume for the Pivot',
            description: 'A career-change resume is different from a traditional one. Lead with a powerful summary that explicitly states your pivot: "Project manager with 8 years in construction transitioning into tech operations, bringing expertise in cross-functional team leadership and process optimization." Reframe past experience through the lens of your target role. Replace industry-specific jargon with transferable descriptions. Add a "Relevant Projects" section showcasing any side projects, certifications, or volunteer work in your target field. Use the same keywords that appear in job descriptions for your target role.',
            resources: []
          },
          {
            order: 4,
            title: 'Optimize LinkedIn for the Pivot',
            description: 'Your LinkedIn profile needs to tell the story of where you are going, not just where you have been. Update your headline to include your target role (e.g., "Aspiring Product Manager | Customer Insights & Data-Driven Strategy"). Rewrite your About section as a narrative about your pivot: why you are making the change, what you bring, and what you are looking for. Add skills relevant to your target field. Engage with content in your target industry — comment thoughtfully, share relevant articles. This signals genuine interest to recruiters and hiring managers.',
            resources: []
          },
          {
            order: 5,
            title: 'Build a Networking Strategy That Works',
            description: 'Most career pivots happen through people, not applications. Set a goal of 2-3 informational conversations per week. Reach out to people in your target field — not to ask for a job, but to learn. Your message: "I am transitioning into [field] and your career path is inspiring. Would you be open to a 15-minute call? I would love to hear about your experience." Prepare thoughtful questions. Send a thank-you note within 24 hours. Stay in touch periodically. These conversations often lead to referrals, introductions, and unposted job opportunities.',
            resources: []
          },
          {
            order: 6,
            title: 'Prepare for Pivot Interviews',
            description: `Career-change interviews will focus on: why you are pivoting (have a compelling, positive narrative — not "I hated my old job"), how your background is an asset (come armed with specific examples), and what you have done to prepare (courses, projects, self-study). Prepare a concise "transition story" that connects your past to your future. Anticipate skepticism: "You do not have direct experience in this field" — your response should acknowledge the gap and immediately pivot to your transferable strengths and recent preparation. Always have thoughtful questions that show industry knowledge.`,
            resources: []
          },
          {
            order: 7,
            title: 'Negotiate Your Offer Strategically',
            description: 'Career changers often undervalue themselves, accepting less than they are worth. Research salary ranges thoroughly before negotiating (use Glassdoor, Levels.fyi, industry surveys, and informational interview data). Remember: your transferable experience has real value — you bring perspective and skills that industry lifers may lack. When you receive an offer: express enthusiasm, ask for time to review (48 hours is standard), then make a counteroffer based on market data, not personal need. Negotiate total compensation, not just salary: signing bonus, relocation, professional development budget, title, and start date flexibility all have value.',
            resources: ['https://www.glassdoor.com/Salaries/', 'https://www.levels.fyi/']
          }
        ],
        checklist: [
          'Complete skills audit with proficiency ratings for every skill',
          'Map transferable skills to 5 job descriptions in target field',
          'Identify skill gaps and create upskilling plan',
          'Conduct at least 5 informational interviews with people in target field',
          'Read 3 industry publications or books in target field',
          'Attend at least 1 virtual event or webinar in target industry',
          'Rewrite resume with pivot-focused summary and transferable framing',
          'Update LinkedIn headline to include target role keywords',
          'Rewrite LinkedIn About section as pivot narrative',
          'Add 10+ target-field skills to LinkedIn profile',
          'Engage with 3 target-industry posts per week on LinkedIn',
          'Create a target company list (20-30 companies in target field)',
          'Schedule 2-3 informational conversations per week',
          'Prepare and practice your "transition story" for interviews',
          'Research salary ranges for target role at 3 levels (entry, mid, senior)',
          'Build at least 1 portfolio project or earn 1 certification in target field'
        ],
        templates: [
          { name: 'Skills Audit & Transferability Matrix', description: 'Structured worksheet to inventory your skills and map them to target-role requirements.' },
          { name: 'Informational Interview Request Template', description: 'Proven outreach message templates (cold email and LinkedIn) that get positive responses.' },
          { name: 'Career-Change Resume Template', description: 'Resume format optimized for career pivots, emphasizing transferable skills and relevant projects.' },
          { name: 'Target Company Tracker', description: 'Spreadsheet to track research, contacts, applications, and follow-ups across target companies.' },
          { name: 'Salary Negotiation Script', description: 'Word-for-word scripts for negotiating salary, benefits, and total compensation as a career changer.' }
        ],
        tips: [
          'The best time to pivot is while you still have a job. Financial pressure leads to rushed decisions and weaker negotiating position.',
          'Informational interviews are not job interviews — never ask for a job. Ask for insight. The job opportunities will follow naturally.',
          'Your resume does not need to show a linear path. A clear pivot narrative is more compelling than a confusingly crafted linear story.',
          'LinkedIn engagement is a superpower. Commenting thoughtfully on 3-5 posts per week in your target industry dramatically increases profile views.',
          'Career changers often bring the most innovative perspectives to a team. Frame your "outsider" status as a strength, not a weakness.',
          'The first offer is rarely the best offer. 85% of employers expect you to negotiate — not negotiating can leave $5,000-20,000+ on the table.'
        ]
      })
    },
    {
      title: 'Paperwork Overhaul Kit',
      description: 'Tame the paper chaos — a complete system to categorize, digitize, and secure your important documents, with clear rules for what to keep, shred, and back up.',
      category: 'organization',
      price_cents: 1200,
      content: kit({
        overview: "Paperwork accumulates silently until one day you cannot find your car title, have no idea where your tax returns are, and your important documents are scattered between a filing cabinet, three drawers, and a shoebox. This kit provides a complete system to organize every important document in your life — categorize them, decide what to keep vs shred, create a digital backup strategy, and build a system that stays organized. Future you will be grateful.",
        steps: [
          {
            order: 1,
            title: 'Do the Great Paper Roundup',
            description: 'Gather every piece of paper from every location in your home. Every drawer, folder, stack, envelope, and shoebox. Dump it all on a large surface (dining table, floor). This feels chaotic but is essential — you cannot organize what you have not gathered. Include digital clutter too: downloads folder, desktop files, email attachments. The full picture is the first step to order.',
            resources: []
          },
          {
            order: 2,
            title: 'Sort Using the ACT System (Archive / Current / Trash)',
            description: 'Go through every item and sort into three piles. ARCHIVE: documents you need to keep long-term but rarely access (tax returns, past year bank statements, closed account records, paid-off loan documents, old insurance policies). CURRENT: documents you need to access in the next 12 months (current insurance policies, active loan documents, current year tax documents, pending applications, warranties for items you own). TRASH: anything you do not need — junk mail, expired coupons, old utility bills (unless needed for tax/business purposes), duplicate copies, documents for accounts you no longer have and have been closed for 3+ years. Be ruthless with the trash pile.',
            resources: []
          },
          {
            order: 3,
            title: 'Categorize into the 10 Life Categories',
            description: 'Sort your Archive and Current piles into labeled folders by category: (1) Identification — birth certificates, passports, social security cards, marriage/divorce decrees. (2) Financial — bank statements, investment accounts, retirement, credit reports. (3) Tax — returns and supporting documents for the past 7 years. (4) Employment — offer letters, pay stubs, performance reviews, employment contracts. (5) Housing — lease/mortgage, property tax, home insurance, repair records. (6) Insurance — health, auto, life, disability policies and correspondence. (7) Medical — vaccination records, test results, prescription lists, medical history. (8) Legal — wills, power of attorney, contracts, court documents. (9) Education — transcripts, diplomas, certifications, professional licenses. (10) Vehicles — titles, registration, maintenance records, loan documents.',
            resources: []
          },
          {
            order: 4,
            title: 'Build Your Digital Backup System',
            description: 'Scan every document in the "Identification" and "Legal" categories. For other categories, scan key documents and keep a digital index of what physical documents you have and where they are stored. Use a consistent naming convention: Category_Year_Description (e.g., Tax_2024_Return_Federal.pdf). Store scanned documents in at least two places: a local encrypted folder and a secure cloud backup. For highly sensitive documents (tax returns, identity documents), consider encrypting the files before uploading to cloud storage. Keep a one-page "Document Locator" that lists where every important document can be found — physical location and digital filename.',
            resources: []
          },
          {
            order: 5,
            title: 'Know What to Keep and for How Long',
            description: "Tax returns and supporting documents: 7 years (IRS audit window). Bank and credit card statements: 3 years (unless needed for tax purposes). Pay stubs: 1 year (reconcile with W-2, then shred). Medical records: 5 years from treatment date. Insurance policies: current policy plus 3 years. Vehicle records: while you own the vehicle. Home improvement records: while you own the home plus 7 years (affects capital gains). Warranties: while active. Estate planning documents: permanently. Birth certificates, passports, social security cards: permanently. When in doubt, scan before shredding old documents — digital storage is effectively free.",
            resources: []
          },
          {
            order: 6,
            title: 'Maintain the System (10 Minutes a Week)',
            description: 'The best system is one you will actually maintain. Set a recurring 10-minute weekly appointment to process incoming paper: open mail, recycle junk immediately, file anything important in its category folder, and add action items (bills to pay, forms to complete) to your to-do list. Once a year, do a 1-hour annual review: shred documents that have passed their retention period, update your Document Locator, verify your digital backups are working, and ensure your emergency documents (passports, insurance cards) are accessible.',
            resources: []
          }
        ],
        checklist: [
          'Gather all paperwork from every location in your home',
          'Sort everything into Archive, Current, and Trash piles',
          'Shred or securely dispose of Trash pile',
          'Create labeled folders or binders for each of the 10 life categories',
          'File Archive and Current documents into category folders',
          'Scan all Identification and Legal category documents',
          'Scan key documents from remaining categories',
          'Use consistent file naming: Category_Year_Description',
          'Store scans in local encrypted folder AND secure cloud backup',
          'Create a Document Locator listing where everything is stored',
          'Review retention guidelines and shred expired documents',
          'Set up a weekly 10-minute paperwork processing habit',
          'Schedule an annual document review on your calendar',
          'Verify emergency documents are accessible (passports, insurance cards, IDs)'
        ],
        templates: [
          { name: 'Document Locator Master List', description: 'One-page template listing every important document, its physical location, and its digital filename.' },
          { name: 'Retention Timeline Reference', description: 'Quick-reference guide for how long to keep each type of document before securely shredding.' },
          { name: 'Category Folder Labels', description: 'Printable labels for the 10 life categories to create a consistent physical filing system.' },
          { name: 'Weekly Processing Checklist', description: '10-minute weekly routine checklist to keep paperwork organized going forward.' }
        ],
        tips: [
          'The "touch it once" rule: when you pick up a piece of paper, make a decision immediately — file it, act on it, or recycle it. Never put it back down for "later."',
          'Digital storage is effectively free. When in doubt about whether to keep a document, scan it and shred the physical copy.',
          'Your most critical documents (passports, birth certificates, insurance policies) should be accessible within 5 minutes, even in an emergency.',
          'Do not keep paper copies of documents that are available online through secure portals (bank statements, utility bills) unless needed for tax purposes.',
          'A fireproof and waterproof safe or lockbox is worth the $50-100 investment for storing irreplaceable original documents.',
          'Tax professionals recommend keeping tax returns and supporting documents for 7 years, not 3. The IRS can audit up to 6 years back if they suspect substantial underreporting.'
        ]
      })
    }
  ];

  const insert = db.prepare(
    'INSERT INTO kits (title, description, category, price_cents, content) VALUES (?, ?, ?, ?, ?)'
  );

  const insertAll = db.transaction(() => {
    for (const kit of kits) {
      insert.run(kit.title, kit.description, kit.category, kit.price_cents, kit.content);
    }
  });

  insertAll();
  console.log(`Seeded ${kits.length} Life Kits.`);
}
