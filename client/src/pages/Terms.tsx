import { Link } from 'react-router-dom';

const LAST_UPDATED = '2026-07-21';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-accent-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur border-b border-calm-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-calm-900 font-display">
            <span className="text-brand-500 text-2xl">◈</span>
            LifeCTRL™
          </Link>
          <Link to="/" className="btn-ghost text-sm">← Back home</Link>
        </div>
      </nav>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-calm-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-calm-500 mb-10">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="prose prose-calm max-w-none space-y-8 text-calm-800 leading-relaxed">
            {/* SECTION 1: OVERVIEW */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using LifeCTRL™ (the "Service"), operated by LifeCTRL ("Company," "we," "us," or "our"),
                you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not
                access or use the Service.
              </p>
              <p className="mt-3">
                By creating an account, you affirm that you are at least 18 years of age and are fully able and competent
                to enter into the terms and conditions set forth in these Terms.
              </p>
            </section>

            {/* SECTION 2: ACCOUNTS */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">2. Accounts and Registration</h2>
              <p>
                To access certain features of the Service, you must register for an account. You agree to provide accurate,
                current, and complete information during the registration process and to update such information to keep it
                accurate, current, and complete.
              </p>
              <p className="mt-3">
                You are responsible for safeguarding your account credentials and for all activities that occur under your
                account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            {/* SECTION 3: SERVICE DESCRIPTION */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">3. Description of Service</h2>
              <p>
                LifeCTRL™ is an AI-powered personal life management platform that provides action plans, document
                organization, guided Life Kits, and related administrative tools (the "Service"). The Service is designed
                to help users organize and manage personal life situations.
              </p>
              <p className="mt-3 font-semibold text-calm-900">Important Disclaimer — No Professional Advice:</p>
              <p className="mt-1">
                LifeCTRL™ is an administrative and organizational tool. It does not provide legal advice, medical advice,
                mental health services, financial advice, or any other licensed professional service. The action plans,
                Life Kits, and AI-generated content are informational only. You should consult qualified professionals for
                legal, medical, financial, or mental health matters.
              </p>
            </section>

            {/* SECTION 4: SUBSCRIPTIONS & PAYMENTS */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">4. Subscriptions, Payments, and Billing</h2>
              <p>
                The Service offers both free and paid subscription tiers. Paid subscriptions are processed through our
                authorized third-party payment processor, Stripe, Inc. ("Stripe"). By subscribing to a paid plan, you
                agree to Stripe's terms of service and privacy policy.
              </p>
              <p className="mt-3">
                Subscription fees are billed in advance on a monthly basis and are non-refundable except as required by
                applicable law. We reserve the right to change subscription fees upon reasonable notice. Your continued
                use of the Service after a fee change constitutes your acceptance of the new fees.
              </p>
              <p className="mt-3">
                You may cancel your subscription at any time through your account settings or by contacting us. Cancellation
                takes effect at the end of your current billing period, and you will retain access to paid features until
                that date.
              </p>
            </section>

            {/* SECTION 5: USER CONTENT */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">5. User Content</h2>
              <p>
                You retain all rights to the content, documents, information, and materials you upload or input into the
                Service ("User Content"). By submitting User Content, you grant the Company a limited, worldwide,
                non-exclusive, royalty-free license to use, process, store, and display your User Content solely for the
                purpose of operating, providing, and improving the Service to you.
              </p>
              <p className="mt-3">
                You represent and warrant that you own or have the necessary rights to all User Content you submit and
                that your User Content does not violate any third-party rights or applicable laws.
              </p>
            </section>

            {/* SECTION 6: INTELLECTUAL PROPERTY AND USE RESTRICTIONS */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">6. Intellectual Property and Use Restrictions</h2>

              <h3 className="text-lg font-semibold text-calm-800 mt-4 mb-2">6.1 Ownership of the Service and Software</h3>
              <p>
                Except for the explicit User Content defined in Section 5, all rights, titles, and interests in and to
                the Service—including but not limited to the literal source code, object code, user interface designs,
                logos, color themes, branding assets, database schemas, onboarding workflows, institutional modules, and
                the proprietary system architecture governing the "Life Kits" technical frameworks (collectively, the
                "Company Intellectual Property")—are and will remain the exclusive property of the Company.
              </p>
              <p className="mt-3">
                Your use of the Service does not grant you any ownership rights, copyrights, trademarks, or patents in
                our software or systems.
              </p>

              <h3 className="text-lg font-semibold text-calm-800 mt-4 mb-2">6.2 Limited Use License</h3>
              <p>
                Subject to your strict compliance with these Terms and your successful payment of all applicable
                subscription fees via our authorized payment processor (Stripe), the Company grants you a limited,
                non-exclusive, non-transferable, non-sublicensable, and revocable license to access and use the Service
                solely for your internal business or personal operations. This license automatically terminates upon the
                expiration, cancellation, or non-payment of your subscription.
              </p>

              <h3 className="text-lg font-semibold text-calm-800 mt-4 mb-2">6.3 Strict Prohibitions and Anti-Reverse Engineering</h3>
              <p>You explicitly agree that you will not, and will not permit any third party to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>(a) Decompile, disassemble, reverse-engineer, or otherwise attempt to derive or discover the source code, underlying algorithms, structure, or organization of the Service;</li>
                <li>(b) Modify, adapt, translate, or create derivative works based upon the Service, the Company Intellectual Property, or the "Life Kits" architecture;</li>
                <li>(c) Rent, lease, sublicense, resell, distribute, or commercially exploit the Service as a standalone feature or competing software product;</li>
                <li>(d) Remove, obscure, or alter any copyright notices, trademarks, or other proprietary rights notices embedded within or displayed by the Service;</li>
                <li>(e) Use any automated web scrapers, bots, data-mining tools, or extraction methods to map out, extract data from, or replicate the platform's interface and logical flows;</li>
                <li>(f) Input, feed, or upload any portion of the platform's operational interface or system workflows into any public or private Large Language Model (LLM) or Artificial Intelligence platform for the purpose of replicating or cloning the Service.</li>
              </ul>

              <h3 className="text-lg font-semibold text-calm-800 mt-4 mb-2">6.4 Trademark Protection</h3>
              <p>
                The platform name, logo, custom graphics, and slogans are trademarks or registered trademarks of the
                Company. You are granted no right or license to use these trademarks in any manner, including in
                metadata, keywords, or competing marketing campaigns, without our explicit prior written consent.
              </p>
            </section>

            {/* SECTION 7: ACCEPTABLE USE */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">7. Acceptable Use</h2>
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Violate any applicable law, regulation, or third-party rights;</li>
                <li>Upload or transmit malware, viruses, or harmful code;</li>
                <li>Engage in any activity that interferes with or disrupts the Service;</li>
                <li>Attempt to gain unauthorized access to the Service, other users' accounts, or Company systems;</li>
                <li>Use the Service for any fraudulent, deceptive, or unlawful purpose;</li>
                <li>Harass, abuse, or harm other users or Company personnel.</li>
              </ul>
            </section>

            {/* SECTION 8: TERMINATION */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">8. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account and access to the Service at any time, with or
                without cause, and with or without notice. Any violation of Section 6 (Intellectual Property and Use
                Restrictions) constitutes a material breach of these Terms. The Company reserves the right to immediately
                suspend or permanently terminate your account, revoke your license, block access to your data, and
                restrict your processing capabilities via Stripe routing, without refund or prior notice, while pursuing
                all available legal and equitable remedies.
              </p>
              <p className="mt-3">
                Upon termination, your right to use the Service will immediately cease. We may retain your User Content
                for a reasonable period as necessary to comply with legal obligations or for legitimate business purposes.
              </p>
            </section>

            {/* SECTION 9: DISCLAIMERS */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">9. Disclaimers and Limitation of Liability</h2>
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, THE COMPANY DISCLAIMS ALL WARRANTIES,
                INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="mt-3">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE COMPANY BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE
                OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.
              </p>
            </section>

            {/* SECTION 10: CHANGES TO TERMS */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">10. Changes to These Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes by
                posting the updated Terms on the Service and updating the "Last updated" date. Your continued use of
                the Service after such modifications constitutes your acceptance of the revised Terms.
              </p>
            </section>

            {/* SECTION 11: CONTACT */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">11. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:hello@lifectrl.com" className="text-brand-600 hover:text-brand-700 underline">
                  hello@lifectrl.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-calm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-calm-500">
            <div className="flex items-center gap-2">
              <span className="text-brand-500">◈</span>
              <span>LifeCTRL™ &copy; {new Date().getFullYear()}. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
              <Link to="/terms" className="hover:text-brand-600 transition-colors font-medium text-calm-700">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
              <a href="mailto:hello@lifectrl.com" className="hover:text-brand-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
