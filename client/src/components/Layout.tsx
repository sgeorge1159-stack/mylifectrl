import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { STRIPE_LINKS, openPaymentLink } from '../config/payments';
import FeedbackButton from './FeedbackButton';
import BrandLogo from './BrandLogo';

const navItems = [
  { to: '/dashboard', label: 'CTRL Center', icon: '◈' },
  { to: '/plans', label: 'Action Plans', icon: '▦' },
  { to: '/docs', label: 'Docs', icon: '◫' },
  { to: '/vault', label: 'LifeVault', icon: '◒' },
  { to: '/kits', label: 'Life Kits', icon: '✦' },
  { to: '/concierge', label: 'Concierge', icon: '◆' },
];

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-accent-50">
      <nav className="bg-white border-b border-calm-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-calm-900 font-display">
              <BrandLogo />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith(item.to)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-calm-600 hover:text-calm-900 hover:bg-calm-100'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => openPaymentLink(STRIPE_LINKS.pro)}
                className="ml-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-accent-500 text-white hover:bg-accent-600 transition-all shadow-sm"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-calm-600 hover:bg-calm-100"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname.startsWith(item.to)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-calm-600 hover:text-calm-900 hover:bg-calm-100'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openPaymentLink(STRIPE_LINKS.pro);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-accent-500 text-white hover:bg-accent-600 transition-all"
              >
                <span className="mr-1.5">⬆</span>
                Upgrade to Pro
              </button>
            </div>
          )}
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-calm-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-calm-500">
            <div className="flex items-center gap-2">
              <span className="text-brand-500">◈</span>
              <span>LifeCTRL™ &copy; {new Date().getFullYear()}. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
              <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
              <a href="mailto:hello@lifectrl.com" className="hover:text-brand-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackButton />
    </div>
  );
}
