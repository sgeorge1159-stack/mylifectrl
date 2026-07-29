import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const SEO_TITLE = 'My Life CTRL | ReEntry — AI-Powered Re-entry Programs for Returning Citizens | MyCTRL';
const SEO_DESC =
  'MyCTRL Re-entry transforms corrections case management with AI-powered personal organization. Reduce recidivism with technology that helps returning citizens navigate housing, employment, benefits, and parole requirements. Inquire about a re-entry program pilot.';

const stats = [
  { value: '600K+', label: 'People released from US prisons each year' },
  { value: '68%', label: 'Rearrested within three years — administrative chaos is a major driver' },
  { value: '44%', label: 'Return to prison within the first year' },
  { value: '1:300', label: 'Only one case manager per 300 returning citizens in many jurisdictions' },
];

const features = [
  { title: 'AI Action Plans', desc: 'Personalized step-by-step plans built from the individual\'s actual paperwork and situation.' },
  { title: 'LifeVault Document Storage', desc: 'Secure, searchable document archive for release paperwork, IDs, court orders, and housing forms.' },
  { title: 'Deadline & Appointment Tracking', desc: 'Never miss a parole check-in, court date, or benefits deadline with automated reminders.' },
  { title: 'Caseload Dashboard', desc: 'Case managers see real-time progress across their entire caseload — who\'s on track, who needs help.' },
  { title: 'Halfway House Digital Tools', desc: 'Purpose-built workflows for halfway house and transitional housing programs.' },
  { title: 'Jurisdiction-Aware Guidance', desc: 'State and county-specific requirements built into every action plan.' },
];

export default function Reentry() {
  useEffect(() => {
    document.title = SEO_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', SEO_DESC);
    return () => {
      document.title = 'MyCTRL™ — Take CTRL of your life.';
      if (meta) meta.setAttribute('content', 'MyCTRL™ — Take CTRL of your life. Your AI-powered personal chief of staff.');
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
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-calm-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <span className="inline-block rounded-full bg-brand-400/20 px-3 py-1 text-sm font-medium text-brand-200">
            MyCTRL Re-entry
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight">
            Returning citizens deserve more than a checklist.{' '}
            <span className="text-brand-300">They deserve a plan.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-100/80">
            MyCTRL Re-entry gives returning citizens, corrections staff, and re-entry programs an
            AI-powered personal chief of staff — transforming scattered paperwork, appointments,
            and requirements into a clear, prioritized, step-by-step action plan.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Re-entry%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-xl bg-brand-400 hover:bg-brand-300 px-6 py-3 font-semibold text-brand-900 transition"
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
                <p className="text-5xl font-bold text-brand-500">{s.value}</p>
                <p className="mt-2 text-calm-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-accent-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">How MyCTRL Re-entry works</h2>
          <div className="mt-10 space-y-8">
            {[
              { step: '1', title: 'Upload what you have', desc: 'Returning citizens (or their case managers) upload scattered documents — release paperwork, parole conditions, court orders, housing applications, job referrals, treatment plans — as PDFs, screenshots, or photos.' },
              { step: '2', title: 'AI builds the plan', desc: 'MyCTRL extracts deadlines, requirements, and next steps. It builds a prioritized action plan with calendar reminders, document checklists, and jurisdiction-aware guidance.' },
              { step: '3', title: 'Track progress, reduce chaos', desc: 'Case managers get a dashboard view across their caseload. Returning citizens see exactly what\'s next. Compliance goes up, recidivism risk goes down.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">Key features for re-entry programs</h2>
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
      <section className="py-20 bg-gradient-to-b from-brand-500 to-brand-700 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Ready to reduce recidivism with technology?
          </h2>
          <p className="text-brand-100 text-lg">
            Start with a small pilot — one facility, one program, measurable outcomes.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Re-entry%20Pilot%20Inquiry"
            className="inline-block px-8 py-4 bg-white text-brand-600 font-bold rounded-xl text-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
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
