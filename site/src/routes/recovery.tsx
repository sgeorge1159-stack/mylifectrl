import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recovery")({
  head: () => ({
    meta: [
      { title: "My Life CTRL | Recovery — SUD Treatment Patient Engagement & Behavioral Health Case Management | MyCTRL" },
      {
        name: "description",
        content:
          "MyCTRL Recovery improves addiction treatment patient retention with AI-powered personal organization and behavioral health case management tools. Help patients navigate recovery, appointments, housing, and benefits. Inquire about a recovery program pilot.",
      },
    ],
  }),
  component: RecoveryPage,
});

function RecoveryPage() {
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-teal-500/20 px-3 py-1 text-sm font-medium text-teal-200">
            My Life CTRL | Recovery
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Recovery is hard enough.{" "}
            <span className="text-teal-300">The paperwork shouldn't make it harder.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-teal-100/80">
            MyCTRL Recovery gives treatment programs, behavioral health providers, and individuals in
            recovery an AI-powered personal chief of staff — organizing appointments, treatment plans,
            housing paperwork, and benefits into one clear, prioritized action plan.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Recovery%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-lg bg-teal-500 px-6 py-3 font-semibold text-white transition hover:bg-teal-400"
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
              <p className="text-5xl font-bold text-teal-600">50%</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Of patients drop out of SUD treatment within the first 90 days — often due to
                administrative and logistical barriers, not lack of motivation.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-teal-600">48.7M</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Americans aged 12+ had a substance use disorder in the past year. The system is
                overwhelmed.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-teal-600">1:80</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Typical caseload ratio for behavioral health case managers — making personalized
                follow-up nearly impossible.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-teal-600">3X</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Patients who stay engaged beyond 90 days are three times more likely to achieve
                sustained recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-6 py-20 dark:bg-gray-900/50 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How MyCTRL Recovery works</h2>
          <div className="mt-10 space-y-8">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                1
              </span>
              <div>
                <h3 className="text-xl font-semibold">Intake becomes action</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Treatment intake paperwork, insurance documents, medication schedules, and referral
                  letters are uploaded. MyCTRL organizes everything and builds a personalized
                  recovery action plan.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                2
              </span>
              <div>
                <h3 className="text-xl font-semibold">Stay on track between sessions</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Between therapy and treatment sessions, MyCTRL keeps patients engaged with
                  appointment reminders, medication schedules, meeting locations, and progress
                  check-ins — reducing the dropout risk.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                3
              </span>
              <div>
                <h3 className="text-xl font-semibold">Program-wide visibility</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Clinical directors and case managers get dashboards showing patient engagement,
                  missed appointments, and at-risk individuals — enabling proactive intervention
                  before someone drops out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key features for recovery programs</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { title: "Personalized Recovery Plans", desc: "Tailored action plans built from the individual's treatment intake, diagnoses, and life circumstances." },
              { title: "Medication & Appointment Tracking", desc: "Medication schedules, therapy appointments, and support group meetings in one dashboard with reminders." },
              { title: "LifeVault for Sensitive Documents", desc: "Secure storage for treatment plans, insurance cards, medication lists, and recovery resources." },
              { title: "Patient Engagement Dashboard", desc: "Real-time visibility into who's engaged, who's at risk, and who needs outreach — across the entire program." },
              { title: "Housing & Benefits Navigation", desc: "Guided workflows for housing applications, SNAP, Medicaid, and disability benefits — common recovery barriers." },
              { title: "HIPAA-Ready Infrastructure", desc: "Built with security and privacy at the core. Ready for BAA agreements with covered entities." },
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
      <section className="bg-teal-900 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Improve patient retention and recovery outcomes.
          </h2>
          <p className="mt-4 text-lg text-teal-100/80">
            Start with a small pilot — one treatment program, measurable engagement and retention
            outcomes. MyCTRL Recovery keeps patients organized so they can focus on getting well.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Recovery%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-teal-900 transition hover:bg-teal-50"
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
