import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "My Life CTRL | Care — Healthcare Navigation Platform to Reduce Hospital Readmissions | MyCTRL" },
      {
        name: "description",
        content:
          "MyCTRL Care is a healthcare navigation platform that reduces hospital readmissions with AI-powered care coordination tools. Help patients manage discharge plans, appointments, medications, and benefits. Inquire about a care navigation pilot.",
      },
    ],
  }),
  component: CarePage,
});

function CarePage() {
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 px-6 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-4xl">
          <span className="inline-block rounded-full bg-rose-500/20 px-3 py-1 text-sm font-medium text-rose-200">
            My Life CTRL | Care
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            The hardest part of healthcare is{" "}
            <span className="text-rose-300">what happens between visits.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-rose-100/80">
            MyCTRL Care gives patients, caregivers, and care coordination teams an AI-powered
            personal chief of staff — organizing discharge instructions, follow-up appointments,
            medication schedules, insurance paperwork, and home care into one clear action plan.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Care%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-lg bg-rose-500 px-6 py-3 font-semibold text-white transition hover:bg-rose-400"
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
              <p className="text-5xl font-bold text-rose-600">20%</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Of Medicare patients are readmitted within 30 days of discharge — costing hospitals
                billions in penalties annually.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-rose-600">$52.4B</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Estimated annual cost of preventable hospital readmissions in the United States.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-rose-600">53M</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Unpaid family caregivers in the U.S., most with zero administrative support and
                no formal training in care coordination.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-5xl font-bold text-rose-600">75%</p>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Of readmissions are considered preventable with better discharge planning and
                follow-up care coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-6 py-20 dark:bg-gray-900/50 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How MyCTRL Care works</h2>
          <div className="mt-10 space-y-8">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                1
              </span>
              <div>
                <h3 className="text-xl font-semibold">Discharge becomes a clear plan</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Patients or caregivers upload discharge papers, medication lists, and follow-up
                  instructions. MyCTRL builds a personalized post-discharge action plan with
                  calendar appointments, medication reminders, and required next steps.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                2
              </span>
              <div>
                <h3 className="text-xl font-semibold">Bridge the follow-up gap</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Between discharge and the first follow-up appointment, MyCTRL keeps patients on
                  track — medication schedules, symptom monitoring, specialist referrals, and home
                  care instructions all organized and tracked.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-700 dark:bg-rose-900 dark:text-rose-300">
                3
              </span>
              <div>
                <h3 className="text-xl font-semibold">Care team visibility</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Care coordinators, social workers, and family caregivers get dashboards showing
                  patient adherence, missed appointments, medication compliance, and readmission
                  risk — enabling proactive intervention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key features for care coordination</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { title: "Discharge Action Plans", desc: "AI-generated post-discharge plans built from the patient's actual discharge paperwork and follow-up requirements." },
              { title: "Medication Management", desc: "Medication schedules, refill reminders, interactions, and pharmacy details in one dashboard." },
              { title: "Appointment Tracking", desc: "Follow-up appointments, specialist referrals, PT/OT, and home health visits — with automated reminders." },
              { title: "Caregiver Coordination", desc: "Family caregivers and professional care teams share a unified view of the patient's care plan and progress." },
              { title: "LifeVault for Health Records", desc: "Secure, searchable storage for discharge summaries, medication lists, advanced directives, and insurance cards." },
              { title: "HIPAA-Ready & BAA-Supported", desc: "Enterprise-grade security and privacy. Supports Business Associate Agreements for covered entities." },
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
      <section className="bg-rose-900 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Reduce readmissions. Support caregivers. Improve outcomes.
          </h2>
          <p className="mt-4 text-lg text-rose-100/80">
            Start with a small pilot — one unit, one discharge pathway, measurable readmission
            reduction. MyCTRL Care bridges the gap between discharge and recovery.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Care%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-rose-900 transition hover:bg-rose-50"
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
