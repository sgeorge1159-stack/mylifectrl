import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const SEO_TITLE = 'CTRL Ability — AI-Powered IDD & Autism Support Coordination | MyCTRL';
const SEO_DESC =
  'MyCTRL Ability transforms disability support coordination with AI-powered personal organization. Help individuals with IDD and autism navigate benefits, appointments, employment, and lifelong planning. Inquire about an Ability program pilot.';

const stats = [
  { value: '1 in 36', label: 'Children identified with autism spectrum disorder (CDC, 2023)' },
  { value: '7.4M+', label: 'Americans living with an intellectual or developmental disability' },
  { value: '80%', label: 'Of adults with IDD live with aging family caregivers — a looming crisis' },
  { value: '5+ years', label: 'Average waitlist for home and community-based services in many states' },
];

const features = [
  { title: 'AI Action Plans', desc: 'Personalized, 14-step plans spanning diagnosis through lifelong support — built from the individual\'s actual situation and paperwork.' },
  { title: 'LifeVault Document Storage', desc: 'Secure, searchable archive for IEPs, medical records, benefits letters, legal documents, and provider contacts.' },
  { title: 'Provider Coordination Hub', desc: 'One dashboard for every provider — therapists, dietitians, case managers, job coaches, medical specialists.' },
  { title: 'Benefits Navigation', desc: 'Track Medicaid waivers, SSI applications, SNAP renewals, and state-specific IDD benefits with deadline reminders.' },
  { title: 'Employment & Day Program Support', desc: 'Job coaching milestones, workplace accommodation plans, VR coordination, and day program scheduling.' },
  { title: 'Lifespan Planning', desc: 'Crisis planning, guardianship transitions, supported decision-making, and aging caregiver contingency plans.' },
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
      <section className="bg-gradient-to-br from-accent-900 via-accent-800 to-calm-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <span className="inline-block rounded-full bg-accent-400/20 px-3 py-1 text-sm font-medium text-accent-200">
            MyCTRL Ability
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight">
            Every person with IDD or autism{' '}
            <span className="text-accent-300">deserves a clear path forward.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-accent-100/80">
            MyCTRL Ability gives individuals with intellectual and developmental disabilities, 
            their families, and their support teams an AI-powered personal chief of staff — 
            transforming scattered paperwork, appointments, benefits, and provider contacts 
            into one organized, actionable command center.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Ability%20Pilot%20Inquiry"
            className="mt-8 inline-block rounded-xl bg-accent-400 hover:bg-accent-300 px-6 py-3 font-semibold text-accent-900 transition"
          >
            Inquire about a pilot →
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">The challenge</h2>
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">How MyCTRL Ability works</h2>
          <div className="mt-10 space-y-8">
            {[
              { step: '1', title: 'Centralize everything', desc: 'Families and support coordinators upload scattered documents — IEPs, medical records, benefits letters, provider contacts, legal documents. MyCTRL organizes them into a searchable, structured LifeVault.' },
              { step: '2', title: 'AI builds the roadmap', desc: 'MyCTRL generates a personalized 14-step plan from diagnosis through lifelong support — with appointment schedules, benefits deadlines, provider contact lists, crisis plans, and caregiver contingency planning.' },
              { step: '3', title: 'Coordinate across every provider', desc: 'Support coordinators get a dashboard view. Families see exactly what\'s next. Therapists, job coaches, medical providers — everyone on the same page. No dropped handoffs.' },
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
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-calm-900">Key features for IDD & autism support</h2>
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
            Ready to transform IDD and autism support coordination?
          </h2>
          <p className="text-accent-100 text-lg">
            Start with a small pilot — one program, one population, measurable outcomes.
          </p>
          <a
            href="mailto:hello@mylifectrl.com?subject=Ability%20Pilot%20Inquiry"
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
