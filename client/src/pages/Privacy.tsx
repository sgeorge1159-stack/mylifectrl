import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-accent-50">
      {/* Simple header */}
      <nav className="bg-white/80 backdrop-blur border-b border-calm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-calm-900 font-display">
            <span className="text-brand-500 text-2xl">◈</span>
            LIFECTRL™
          </Link>
          <Link to="/" className="btn-ghost text-sm">← Back home</Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl text-brand-300 mb-6">🔒</div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-calm-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-lg text-calm-500 mb-2 font-medium">Coming Soon</p>
          <p className="text-calm-600 leading-relaxed max-w-lg mx-auto">
            We take your privacy seriously. A complete Privacy Policy is being prepared. LIFECTRL™
            stores your account information, plans, documents, and usage data to provide and improve
            our services. We do not sell your personal data. For questions, contact us.
          </p>
          <div className="mt-8">
            <a
              href="mailto:hello@lifectrl.com"
              className="btn-primary text-sm"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-accent-50 border-t border-calm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-calm-500">
            <span>LIFECTRL™ &copy; {new Date().getFullYear()}. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
              <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms</Link>
              <Link to="/privacy" className="hover:text-brand-600 transition-colors font-medium text-calm-700">Privacy</Link>
              <a href="mailto:hello@lifectrl.com" className="hover:text-brand-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
