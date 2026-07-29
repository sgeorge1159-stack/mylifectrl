import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reentry")({
  head: () => ({
    meta: [
      { title: "My Life CTRL | ReEntry — AI-Powered Re-entry Programs for Returning Citizens | MyCTRL" },
      {
        name: "description",
        content:
          "MyCTRL ReEntry transforms corrections case management with AI-powered personal organization. Reduce recidivism with technology that helps returning citizens navigate housing, employment, benefits, and parole requirements. Inquire about a re-entry program pilot.",
      },
    ],
  }),
  component: ReentryPage,
});

function ReentryPage() {
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-200">
            My Life CTRL | ReEntry
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Returning citizens deserve more than a checklist.{" "}
            <span className="text-indigo-300">They deserve a plan.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-indigo-100/80">
            MyCTRL ReEntry gives returning citizens, corrections staff, and re-entry programs an
            AI-powered personal chief of staff — transforming scattered paperwork, appointments,
            and requirements into a clear, prioritized, step-by-step action plan.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Re-entry%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400"
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
              <p className="text-5xl font-bold text-indigo-600">600K+</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                People are released from state and federal prisons each year in the United States.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-indigo-600">68%</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                of released individuals are rearrested within three years. Administrative chaos is a
                major driver.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-indigo-600">44%</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Return to prison within the first year — the window when administrative stability
                matters most.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-indigo-600">1:3</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Only one case manager for every three hundred returning citizens in many jurisdictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-6 py-20 dark:bg-gray-900/50 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How MyCTRL ReEntry works</h2>
          <div className="mt-10 space-y-8">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                1
              </span>
              <div>
                <h3 className="text-xl font-semibold">Upload what you have</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Returning citizens (or their case managers) upload scattered documents — release
                  paperwork, parole conditions, court orders, housing applications, job referrals,
                  treatment plans — as PDFs, screenshots, or photos.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                2
              </span>
              <div>
                <h3 className="text-xl font-semibold">AI builds the plan</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  MyCTRL extracts deadlines, requirements, and next steps. It builds a prioritized
                  action plan with calendar reminders, document checklists, and jurisdiction-aware
                  guidance — all organized in a secure LifeVault.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                3
              </span>
              <div>
                <h3 className="text-xl font-semibold">Track progress, reduce chaos</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Case managers get a dashboard view across their caseload. Returning citizens see
                  exactly what's next. Compliance goes up, recidivism risk goes down.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key features for re-entry programs</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { title: "AI Action Plans", desc: "Personalized step-by-step plans built from the individual's actual paperwork and situation." },
              { title: "LifeVault Document Storage", desc: "Secure, searchable document archive for release paperwork, IDs, court orders, and housing forms." },
              { title: "Deadline & Appointment Tracking", desc: "Never miss a parole check-in, court date, or benefits deadline with automated reminders." },
              { title: "Caseload Dashboard", desc: "Case managers see real-time progress across their entire caseload — who's on track, who needs help." },
              { title: "Halfway House Digital Tools", desc: "Purpose-built workflows for halfway house and transitional housing programs." },
              { title: "Jurisdiction-Aware Guidance", desc: "State and county-specific requirements built into every action plan." },
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
      <section className="bg-indigo-900 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to reduce recidivism with technology?
          </h2>
          <p className="mt-4 text-lg text-indigo-100/80">
            Start with a small pilot — one facility, one program, measurable outcomes. MyCTRL
            ReEntry turns administrative chaos into forward momentum.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Re-entry%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-indigo-900 transition hover:bg-indigo-50"
          >
            Inquire about a pilot →
          </a>
        </div>
      </section>

      {/* Footer spacer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400 dark:border-gray-800 dark:text-gray-600">
        <p>&copy; {new Date().getFullYear()} My Life CTRL. All rights reserved.</p>
        <p className="mt-1 text-xs">LifeCTRL LLC</p>
      </footer>
    </main>
  );
}
