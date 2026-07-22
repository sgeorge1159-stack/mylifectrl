import { Link } from 'react-router-dom';

const LAST_UPDATED = '2026-07-21';

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-calm-500 mb-10">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="prose prose-calm max-w-none space-y-8 text-calm-800 leading-relaxed">
            {/* SECTION 1: OVERVIEW */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">1. Introduction</h2>
              <p>
                LifeCTRL ("Company," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use the LifeCTRL™ platform
                (the "Service"). By using the Service, you agree to the collection and use of information in accordance
                with this policy.
              </p>
            </section>

            {/* SECTION 2: INFORMATION WE COLLECT */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-calm-800 mt-4 mb-2">2.1 Information You Provide to Us</h3>
              <p>We collect information you voluntarily provide when you create an account or use the Service, including:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Account information:</strong> Your name, email address, and password (hashed).</li>
                <li><strong>Institutional affiliation:</strong> If you access LifeCTRL through an institutional partner
                  (e.g., re-entry program, university, employer), we may receive your name, email, and affiliation status
                  from that partner.</li>
                <li><strong>Life Kit inputs:</strong> Information you provide when describing your situation to generate
                  action plans, including details about your employment, finances, housing, health, family, and other
                  personal circumstances you choose to share.</li>
                <li><strong>Uploaded documents:</strong> Files you upload to the Document Studio or LifeVault, such as
                  PDFs, images, emails, and other records.</li>
                <li><strong>Concierge requests:</strong> Topics, descriptions, and preferred times you submit when booking
                  human concierge assistance.</li>
                <li><strong>Feedback:</strong> Messages you submit through our feedback form.</li>
                <li><strong>Communication data:</strong> Information you provide when contacting us via email.</li>
              </ul>

              <h3 className="text-lg font-semibold text-calm-800 mt-4 mb-2">2.2 Information Collected Automatically</h3>
              <p>When you access the Service, we automatically collect certain information, including:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Log data:</strong> Your IP address, browser type and version, operating system, referring/exit
                  pages, date and time stamps, and clickstream data.</li>
                <li><strong>Device information:</strong> Information about the device you use to access the Service, including
                  hardware model, operating system, and unique device identifiers.</li>
                <li><strong>Usage analytics:</strong> Pages visited, features used, time spent on pages, and interaction
                  patterns within the Service. We use this data to improve the Service and understand how users engage with
                  our features.</li>
                <li><strong>Cookies and similar technologies:</strong> We use essential cookies for authentication and
                  session management. We may also use analytics cookies to understand usage patterns. You can control
                  cookies through your browser settings.</li>
              </ul>
            </section>

            {/* SECTION 3: HOW WE USE YOUR INFORMATION */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>To provide, maintain, and improve the Service;</li>
                <li>To create and manage your account;</li>
                <li>To generate personalized action plans and organize your documents;</li>
                <li>To process payments through our third-party payment processor;</li>
                <li>To communicate with you about your account, updates, and support inquiries;</li>
                <li>To analyze usage patterns and improve the Service's functionality and user experience;</li>
                <li>To detect, prevent, and address fraud, security, or technical issues;</li>
                <li>To comply with legal obligations and enforce our Terms of Service.</li>
              </ul>
            </section>

            {/* SECTION 4: DATA SHARING & THIRD PARTIES */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">4. How We Share Your Information</h2>
              <p>
                We do not sell your personal information. We may share your information in the following limited
                circumstances:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>
                  <strong>Service providers:</strong> We engage trusted third-party companies and individuals to perform
                  services on our behalf, such as payment processing, cloud hosting, and AI/LLM processing. These providers
                  have access to your information only to perform these tasks and are obligated not to disclose or use it
                  for any other purpose.
                </li>
                <li>
                  <strong>Payment processing (Stripe):</strong> Payments for paid subscriptions are processed by Stripe, Inc.
                  When you subscribe to a paid plan, your payment information is collected and processed directly by Stripe.
                  We do not store your full credit card number or sensitive payment details on our servers. Stripe's use of
                  your personal information is governed by Stripe's own{' '}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 underline">
                    Privacy Policy
                  </a>. By using our paid services, you agree to Stripe's terms and privacy practices.
                </li>
                <li>
                  <strong>Institutional partners:</strong> If you access LifeCTRL through an institutional partner (e.g.,
                  re-entry program, university, employer), we may share aggregated or de-identified usage data with that
                  partner. We will not share the specific contents of your action plans or uploaded documents with
                  institutional partners without your explicit consent, except as required by law.
                </li>
                <li>
                  <strong>Legal compliance:</strong> We may disclose your information if required to do so by law, court
                  order, or governmental authority, or if we believe in good faith that such disclosure is necessary to
                  protect our rights, your safety, or the safety of others.
                </li>
                <li>
                  <strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion
                  of our assets, your information may be transferred as part of that transaction. We will notify you before
                  your information is transferred and becomes subject to a different privacy policy.
                </li>
              </ul>
            </section>

            {/* SECTION 5: DATA RETENTION */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">5. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide you the
                Service. If you delete your account, we will delete or anonymize your personal information within a
                reasonable timeframe, except where we are required to retain certain information to comply with legal
                obligations, resolve disputes, or enforce our agreements.
              </p>
              <p className="mt-3">
                Action plans, uploaded documents, and LifeVault items are retained for the life of your account. You may
                delete individual items at any time through the Service interface.
              </p>
            </section>

            {/* SECTION 6: DATA SECURITY */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">6. Data Security</h2>
              <p>
                We implement industry-standard technical and organizational measures to protect your information against
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Encryption of data in transit using TLS/HTTPS;</li>
                <li>Password hashing using bcrypt with appropriate work factors;</li>
                <li>Database access controls and authentication;</li>
                <li>Regular security reviews of our infrastructure and code.</li>
              </ul>
              <p className="mt-3">
                However, no method of electronic storage or transmission is 100% secure. While we strive to protect your
                information, we cannot guarantee its absolute security. You are responsible for maintaining the
                confidentiality of your account credentials.
              </p>
            </section>

            {/* SECTION 7: YOUR RIGHTS & CHOICES */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">7. Your Rights and Choices</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li><strong>Access and update:</strong> You can access and update your account information at any time
                  through your account settings.</li>
                <li><strong>Data deletion:</strong> You may delete your account and associated data by contacting us at
                  hello@lifectrl.com. We will process your request within a reasonable timeframe.</li>
                <li><strong>Data export:</strong> Upon request, we can provide you with a copy of your personal data in
                  a machine-readable format.</li>
                <li><strong>Communication preferences:</strong> You may opt out of non-essential communications by
                  following the unsubscribe instructions in our emails or by contacting us.</li>
                <li><strong>Cookie controls:</strong> Most browsers allow you to refuse or delete cookies. Disabling
                  cookies may affect the functionality of the Service.</li>
              </ul>
            </section>

            {/* SECTION 8: CHILDREN'S PRIVACY */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">8. Children's Privacy</h2>
              <p>
                The Service is not intended for individuals under the age of 18. We do not knowingly collect personal
                information from children under 18. If we become aware that we have collected personal information from
                a child under 18 without parental consent, we will take steps to delete that information promptly.
              </p>
            </section>

            {/* SECTION 9: INTERNATIONAL DATA TRANSFERS */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed on servers located in the United States and other
                jurisdictions where our service providers operate. These jurisdictions may have data protection laws that
                differ from those in your country of residence. By using the Service, you consent to the transfer of your
                information to the United States and other jurisdictions as described in this Privacy Policy.
              </p>
            </section>

            {/* SECTION 10: CHANGES TO THIS POLICY */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting
                the updated policy on the Service and updating the "Last updated" date. Your continued use of the Service
                after such modifications constitutes your acceptance of the revised policy. We encourage you to review
                this Privacy Policy periodically.
              </p>
            </section>

            {/* SECTION 11: CONTACT US */}
            <section>
              <h2 className="text-xl font-bold font-display text-calm-900 mb-3">11. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices,
                please contact us at{' '}
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
              <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-brand-600 transition-colors font-medium text-calm-700">Privacy Policy</Link>
              <a href="mailto:hello@lifectrl.com" className="hover:text-brand-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
