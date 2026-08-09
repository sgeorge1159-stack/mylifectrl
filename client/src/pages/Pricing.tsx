import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

interface Plan {
  name: string;
  price: number;
  unit: string;
  tagline: string;
  features: string[];
  popular: boolean;
  cta: string;
}

interface Kit {
  name: string;
  price: number;
  category: string;
}

interface ConciergeOption {
  name: string;
  price: number;
  desc: string;
  cta: string;
}

interface InstitutionalPlan {
  name: string;
  price: number;
  unit: string;
  min: string;
  features: string[];
  popular: boolean;
}

const plans: Plan[] = [
  {
    name: 'MyCTRL Plus',
    price: 9,
    unit: '/month',
    tagline: 'Everything you need to get unstuck and stay on track.',
    features: [
      'Unlimited action plans',
      '5GB LifeVault storage',
      'Priority AI generation',
    ],
    popular: false,
    cta: 'Subscribe to Plus',
  },
  {
    name: 'MyCTRL Pro',
    price: 19,
    unit: '/month',
    tagline: 'Our most powerful plan for complex life situations.',
    features: [
      'Everything in Plus',
      'Documentation Studio',
      'PDF export',
      'Advanced resources',
      'Priority concierge booking',
    ],
    popular: true,
    cta: 'Subscribe to Pro',
  },
];

const kits: Kit[] = [
  { name: 'Job Loss Recovery Kit', price: 29, category: 'Employment' },
  { name: 'Career Transition Kit', price: 29, category: 'Career' },
  { name: 'Financial Reset Kit', price: 29, category: 'Financial' },
  { name: 'Moving & Relocation Kit', price: 19, category: 'Housing' },
  { name: 'First-Time Renter Kit', price: 24, category: 'Housing' },
  { name: 'Paperwork Overhaul Kit', price: 19, category: 'Organization' },
  { name: 'ReEntry Kit', price: 29, category: 'Re-entry' },
  { name: 'Recovery Kit', price: 29, category: 'Recovery' },
  { name: 'IDD & Autism Support Kit', price: 34, category: 'Support' },
  { name: 'Eviction Prevention Kit', price: 24, category: 'Housing' },
  { name: 'College Survival Kit', price: 19, category: 'Campus' },
  { name: 'Caregiver Kit', price: 29, category: 'Care' },
  { name: 'New Parent Kit', price: 24, category: 'Family' },
];

const conciergeOptions: ConciergeOption[] = [
  {
    name: '30-Min Session',
    price: 49,
    desc: 'A focused session with a real human to tackle a specific administrative task — an application, a letter, a deadline you can\'t miss.',
    cta: 'Book 30-Min Session',
  },
  {
    name: '60-Min Session',
    price: 89,
    desc: 'A deeper working session for complex situations — multi-step paperwork, benefits navigation, or a full document overhaul.',
    cta: 'Book 60-Min Session',
  },
];

const institutionalPlans: InstitutionalPlan[] = [
  {
    name: 'Institutional Lite',
    price: 15,
    unit: '/seat/mo',
    min: '10 seat minimum',
    features: ['Core platform access', 'LifeVault storage', 'Standard support'],
    popular: false,
  },
  {
    name: 'Institutional Full',
    price: 25,
    unit: '/seat/mo',
    min: '10 seat minimum',
    features: ['Everything in Lite', 'Vertical Life Kits', 'Institutional dashboard', 'Dedicated onboarding'],
    popular: true,
  },
];

const kitEmojis: Record<string, string> = {
  'Job Loss Recovery Kit': '💼',
  'Career Transition Kit': '🚀',
  'Financial Reset Kit': '💰',
  'Moving & Relocation Kit': '📦',
  'First-Time Renter Kit': '🏠',
  'Paperwork Overhaul Kit': '📋',
  'ReEntry Kit': '🔓',
  'Recovery Kit': '🌱',
  'IDD & Autism Support Kit': '🤝',
  'Eviction Prevention Kit': '🛡️',
  'College Survival Kit': '🎓',
  'Caregiver Kit': '❤️',
  'New Parent Kit': '👶',
};

const formatPrice = (price: number) => `$${price}`;

export default function Pricing() {
  const [notice, setNotice] = useState<string | null>(null);

  const comingSoon = (label: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setNotice(`${label} — coming soon! Secure checkout is being wired up.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="bg-white/80 backdrop-blur border-b border-calm-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <span className="flex items-center gap-2 text-xl font-bold text-calm-900 font-display">
            <Link to="/">
              <BrandLogo />
            </Link>
          </span>
          <div className="flex items-center gap-3">
            <Link to="/pricing" className="btn-ghost hidden sm:inline-flex">Pricing</Link>
            <Link to="/login" className="btn-ghost hidden sm:inline-flex">Log in</Link>
            <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Coming soon notice */}
      {notice && (
        <div className="bg-accent-100 border-b border-accent-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-accent-800 font-medium">
              <span className="mr-2">🛠️</span>
              {notice}
            </p>
            <button
              onClick={() => setNotice(null)}
              className="text-accent-700 hover:text-accent-900 font-bold text-sm shrink-0"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="bg-accent-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-6">
            <span>✦</span> Simple, transparent pricing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-calm-900 leading-tight mb-6">
            Take{' '}
            <span className="text-brand-500 font-mono bg-brand-50/90 px-2 py-0.5 rounded-md border border-brand-200 shadow-sm inline-block">
              CTRL
            </span>{' '}
            of your life.
          </h1>
          <p className="text-lg sm:text-xl text-calm-600 max-w-2xl mx-auto">
            Choose the plan that fits your situation. Start with a subscription, grab a
            one-time Life Kit, or get hands-on help from a real human. No hidden fees,
            cancel anytime.
          </p>
        </div>
      </section>

      {/* Section 1: Monthly Subscriptions */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-display text-calm-900 text-center mb-3">
            Monthly Subscriptions
          </h2>
          <p className="text-calm-600 text-center mb-12 max-w-xl mx-auto">
            Your AI personal chief of staff, on demand. Pick a plan and get unlimited
            action plans, a secure LifeVault, and more.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card flex flex-col relative p-8 ${
                  plan.popular
                    ? 'border-brand-300 bg-gradient-to-br from-brand-50/40 to-white'
                    : 'border-calm-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-4 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold font-display text-calm-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-calm-500 mb-4">{plan.tagline}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-calm-900">{formatPrice(plan.price)}</span>
                  <span className="text-calm-500 text-sm">{plan.unit}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-calm-700">
                      <span className="text-brand-500 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  onClick={comingSoon(plan.name)}
                  className={`${plan.popular ? 'btn-primary' : 'btn-secondary'} text-sm w-full`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-calm-400 mt-8">
            Prefer to try first?{' '}
            <Link to="/signup" className="text-brand-600 font-semibold hover:underline">
              Start free — no credit card required
            </Link>
          </p>
        </div>
      </section>

      {/* Section 2: Life Kits */}
      <section className="py-20 bg-accent-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-display text-calm-900 text-center mb-3">
            Life Kits
          </h2>
          <p className="text-calm-600 text-center mb-4 max-w-xl mx-auto">
            Curated, vetted frameworks for life's biggest moments. Buy once, own forever —
            then AI personalizes it to your situation.
          </p>
          <p className="text-sm text-calm-400 text-center mb-12">One-time purchase · Instant access</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kits.map((kit) => (
              <div key={kit.name} className="card flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{kitEmojis[kit.name] ?? '✦'}</span>
                  <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 rounded-full px-2.5 py-1">
                    {kit.category}
                  </span>
                </div>
                <h3 className="font-semibold text-calm-900 text-lg mb-1">{kit.name}</h3>
                <p className="text-xs text-calm-400 mb-4">One-time purchase</p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold text-calm-900">{formatPrice(kit.price)}</span>
                  <a
                    href="#"
                    onClick={comingSoon(kit.name)}
                    className="btn-primary text-sm px-5 py-2.5"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Human Concierge */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-display text-calm-900 text-center mb-3">
            Human Concierge
          </h2>
          <p className="text-calm-600 text-center mb-12 max-w-xl mx-auto">
            Need a real human for the heavy lifting? Book a session with our concierge team
            for live, expert help with complex administrative tasks.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {conciergeOptions.map((option) => (
              <div key={option.name} className="card flex flex-col p-8 text-center">
                <div className="text-3xl text-brand-500 mb-3">◆</div>
                <h3 className="text-xl font-bold font-display text-calm-900 mb-2">{option.name}</h3>
                <p className="text-sm text-calm-600 mb-6 flex-1">{option.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-calm-900">{formatPrice(option.price)}</span>
                  <span className="text-calm-500 text-sm"> / session</span>
                </div>
                <a href="#" onClick={comingSoon(option.name)} className="btn-secondary text-sm w-full">
                  {option.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: B2B */}
      <section className="py-16 bg-calm-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-display text-calm-900 text-center mb-3">
            For Organizations
          </h2>
          <p className="text-calm-600 text-center mb-12 max-w-xl mx-auto">
            The institution pays. The individual receives MyCTRL as part of their services.
            Ideal for corrections, re-entry, behavioral health, workforce, and social-service programs.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {institutionalPlans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 ${plan.popular ? 'border-brand-300 bg-gradient-to-br from-brand-50/40 to-white' : ''}`}
              >
                <h3 className="text-lg font-bold font-display text-calm-900 mb-1">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-calm-900">{formatPrice(plan.price)}</span>
                  <span className="text-calm-500 text-sm">{plan.unit}</span>
                </div>
                <p className="text-xs font-medium text-accent-600 mb-4">{plan.min}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-calm-700">
                      <span className="text-brand-500 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:hello@lifectrl.com?subject=Institutional%20Access%20Inquiry"
                  className="btn-secondary text-sm w-full"
                >
                  Contact Sales
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-brand-500 to-accent-600 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display">
            From "I don't know where to start" to "I know exactly what to do next."
          </h2>
          <p className="text-brand-100 text-lg">
            Try MyCTRL free today — no credit card required.
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
              <Link to="/" className="text-calm-500 hover:text-brand-600 transition-colors">Home</Link>
              <Link to="/terms" className="text-calm-500 hover:text-brand-600 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-calm-500 hover:text-brand-600 transition-colors">Privacy Policy</Link>
              <a href="mailto:hello@lifectrl.com" className="text-calm-500 hover:text-brand-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
