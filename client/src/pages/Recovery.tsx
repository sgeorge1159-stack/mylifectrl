import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const SEO_TITLE = 'CTRL Recovery — SUD Treatment Patient Engagement & Behavioral Health Case Management | MyCTRL';
const SEO_DESC =
  'MyCTRL Recovery improves addiction treatment patient retention with AI-powered personal organization and behavioral health case management tools. Help patients navigate recovery, appointments, housing, and benefits. Inquire about a recovery program pilot.';

const stats = [
  { value: '50%', label: 'Of patients drop out of SUD treatment within 90 days — often due to administrative barriers' },
  { value: '48.7M', label: 'Americans aged 12+ had a substance use disorder in the past year' },
  { value: '1:80', label: 'Typical caseload ratio for behavioral health case managers' },
  { value: '3X', label: 'Patients engaged beyond 90 days are three times more likely to achieve sustained recovery' },
];

const features = [
  { title: 'Personalized Recovery Plans', desc: 'Tailored action plans built from treatment intake, diagnoses, and life circumstances.' },
  { title: 'Medication & Appointment Tracking', desc: 'Medication schedules, therapy appointments, and support group meetings in one dashboard with reminders.' },
  { title: 'LifeVault for Sensitive Documents', desc: 'Secure storage for treatment plans, insurance cards, medication lists, and recovery resources.' },
  { title: 'Patient Engagement Dashboard', desc: 'Real-time visibility into who\'s engaged, who\'s at risk, and who needs outreach — across the entire program.' },
  { title: 'Housing & Benefits Navigation', desc: 'Guided workflows for housing applications, SNAP, Medicaid, and disability benefits — common recovery barriers.' },
  { title: 'HIPAA-Ready Infrastructure', desc: 'Built with security and privacy at the core. Ready for BAA agreements with covered entities.' },
];

export default function Recovery() {
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
      <section className="bg-gradient-to-br from-accent-900 via-accent-800 to-calm-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <span className="inline-block rounded-full bg-accent-400/20 px-3 py-1 text-sm font-medium text-accent-200">
            MyCTRL Recovery
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight">
            Recovery is hard enough.{' '}
            <span className="text-accent-300">The paperwork shouldn't make it harder.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-accent-100/80">
            MyCTRL Recovery gives treatment programs, behavioral health providers, and individuals in
            recovery an AI-powered personal chief of staff — organizing appointments, treatment plans,
            housing paperwork, and benefits into one clear, prioritized action plan.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Recovery%20Pilot%20Inquiry"
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">How MyCTRL Recovery works</h2>
          <div className="mt-10 space-y-8">
            {[
              { step: '1', title: 'Intake becomes action', desc: 'Treatment intake paperwork, insurance documents, medication schedules, and referral letters are uploaded. MyCTRL organizes everything and builds a personalized recovery action plan.' },
              { step: '2', title: 'Stay on track between sessions', desc: 'Between therapy and treatment sessions, MyCTRL keeps patients engaged with appointment reminders, medication schedules, meeting locations, and progress check-ins — reducing the dropout risk.' },
              { step: '3', title: 'Program-wide visibility', desc: 'Clinical directors and case managers get dashboards showing patient engagement, missed appointments, and at-risk individuals — enabling proactive intervention before someone drops out.' },
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">Key features for recovery programs</h2>
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
            Improve patient retention and recovery outcomes.
          </h2>
          <p className="text-accent-100 text-lg">
            Start with a small pilot — one treatment program, measurable engagement and retention outcomes.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Recovery%20Pilot%20Inquiry"
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
