import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const SEO_TITLE = 'CTRL Campus — Student Success Platform to Reduce Administrative Attrition | MyCTRL';
const SEO_DESC =
  'MyCTRL Campus is a student success platform that reduces administrative attrition with AI-powered personal organization. Help students navigate financial aid, housing, registration, and campus resources. Inquire about a campus pilot.';

const stats = [
  { value: '40%', label: 'Of college students who drop out cite administrative and financial hurdles — not academics' },
  { value: '$3.8B', label: 'Lost annually by US institutions from first-year student attrition' },
  { value: '1:300', label: 'Typical advisor-to-student ratio — making proactive support nearly impossible at scale' },
  { value: '80%', label: 'Of community college students intend to transfer, but only 14% do — largely due to navigational barriers' },
];

const features = [
  { title: 'Semester Action Plans', desc: 'AI-generated personalized plans covering financial aid, registration, housing, and campus resources.' },
  { title: 'Deadline Calendar', desc: 'Integrated calendar with FAFSA, tuition, registration, and housing deadlines — with automated reminders.' },
  { title: 'Document LifeVault', desc: 'Secure storage for financial aid letters, transcripts, housing contracts, and scholarship documents.' },
  { title: 'Student Success Dashboard', desc: 'At-a-glance visibility into student engagement, completed tasks, and at-risk indicators across the institution.' },
  { title: 'Transfer & Career Pathways', desc: 'Guided workflows for transfer applications, career resources, and internship searches.' },
  { title: 'FERPA-Compliant', desc: 'Built with student privacy at the core, aligned with FERPA requirements for educational records.' },
];

export default function Campus() {
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
      <section className="bg-gradient-to-br from-calm-900 via-calm-800 to-calm-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <span className="inline-block rounded-full bg-calm-400/30 px-3 py-1 text-sm font-medium text-calm-100">
            MyCTRL Campus
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight">
            Students drop out for administrative reasons —{' '}
            <span className="text-brand-300">not academic ones.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-calm-200/80">
            MyCTRL Campus gives universities, community colleges, and student success teams an
            AI-powered personal chief of staff for every student — transforming financial aid forms,
            registration deadlines, housing applications, and campus resources into clear, prioritized
            action plans.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Campus%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-xl bg-brand-400 hover:bg-brand-300 px-6 py-3 font-semibold text-calm-900 transition"
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">How MyCTRL Campus works</h2>
          <div className="mt-10 space-y-8">
            {[
              { step: '1', title: 'Onboard in minutes', desc: 'Students upload their financial aid letters, registration holds, housing contracts, and scholarship requirements. MyCTRL builds a personalized semester action plan.' },
              { step: '2', title: 'Never miss a deadline', desc: 'FAFSA deadlines, tuition payments, class registration windows, housing applications — MyCTRL tracks every critical date and sends automated reminders.' },
              { step: '3', title: 'Advisor visibility at scale', desc: 'Student success teams get dashboards showing which students are on track and which are at risk — enabling targeted outreach before a student silently withdraws.' },
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">Key features for campus programs</h2>
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
      <section className="py-20 bg-gradient-to-b from-calm-800 to-calm-900 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            Reduce administrative attrition. Improve student success.
          </h2>
          <p className="text-calm-200 text-lg">
            Start with a small pilot — one department, one cohort, measurable retention outcomes.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Campus%20Pilot%20Inquiry"
            className="inline-block px-8 py-4 bg-white text-calm-800 font-bold rounded-xl text-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
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
