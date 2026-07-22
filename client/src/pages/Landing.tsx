import { Link } from 'react-router-dom';
import { STRIPE_LINKS, openPaymentLink } from '../config/payments';
import BrandLogo from '../components/BrandLogo';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur border-b border-calm-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <span className="flex items-center gap-2 text-xl font-bold text-calm-900 font-display">
            <BrandLogo />
          </span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-medium">
                <span>✦</span> Your AI-powered personal chief of staff
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-calm-900 leading-tight">
                Life's a lot.
                <br /><span className="text-brand-500 font-mono bg-brand-50/90 px-2 py-0.5 rounded-md border border-brand-200 shadow-sm inline-block">CTRL</span> it.
              </h1>
              <p className="text-lg sm:text-xl text-calm-600 max-w-lg">
                LifeCTRL™ transforms chaos into clarity. Describe your situation — job loss, moving,
                finances, paperwork — and get a personalized, step-by-step action plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                  Start for free
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                  I already have an account
                </Link>
              </div>
              <p className="text-sm text-calm-400">No credit card required. Free plan available.</p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl shadow-xl border border-calm-200 p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-calm-100">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  <span className="text-xs text-calm-400 ml-2">Your Action Plan</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">1</div>
                    <div>
                      <div className="font-semibold text-calm-900">Gather key documents</div>
                      <div className="text-sm text-calm-500">IDs, lease, pay stubs, benefits letters</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">2</div>
                    <div>
                      <div className="font-semibold text-calm-900">File unemployment claim</div>
                      <div className="text-sm text-calm-500">Online portal opens Mon–Fri 8am–6pm</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-calm-100 flex items-center justify-center text-calm-500 font-bold text-sm">3</div>
                    <div>
                      <div className="font-semibold text-calm-800">Review health insurance options</div>
                      <div className="text-sm text-calm-500">COBRA vs marketplace comparison</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-calm-100 flex items-center justify-center text-calm-500 font-bold text-sm">4</div>
                    <div>
                      <div className="font-semibold text-calm-800">Update resume & LinkedIn</div>
                      <div className="text-sm text-calm-500">AI-powered rewrite suggestions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Command Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-display text-calm-900 text-center mb-2">
            Your life,{' '}
            <span className="font-mono bg-calm-100 px-2 py-0.5 rounded-md border border-calm-300 text-calm-800 text-lg align-middle">
              CTRL
            </span>
            'd
          </h2>
          <p className="text-calm-500 text-center mb-10 text-sm">
            Powerful commands for every life situation
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                key: 'CTRL',
                cmd: 'LIFE',
                title: 'Get a plan',
                desc: 'Describe your situation and get a personalized action plan in seconds.',
              },
              {
                key: 'ALT',
                cmd: 'CHAOS',
                title: 'Organize docs',
                desc: 'Upload scattered documents and we organize them into a searchable timeline.',
              },
              {
                key: 'ESC',
                cmd: 'overwhelm',
                title: 'Know what\'s next',
                desc: 'Prioritized checklists with deadlines so you always know what to do.',
              },
              {
                key: 'SHIFT',
                cmd: 'priorities',
                title: 'Stay flexible',
                desc: 'Life changes? Your plan adapts with you.',
              },
            ].map((item) => (
              <div
                key={item.key}
                className="bg-calm-50 border border-calm-200 rounded-2xl p-5 text-center hover:shadow-md hover:border-brand-200 transition-all duration-200"
              >
                <div className="inline-flex items-center gap-1 bg-white border border-calm-300 rounded-lg px-3 py-1.5 shadow-sm mb-4">
                  <kbd className="font-mono text-xs font-bold text-calm-700 bg-calm-100 px-1.5 py-0.5 rounded">
                    {item.key}
                  </kbd>
                  <span className="text-calm-400 text-xs">+</span>
                  <kbd className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                    {item.cmd}
                  </kbd>
                </div>
                <h3 className="font-semibold text-calm-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-calm-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-display text-calm-900 text-center mb-12">
            Everything you need to get <span className="text-brand-500">unstuck</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '▦',
                title: 'Action Plans',
                desc: 'AI transforms your situation into a personalized, prioritized roadmap with clear next steps.',
              },
              {
                icon: '◫',
                title: 'Document Studio',
                desc: 'Upload scattered emails, PDFs, and screenshots — AI organizes them into structured records.',
              },
              {
                icon: '◒',
                title: 'LifeVault',
                desc: 'Your secure, searchable archive of important documents, timelines, and life records.',
              },
              {
                icon: '✦',
                title: 'Life Kits',
                desc: 'Curated guides for job loss, moving, finances, caregiving, and more — built by experts.',
              },
              {
                icon: '◆',
                title: 'Human Concierge',
                desc: 'Need extra help? Book a session with a real human for complex administrative tasks.',
              },
              {
                icon: '◈',
                title: 'Always With You',
                desc: 'One centralized command center. Stop juggling apps, folders, and spreadsheets.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card text-center space-y-3">
                <div className="text-3xl text-brand-500">{feature.icon}</div>
                <h3 className="font-semibold text-calm-900 text-lg">{feature.title}</h3>
                <p className="text-calm-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card border-calm-200 inline-block max-w-lg">
            <p className="text-xl text-calm-800 italic leading-relaxed">
              "I would switch from premium ChatGPT to this."
            </p>
            <p className="mt-3 text-sm text-calm-500 font-medium">— Early user</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-accent-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-display text-calm-900 text-center mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-calm-600 text-center mb-12 max-w-lg mx-auto">
            Start for free. Upgrade when you need more power.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free Plan */}
            <div className="card border-calm-200 p-8 flex flex-col">
              <h3 className="text-xl font-bold font-display text-calm-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-calm-900">$0</span>
                <span className="text-calm-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  '1 action plan',
                  'Basic document uploads',
                  'LifeVault with 5 items',
                  'Browse Life Kits',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-calm-700">
                    <span className="text-brand-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="btn-secondary text-sm w-full text-center">
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="card border-brand-300 bg-gradient-to-br from-brand-50/40 to-white p-8 flex flex-col relative">
              <div className="absolute -top-3 right-4 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-xl font-bold font-display text-calm-900 mb-2">LifeCTRL™ Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-calm-900">$14.99</span>
                <span className="text-calm-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Unlimited action plans',
                  'Priority AI processing',
                  'Unlimited document uploads',
                  'Full LifeVault storage',
                  'All premium features',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-calm-700">
                    <span className="text-brand-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openPaymentLink(STRIPE_LINKS.pro)}
                className="btn-primary text-sm w-full"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Access */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
            On the Roadmap
          </div>
          <h2 className="text-3xl font-bold font-display text-calm-900 mb-3">
            For Organizations
          </h2>
          <p className="text-lg text-brand-600 font-medium mb-3">
            The institution pays. The individual receives LifeCTRL as part of their services.
          </p>
          <p className="text-calm-600 max-w-xl mx-auto mb-8">
            Licensed to correctional facilities, re-entry programs, treatment centers,
            universities, workforce programs, and social-service agencies.
          </p>
          <a
            href="mailto:Stephanie.george9066@gmail.com?subject=Institutional%20Access%20Inquiry"
            className="btn-secondary text-sm px-6 py-3"
          >
            Interested in institutional access? Contact us
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-brand-500 to-accent-600 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            From "I don't know where to start" to "I know exactly what to do next."
          </h2>
          <p className="text-brand-100 text-lg">
            Join thousands who've turned overwhelming life situations into clear, confident action.
          </p>
          <Link to="/signup" className="inline-block px-8 py-4 bg-white text-brand-600 font-bold rounded-xl text-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]">
            Get started — it's free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent-50 border-t border-calm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-calm-500 text-sm">
              <span className="text-brand-500">◈</span>
              <span>LifeCTRL™ &copy; {new Date().getFullYear()}. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/signup" className="text-calm-500 hover:text-brand-600 transition-colors">Get Started</Link>
              <Link to="/login" className="text-calm-500 hover:text-brand-600 transition-colors">Log In</Link>
              <Link to="/terms" className="text-calm-500 hover:text-brand-600 transition-colors">Terms</Link>
              <Link to="/privacy" className="text-calm-500 hover:text-brand-600 transition-colors">Privacy</Link>
              <a href="mailto:hello@lifectrl.com" className="text-calm-500 hover:text-brand-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
