import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/campus")({
  head: () => ({
    meta: [
      { title: "My Life CTRL | Campus — Student Success Platform to Reduce Administrative Attrition | MyCTRL" },
      {
        name: "description",
        content:
          "MyCTRL Campus is a student success platform that reduces administrative attrition with AI-powered personal organization. Help students navigate financial aid, housing, registration, and campus resources. Inquire about a campus pilot.",
      },
    ],
  }),
  component: CampusPage,
});

function CampusPage() {
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-950 via-amber-900 to-slate-900 px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-sm font-medium text-amber-200">
            My Life CTRL | Campus
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Students drop out for administrative reasons —{" "}
            <span className="text-amber-300">not academic ones.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-amber-100/80">
            MyCTRL Campus gives universities, community colleges, and student success teams an
            AI-powered personal chief of staff for every student — transforming financial aid forms,
            registration deadlines, housing applications, and campus resources into clear, prioritized
            action plans.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Campus%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-400"
          >
            Inquire about a pilot →
          </a>
        </div>
      </section>

      {/* Problem */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The problem</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-amber-600">40%</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Of college students who drop out cite administrative and financial hurdles — not
                academics — as the primary reason.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-amber-600">$3.8B</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Lost annually by U.S. institutions from first-year student attrition. Each retained
                student is worth tens of thousands.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-amber-600">1:300</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Typical advisor-to-student ratio — making proactive, personalized support nearly
                impossible at scale.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-amber-600">80%</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Of community college students intend to transfer to a four-year school, but only 14%
                do — largely due to navigational barriers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-6 py-20 dark:bg-gray-900/50 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How MyCTRL Campus works</h2>
          <div className="mt-10 space-y-8">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                1
              </span>
              <div>
                <h3 className="text-xl font-semibold">Onboard in minutes</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Students upload their financial aid letters, registration holds, housing contracts,
                  and scholarship requirements. MyCTRL builds a personalized semester action plan.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                2
              </span>
              <div>
                <h3 className="text-xl font-semibold">Never miss a deadline</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  FAFSA deadlines, tuition payments, class registration windows, housing applications —
                  MyCTRL tracks every critical date and sends automated reminders so nothing falls
                  through the cracks.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                3
              </span>
              <div>
                <h3 className="text-xl font-semibold">Advisor visibility at scale</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Student success teams get dashboards showing which students are on track and which
                  are at risk — enabling targeted outreach before a student silently withdraws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key features for campus programs</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { title: "Semester Action Plans", desc: "AI-generated personalized plans covering financial aid, registration, housing, and campus resources for every student." },
              { title: "Deadline Calendar", desc: "Integrated calendar with FAFSA, tuition, registration, and housing deadlines — with automated reminders." },
              { title: "Document LifeVault", desc: "Secure storage for financial aid letters, transcripts, housing contracts, and scholarship documents." },
              { title: "Student Success Dashboard", desc: "At-a-glance visibility into student engagement, completed tasks, and at-risk indicators across the institution." },
              { title: "Transfer & Career Pathways", desc: "Guided workflows for transfer applications, career resources, and internship searches." },
              { title: "FERPA-Compliant", desc: "Built with student privacy at the core, aligned with FERPA requirements for educational records." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-900 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Reduce administrative attrition. Improve student success.
          </h2>
          <p className="mt-4 text-lg text-amber-100/80">
            Start with a small pilot — one department, one cohort, measurable retention outcomes.
            MyCTRL Campus scales the support every student deserves.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Campus%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-amber-900 transition hover:bg-amber-50"
          >
            Inquire about a pilot →
          </a>
        </div>
      </section>

      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:text-gray-600">
        <p>&copy; {new Date().getFullYear()} My Life CTRL. All rights reserved.</p>
        <p className="mt-1 text-xs">LifeCTRL LLC</p>
      </footer>
    </main>
  );
}
