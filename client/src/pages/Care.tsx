import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const SEO_TITLE = 'CTRL Care — Healthcare Navigation Platform to Reduce Hospital Readmissions | MyCTRL';
const SEO_DESC =
  'MyCTRL Care is a healthcare navigation platform that reduces hospital readmissions with AI-powered care coordination tools. Help patients manage discharge plans, appointments, medications, and benefits. Inquire about a care navigation pilot.';

const stats = [
  { value: '20%', label: 'Of Medicare patients are readmitted within 30 days of discharge' },
  { value: '$52.4B', label: 'Estimated annual cost of preventable hospital readmissions in the US' },
  { value: '53M', label: 'Unpaid family caregivers in the US, most with zero administrative support' },
  { value: '75%', label: 'Of readmissions are considered preventable with better discharge planning' },
];

const features = [
  { title: 'Discharge Action Plans', desc: 'AI-generated post-discharge plans built from the patient\'s actual discharge paperwork and follow-up requirements.' },
  { title: 'Medication Management', desc: 'Medication schedules, refill reminders, interactions, and pharmacy details in one dashboard.' },
  { title: 'Appointment Tracking', desc: 'Follow-up appointments, specialist referrals, PT/OT, and home health visits — with automated reminders.' },
  { title: 'Caregiver Coordination', desc: 'Family caregivers and professional care teams share a unified view of the patient\'s care plan and progress.' },
  { title: 'LifeVault for Health Records', desc: 'Secure, searchable storage for discharge summaries, medication lists, advanced directives, and insurance cards.' },
  { title: 'HIPAA-Ready & BAA-Supported', desc: 'Enterprise-grade security and privacy. Supports Business Associate Agreements for covered entities.' },
];

export default function Care() {
  useEffect(() => {
    document.title = SEO_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', SEO_DESC);
    return () => {
      document.title = 'MyCTRL™ — Life\'s a lot. CTRL it.';
      if (meta) meta.setAttribute('content', 'MyCTRL™ — Life\'s a lot. CTRL it. Your AI-powered personal chief of staff.');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur border-b border-calm-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-calm-900 font-display">
            <BrandLogo />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-accent-900 via-accent-700 to-brand-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <span className="inline-block rounded-full bg-accent-400/20 px-3 py-1 text-sm font-medium text-accent-200">
            MyCTRL Care
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight">
            The hardest part of healthcare is{' '}
            <span className="text-brand-300">what happens between visits.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-accent-100/80">
            MyCTRL Care gives patients, caregivers, and care coordination teams an AI-powered
            personal chief of staff — organizing discharge instructions, follow-up appointments,
            medication schedules, insurance paperwork, and home care into one clear action plan.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Care%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-xl bg-accent-400 hover:bg-accent-300 px-6 py-3 font-semibold text-accent-900 transition"
          >
            Inquire about a pilot →
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">The problem</h2>
          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            {stats.map((s) => (
              <div key={s.value} className="card border-calm-200 text-center">
                <p className="text-5xl font-bold text-accent-500">{s.value}</p>
                <p className="mt-2 text-calm-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-accent-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">How MyCTRL Care works</h2>
          <div className="mt-10 space-y-8">
            {[
              { step: '1', title: 'Discharge becomes a clear plan', desc: 'Patients or caregivers upload discharge papers, medication lists, and follow-up instructions. MyCTRL builds a personalized post-discharge action plan with calendar appointments, medication reminders, and required next steps.' },
              { step: '2', title: 'Bridge the follow-up gap', desc: 'Between discharge and the first follow-up appointment, MyCTRL keeps patients on track — medication schedules, symptom monitoring, specialist referrals, and home care instructions all organized and tracked.' },
              { step: '3', title: 'Care team visibility', desc: 'Care coordinators, social workers, and family caregivers get dashboards showing patient adherence, missed appointments, medication compliance, and readmission risk — enabling proactive intervention.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-lg font-bold text-accent-700">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-calm-900">{item.title}</h3>
                  <p className="mt-2 text-calm-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">Key features for care coordination</h2>
          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card border-calm-200">
                <h3 className="font-semibold text-calm-900">{f.title}</h3>
                <p className="mt-2 text-sm text-calm-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-accent-500 to-accent-700 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Reduce readmissions. Support caregivers. Improve outcomes.
          </h2>
          <p className="text-accent-100 text-lg">
            Start with a small pilot — one unit, one discharge pathway, measurable readmission reduction.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Care%20Pilot%20Inquiry"
            className="inline-block px-8 py-4 bg-white text-accent-600 font-bold rounded-xl text-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
          >
            Inquire about a pilot →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent-50 border-t border-calm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-calm-500">
            <div className="flex items-center gap-2">
              <span className="text-brand-500">◈</span>
              <span>MyCTRL™ &copy; {new Date().getFullYear()} LifeCTRL LLC. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
              <a href="mailto:hello@mylifectrl.com" className="hover:text-brand-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
