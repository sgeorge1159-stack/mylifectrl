import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const SEO_TITLE = 'MyCTRL Ability — AI-Powered Support for IDD & Autism | MyCTRL';
const SEO_DESC =
  'MyCTRL Ability transforms the IDD & autism service system — waiver waitlists, IEP meetings, benefits cliffs, provider coordination — into clear, prioritized action plans. For individuals, families, and service organizations. Inquire about an Ability pilot.';

const stats = [
  { value: '7M+', label: 'Americans live with an intellectual or developmental disability' },
  { value: '1 in 36', label: 'Children are diagnosed with autism spectrum disorder (CDC)' },
  { value: '600K+', label: 'People wait for Medicaid HCBS waiver services — some waitlists stretch 10+ years' },
  { value: '40+ hrs', label: 'Of unpaid care many IDD family caregivers provide each week — on top of jobs and everything else' },
];

const features = [
  { title: 'AI Action Plans', desc: 'Personalized, prioritized step-by-step plans built from the individual\'s actual paperwork and situation — not generic advice.' },
  { title: 'LifeVault Document Storage', desc: 'Secure, searchable archive for diagnostic evaluations, IEPs, waiver applications, benefits letters, and medical records.' },
  { title: 'Caregiver Coordination', desc: 'Shared timelines and task tracking across parents, caregivers, case managers, and providers — everyone sees what\'s next.' },
  { title: 'Waiver & Benefits Tracking', desc: 'Track every waiver application, waitlist status, SSI/SSDI appeal, and benefits renewal with deadline-aware reminders.' },
  { title: 'IEP & Transition Planning', desc: 'Purpose-built workflows for IEP meetings, 504 plans, and the transition from school-based to adult services.' },
  { title: 'Emergency Planning', desc: 'Medical summaries, go-bag checklists, and crisis plans that keep the people who care for your loved one prepared.' },
];

export default function Ability() {
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
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-calm-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <span className="inline-block rounded-full bg-brand-400/20 px-3 py-1 text-sm font-medium text-brand-200">
            MyCTRL Ability
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight">
            The IDD service system shouldn't require a PhD to navigate.{' '}
            <span className="text-brand-300">We make it manageable.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-brand-100/80">
            MyCTRL Ability gives individuals with intellectual/developmental disabilities, autism,
            their families, and the organizations that serve them an AI-powered personal chief of
            staff — turning waivers, IEPs, benefits cliffs, and provider coordination into a clear,
            prioritized, step-by-step action plan that works across the lifespan.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Ability%20Pilot%20Inquiry"
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">How MyCTRL Ability works</h2>
          <div className="mt-10 space-y-8">
            {[
              { step: '1', title: 'Upload what you have', desc: 'Families (or service coordinators) upload scattered documents — diagnostic evaluations, IEPs, waiver letters, benefits notices, medical records — as PDFs, screenshots, or photos.' },
              { step: '2', title: 'AI builds the plan', desc: 'MyCTRL extracts deadlines and requirements — the 60-day IEP evaluation window, the 18th-birthday rights cliff, waiver waitlists, benefit renewals. It builds a prioritized action plan with document checklists and jurisdiction-aware guidance.' },
              { step: '3', title: 'Track progress, coordinate care', desc: 'Caregivers and service coordinators see exactly what\'s next across every phase of life. Families stay organized for the long haul — from early intervention to lifelong planning.' },
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">Key features for IDD & autism services</h2>
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
            Ready to bring clarity to IDD & autism services?
          </h2>
          <p className="text-brand-100 text-lg">
            Start with a small pilot — one agency, one program, measurable outcomes.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Ability%20Pilot%20Inquiry"
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
