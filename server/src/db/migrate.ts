// Database migration — creates all tables for MyCTRL
// Adapted from the production PostgreSQL schema to SQLite.
// PostgreSQL migration path: switch to UUID PKs, ENUM types, JSONB, and enable RLS.
import { Database } from 'bun:sqlite';
import path from 'path';
import { seedKits } from './seedKits';

const DB_PATH = process.env.DATABASE_URL || path.join(import.meta.dirname, '..', '..', 'lifectrl.db');

export function migrate(dbPath?: string): Database {
  const db = new Database(dbPath || DB_PATH);

  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA foreign_keys = ON');

  // ── Users & Subscription State (Stripe Synchronization Hub) ──
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      stripe_customer_id TEXT,
      stripe_subscription_status TEXT NOT NULL DEFAULT 'unpaid'
        CHECK(stripe_subscription_status IN ('unpaid','active','past_due','canceled','incomplete','incomplete_expired','trialing','paused')),
      tos_accepted_at TEXT,
      privacy_policy_accepted_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate: add columns if they don't exist (for existing databases)
  const userCols = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  const userColNames = new Set(userCols.map(c => c.name));
  if (!userColNames.has('tos_accepted_at')) db.run('ALTER TABLE users ADD COLUMN tos_accepted_at TEXT');
  if (!userColNames.has('privacy_policy_accepted_at')) db.run('ALTER TABLE users ADD COLUMN privacy_policy_accepted_at TEXT');
  if (!userColNames.has('stripe_customer_id')) db.run('ALTER TABLE users ADD COLUMN stripe_customer_id TEXT');
  if (!userColNames.has('stripe_subscription_status')) {
    // SQLite doesn't support ADD COLUMN with DEFAULT + CHECK in ALTER TABLE,
    // so we add a plain column and rely on application logic for the default.
    db.run("ALTER TABLE users ADD COLUMN stripe_subscription_status TEXT NOT NULL DEFAULT 'unpaid'");
  }

  // ── Action Plans (Master Life Action Plans) ──
  // Maps to production action_plans table.
  // PostgreSQL: plan_id UUID PK, plan_status ENUM, raw_narrative, jurisdiction_code.
  // SQLite adaptation: INTEGER PK, status TEXT with CHECK, raw_narrative / jurisdiction_code as TEXT.
  db.run(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      situation TEXT NOT NULL DEFAULT '',
      raw_narrative TEXT NOT NULL DEFAULT '',
      jurisdiction_code TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active'
        CHECK(status IN ('draft','processing','active','completed','archived')),
      disclaimer TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate: add production columns to existing plans table
  const planCols = db.prepare("PRAGMA table_info(plans)").all() as { name: string }[];
  const planColNames = new Set(planCols.map(c => c.name));
  if (!planColNames.has('disclaimer')) db.run("ALTER TABLE plans ADD COLUMN disclaimer TEXT NOT NULL DEFAULT ''");
  if (!planColNames.has('raw_narrative')) db.run("ALTER TABLE plans ADD COLUMN raw_narrative TEXT NOT NULL DEFAULT ''");
  if (!planColNames.has('jurisdiction_code')) db.run("ALTER TABLE plans ADD COLUMN jurisdiction_code TEXT NOT NULL DEFAULT ''");

  // ── Plan Tasks (Jurisdiction-aware, dependency-ready) ──
  // Maps to production plan_tasks table.
  // PostgreSQL: task_id UUID PK, domain_name, task_priority ENUM, sequence_order INT, metadata JSONB.
  // SQLite adaptation: INTEGER PK, priority INTEGER with CHECK, metadata as TEXT (JSON string).
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      domain_name TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority INTEGER NOT NULL DEFAULT 0
        CHECK(priority >= 0 AND priority <= 5),
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK(status IN ('pending','in_progress','completed')),
      sequence_order INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT '',
      resources TEXT NOT NULL DEFAULT '',
      estimated_time TEXT NOT NULL DEFAULT '',
      metadata TEXT NOT NULL DEFAULT '{}',
      due_date TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate: add production columns to existing tasks table
  const taskCols = db.prepare("PRAGMA table_info(tasks)").all() as { name: string }[];
  const taskColNames = new Set(taskCols.map(c => c.name));
  if (!taskColNames.has('category')) db.run("ALTER TABLE tasks ADD COLUMN category TEXT NOT NULL DEFAULT ''");
  if (!taskColNames.has('resources')) db.run("ALTER TABLE tasks ADD COLUMN resources TEXT NOT NULL DEFAULT ''");
  if (!taskColNames.has('estimated_time')) db.run("ALTER TABLE tasks ADD COLUMN estimated_time TEXT NOT NULL DEFAULT ''");
  if (!taskColNames.has('domain_name')) db.run("ALTER TABLE tasks ADD COLUMN domain_name TEXT NOT NULL DEFAULT ''");
  if (!taskColNames.has('sequence_order')) db.run('ALTER TABLE tasks ADD COLUMN sequence_order INTEGER NOT NULL DEFAULT 0');
  if (!taskColNames.has('metadata')) db.run("ALTER TABLE tasks ADD COLUMN metadata TEXT NOT NULL DEFAULT '{}'");

  // ── Task Dependencies (Core Proprietary Dependency Graph) ──
  // PostgreSQL: dependency_id UUID PK, dep_type ENUM, chk_no_self_dependence constraint.
  // SQLite adaptation: INTEGER PK, dep_type TEXT with CHECK, self-dependence CHECK.
  db.run(`
    CREATE TABLE IF NOT EXISTS task_dependencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      upstream_task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      downstream_task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      dep_type TEXT NOT NULL DEFAULT 'hard_block'
        CHECK(dep_type IN ('hard_block','recommended','parallel')),
      CONSTRAINT chk_no_self_dependence CHECK (upstream_task_id <> downstream_task_id)
    )
  `);

  // ── Documents ──
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'general',
      summary TEXT,
      file_type TEXT NOT NULL DEFAULT '',
      file_size INTEGER NOT NULL DEFAULT 0,
      key_details TEXT NOT NULL DEFAULT '[]',
      ai_processed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Migrate documents table: add columns if they don't exist
  const docCols = db.prepare("PRAGMA table_info(documents)").all() as { name: string }[];
  const docColNames = new Set(docCols.map(c => c.name));
  if (!docColNames.has('file_type')) db.run("ALTER TABLE documents ADD COLUMN file_type TEXT NOT NULL DEFAULT ''");
  if (!docColNames.has('file_size')) db.run('ALTER TABLE documents ADD COLUMN file_size INTEGER NOT NULL DEFAULT 0');
  if (!docColNames.has('key_details')) db.run("ALTER TABLE documents ADD COLUMN key_details TEXT NOT NULL DEFAULT '[]'");
  if (!docColNames.has('ai_processed')) db.run('ALTER TABLE documents ADD COLUMN ai_processed INTEGER NOT NULL DEFAULT 0');

  // ── Vault Items ──
  db.run(`
    CREATE TABLE IF NOT EXISTS vault_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      document_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Life Kits ──
  db.run(`
    CREATE TABLE IF NOT EXISTS kits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general',
      price_cents INTEGER NOT NULL DEFAULT 0,
      content TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Purchases ──
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kit_id INTEGER NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
      purchased_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Concierge Bookings ──
  db.run(`
    CREATE TABLE IF NOT EXISTS concierge_bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      topic TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      preferred_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','completed','cancelled')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Feedback ──
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      page TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ── Performance Indexes ──
  db.run('CREATE INDEX IF NOT EXISTS idx_plans_user ON plans(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_plan ON tasks(plan_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_dependencies_plan ON task_dependencies(plan_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_vault_user ON vault_items(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_bookings_user ON concierge_bookings(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)');

  // ── Note: Row-Level Security (RLS) ──
  // In the production PostgreSQL schema, all tables have RLS policies that enforce
  // tenant isolation via JWT claims (request.jwt.claim.user_id). SQLite does not
  // support RLS. The application layer enforces user isolation through WHERE clauses
  // on every query. When migrating to PostgreSQL, enable RLS and apply the policies
  // defined in the production schema.

  // Seed kits if table is empty
  seedKits(db);

  // Seed institutional kits (always check, not just on first run)
  seedInstitutionalKits(db);

  return db;
}

function seedInstitutionalKits(db: Database): void {
  const existing = db.prepare('SELECT title FROM kits').all() as { title: string }[];
  const titles = new Set(existing.map(k => k.title));

  if (!titles.has('ReEntry Kit')) {
    db.prepare(`INSERT INTO kits (title, description, category, price_cents, content) VALUES (?, ?, ?, ?, ?)`).run(
      'ReEntry Kit',
      'A complete roadmap for returning citizens — from 30 days pre-release through 90-day stabilization. Covers ID procurement, benefits, housing, employment, probation compliance, and healthcare.',
      'reentry',
      4900,
      JSON.stringify({
        overview: "Returning to the community after incarceration is one of the most administratively complex transitions a person can face. In the first 72 hours alone, a returning citizen must navigate probation check-in, ID procurement, benefits applications, housing verification, medication access, and family reconnection — often without a smartphone, transportation, or stable housing. This kit provides a structured, day-by-day roadmap from 30 days pre-release through 90 days post-release. Every step includes plain-language instructions, required documents, government resource links, and deadline tracking.",
        steps: [
          { order: 1, title: "Secure Identification Documents", description: "Without ID, nothing else works. Request your birth certificate from vital records. Request replacement Social Security card (Form SS-5). Check if your state offers ID renewal grace period for expired licenses. Your release counselor can often fast-track these requests.", resources: ["https://www.ssa.gov/forms/ss-5.pdf", "https://www.vitalchek.com/", "https://www.dmv.pa.gov/"] },
          { order: 2, title: "Pre-Apply for Benefits (Medicaid, SNAP, SSI)", description: "Submit Medicaid application 2-3 weeks before release so coverage is active on Day 1. Submit SNAP application simultaneously. If you have a disability or MH condition, begin SSI/SSDI application. Your facility social worker should have the forms.", resources: ["https://www.healthcare.gov/", "https://www.fns.usda.gov/snap/", "https://www.ssa.gov/benefits/disability/"] },
          { order: 3, title: "Build Your Re-Entry Contact List", description: "Write down on paper: probation/parole officer, re-entry case manager, housing contact, closest family member, and treatment provider. If you don't have a phone yet, this paper list is your lifeline.", resources: [] },
          { order: 4, title: "Housing Plan — Confirm Where You're Sleeping Night 1", description: "Verify your release address. If halfway house or sober living, confirm bed availability and intake requirements. If returning to family, verify they are prepared. If no address, ask case manager about emergency housing vouchers or shelters with re-entry programs.", resources: ["https://www.hud.gov/states/pennsylvania/renting", "https://www.211.org/"] },
          { order: 5, title: "Report to Probation/Parole Immediately", description: "This is your #1 priority. Failure to report within the required timeframe can result in violation and return to custody. Bring release paperwork and ID. Ask for written copies of all supervision conditions.", resources: [] },
          { order: 6, title: "Pick Up Medications", description: "Fill prescriptions immediately — withdrawal, psychiatric decompensation, or missed doses can trigger crisis. Your release paperwork may include a 30-day prescription. Use GoodRx for discounts if uninsured. Community health centers offer sliding-scale fees.", resources: ["https://www.goodrx.com/", "https://findahealthcenter.hrsa.gov/"] },
          { order: 7, title: "Get Your State ID or Driver's License", description: "Go to the DMV with birth certificate, Social Security card, and release paperwork. Most states require 2 forms of ID and proof of address. Fee waivers may be available through re-entry programs.", resources: ["https://www.dmv.pa.gov/"] },
          { order: 8, title: "Activate Benefits — Medicaid, SNAP, Cash Assistance", description: "If you pre-applied, follow up to confirm activation. If not, apply immediately at your county assistance office. Bring ID, release paperwork, proof of address, and zero-income statement.", resources: ["https://www.dhs.pa.gov/Services/Assistance/", "https://www.benefits.gov/"] },
          { order: 9, title: "SUD/MH Treatment Intake", description: "Complete intake assessment in the first week if treatment is part of your supervision plan. Ask about medication-assisted treatment (MAT) if relevant. Ask about co-occurring disorder treatment if you have both MH and SUD needs.", resources: ["https://findtreatment.samhsa.gov/", "https://www.samhsa.gov/medication-assisted-treatment"] },
          { order: 10, title: "Open a Bank Account or Get a Prepaid Card", description: "Many banks offer second chance checking accounts. Avoid check-cashing stores — their fees drain your money. If you can't open a traditional account, get a low-fee prepaid debit card.", resources: ["https://www.bankrate.com/banking/second-chance-checking/"] },
          { order: 11, title: "Employment — Start Your Job Search", description: "Visit your local American Job Center (CareerLink in PA) for re-entry employment programs. Mention the Work Opportunity Tax Credit (WOTC) to employers — they get a tax credit for hiring you.", resources: ["https://www.careeronestop.org/", "https://www.pacareerlink.pa.gov/"] },
          { order: 12, title: "Permanent Housing Search", description: "Apply for Section 8 housing vouchers — waitlists are long but getting on matters. Search for landlords who accept returning citizens. Know your rights: HUD guidance says blanket bans on people with records may be discriminatory.", resources: ["https://www.hud.gov/topics/housing_choice_voucher_program_section_8"] },
          { order: 13, title: "Ongoing Compliance & Benefit Renewals", description: "Track every probation appointment, court date, treatment session, and benefit renewal deadline. SNAP and Medicaid require periodic renewal — mark dates now. If income changes, report immediately.", resources: ["https://www.ssa.gov/myaccount/"] }
        ],
        checklist: [
          "Birth certificate requested/received",
          "Social Security card requested/received",
          "State ID or driver's license obtained",
          "Medicaid application submitted",
          "SNAP application submitted",
          "Probation/parole check-in completed",
          "Medications picked up",
          "Housing confirmed for Night 1",
          "SUD/MH intake assessment completed",
          "Bank account or prepaid card obtained",
          "Job search started (CareerLink or equivalent)",
          "Permanent housing applications submitted",
          "Benefit renewal dates marked"
        ],
        templates: [
          { name: "Release Day Checklist", description: "One-page printable checklist for Day 1 priorities" },
          { name: "Appointment Tracker", description: "Simple grid: date, time, location, purpose, notes" },
          { name: "Contact Sheet", description: "Fillable form: PO, case manager, housing, family, treatment, employer" },
          { name: "Budget Worksheet", description: "Monthly income vs. expenses template" },
          { name: "Job Search Tracker", description: "Employer, position, date applied, follow-up, status" }
        ],
        tips: [
          "Paper is reliable when phones aren't. Write everything down.",
          "Ask for written copies of every requirement.",
          "Your PO is not your enemy but also not your friend. Be professional, on time, honest.",
          "The first 72 hours are the most dangerous for relapse and recidivism.",
          "Employers who participate in WOTC can get $2,400-$9,600 tax credit for hiring you.",
          "Most recidivism is from administrative failures, not new crimes.",
          "Keep copies of everything — release paperwork, benefit letters, lease agreements."
        ]
      })
    );
  }

  if (!titles.has('Recovery Kit')) {
    db.prepare(`INSERT INTO kits (title, description, category, price_cents, content) VALUES (?, ?, ?, ?, ?)`).run(
      'Recovery Kit',
      'A structured system for navigating SUD and mental health treatment while rebuilding your life. Covers treatment engagement, MAT, benefits, housing, employment, relapse prevention, and long-term recovery planning.',
      'recovery',
      4900,
      JSON.stringify({
        overview: "Recovery is not just about staying sober — it's about rebuilding a life while managing treatment schedules, medication regimens, benefits paperwork, housing requirements, court obligations, employment, and family responsibilities. Administrative chaos is one of the top drivers of treatment dropout: 50% of people leave SUD treatment within 90 days. This kit provides a structured system for navigating treatment and life administration simultaneously. Designed for individuals at any stage of recovery and for the case managers supporting them.",
        steps: [
          { order: 1, title: "Complete Intake and Assessment", description: "Be honest about your use history. The assessment determines level of care: outpatient, IOP, PHP, or residential. Ask specifically about co-occurring disorder treatment if you have both MH and SUD needs — treating one while ignoring the other reduces success rates.", resources: ["https://findtreatment.samhsa.gov/", "https://www.samhsa.gov/medication-assisted-treatment"] },
          { order: 2, title: "Develop Your Treatment Schedule and Commit", description: "Put every session on a calendar immediately. Missing sessions in IOP or PHP can result in discharge. If transportation, childcare, or work is a barrier, discuss it with your counselor now. Many programs offer telehealth or evening groups.", resources: [] },
          { order: 3, title: "Medication-Assisted Treatment (MAT) Management", description: "Understand your dosing schedule, clinic hours, and refill process for methadone, buprenorphine, naltrexone, or psychiatric medications. Never stop MAT abruptly. Ask: what happens if I miss a dose? Drug interactions to know?", resources: ["https://www.samhsa.gov/medication-assisted-treatment"] },
          { order: 4, title: "Verify Insurance and Understand Costs", description: "Confirm insurance covers your level of care and your provider is in-network. Ask about out-of-pocket costs and deductibles. If uninsured, ask about sliding-scale, state-funded slots, or SAMHSA block grants.", resources: ["https://www.healthcare.gov/", "https://www.samhsa.gov/grants"] },
          { order: 5, title: "Identify and Plan for Triggers", description: "Write down every situation, place, person, emotion, or time of day that triggers use or symptoms. For each, write a specific if-then plan. Common triggers: payday, certain neighborhoods, family conflict, boredom, celebration, loneliness, pain.", resources: [] },
          { order: 6, title: "Build Your Recovery Support Network", description: "Identify 3-5 people who support your recovery, including at least one person in recovery. Call or text one person daily for the first 30 days. Try different mutual support meetings: AA, NA, SMART Recovery, Recovery Dharma.", resources: ["https://www.aa.org/find-aa", "https://na.org/meetingsearch/", "https://www.smartrecovery.org/", "https://recoverydharma.org/"] },
          { order: 7, title: "Address Co-Occurring Medical Needs", description: "Schedule a primary care physical within 30 days. Untreated chronic pain, dental problems, hepatitis C, or HIV increase relapse risk. Community health centers often offer integrated medical, dental, and behavioral health.", resources: ["https://findahealthcenter.hrsa.gov/"] },
          { order: 8, title: "Housing Stability", description: "If in sober living, understand house rules thoroughly. If in transitional housing, ask the timeline and plan for permanent housing. If at risk of eviction, tell your counselor immediately — they may have flexible funds or housing resources.", resources: ["https://www.hud.gov/states", "https://www.211.org/"] },
          { order: 9, title: "Benefits Maintenance", description: "Keep Medicaid current. Report income changes but ask about Medicaid buy-in for working people. SNAP has work requirements in many states. SSI/SSDI takes 12-24 months and most initial applications are denied — appeal with legal aid help.", resources: ["https://www.ssa.gov/benefits/disability/", "https://www.benefits.gov/"] },
          { order: 10, title: "Employment and Vocational Rehabilitation", description: "When stable enough to work, explore VR programs that help people with disabilities find and keep jobs. They can pay for training, tools, and transportation. Consider part-time first to build routine and confidence.", resources: ["https://rsa.ed.gov/", "https://www.pacareerlink.pa.gov/"] },
          { order: 11, title: "Rebuild Relationships and Family Obligations", description: "If you have children, address custody, visitation, or child support obligations. Comply with CYS/DCF requirements and document everything. Avoiding legal obligations creates stress that threatens recovery.", resources: ["https://www.acf.hhs.gov/css"] },
          { order: 12, title: "Develop Your Relapse Prevention Plan", description: "Written plan: early warning signs, immediate actions, people to call. A slip is not a full relapse — the difference is what you do in the next 24 hours. Call someone immediately.", resources: [] },
          { order: 13, title: "Establish Long-Term Recovery Routine", description: "After 90 days, treatment intensity may decrease — this is high-risk. Fill freed time with meetings, service, exercise, hobbies. Aim for 1-2 meetings/week, 1 counseling session/month, daily check-in with someone in recovery.", resources: [] },
          { order: 14, title: "Financial Recovery", description: "Start small: open a savings account with $5. Build to $500 emergency fund. Check credit report for errors. Ask hospitals about charity care for medical debt. Ask about payment plans for court debt. Financial stress is a major relapse trigger.", resources: ["https://www.annualcreditreport.com/", "https://www.consumerfinance.gov/"] }
        ],
        checklist: [
          "Intake and assessment completed",
          "Treatment schedule on calendar",
          "MAT plan in place (if applicable)",
          "Insurance coverage verified",
          "Trigger list with coping plans created",
          "3-5 recovery support contacts saved",
          "First support meeting attended",
          "Primary care physical scheduled/completed",
          "Housing situation stable",
          "Benefits active and renewal dates noted",
          "Employment or VR referral started",
          "Family obligations addressed",
          "Relapse prevention plan written",
          "Long-term recovery routine established",
          "Financial recovery plan started"
        ],
        templates: [
          { name: "Weekly Treatment Schedule", description: "Grid with session type, time, location, transportation plan" },
          { name: "Trigger & Response Plan", description: "Two columns: 'When this happens...' and 'I will...'" },
          { name: "Recovery Contact Card", description: "Wallet-sized card with 5 emergency contacts" },
          { name: "Medication Log", description: "Daily tracker: medication, dose, time, side effects, refill date" },
          { name: "Relapse Prevention Plan", description: "One-page: warning signs, actions, contacts, ER info" }
        ],
        tips: [
          "The 90-day mark is the most dangerous transition. Fill the gap with structure.",
          "One slip is not a full relapse. The difference is what you do in the next 24 hours.",
          "MAT reduces mortality by 50%+. It is evidence-based medicine, not substitution.",
          "Your counselor is a mandatory reporter for some things — ask what before disclosing.",
          "Recovery is not linear. Progress, setbacks, and plateaus are all normal.",
          "People, places, and things. The most reliable predictor of relapse is environment.",
          "Boredom is dangerous. Fill unstructured time with meetings, hobbies, exercise, service.",
          "Keep naloxone (Narcan) available — free in most states.",
          "Document everything — it becomes evidence of stability for housing, employment, legal."
        ]
      })
    );
  }
}

// Run directly: bun run src/db/migrate.ts
if (import.meta.main) {
  console.log('Running database migration...');
  const db = migrate();
  console.log('Migration complete. Tables created.');
  db.close();
}
