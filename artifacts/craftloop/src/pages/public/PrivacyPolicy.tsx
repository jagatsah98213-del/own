import { motion } from "framer-motion";
import { Link } from "wouter";
import { SEOHead, SITE_URL } from "@/components/SEOHead";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as any },
};

const LAST_UPDATED = "July 26, 2026";

const PRIVACY_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/privacy-policy`,
  "url": `${SITE_URL}/privacy-policy`,
  "name": "Privacy Policy | Trivinex Partners",
  "description": "Privacy Policy for Trivinex Partners — how we collect, use, and protect your personal information.",
  "isPartOf": { "@id": `${SITE_URL}/#website` },
  "dateModified": "2026-07-26",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section {...fadeUp} className="mb-12">
      <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight mb-4">{title}</h2>
      <div className="space-y-4 text-[#6E6E73] text-base leading-relaxed">{children}</div>
    </motion.section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col overflow-hidden">
      <SEOHead
        title="Privacy Policy"
        description="Read Trivinex Partners' Privacy Policy to understand how we collect, use, and protect your personal information."
        canonical="/privacy-policy"
        jsonLd={PRIVACY_JSONLD}
        noIndex={false}
      />

      {/* Hero */}
      <section className="relative bg-[#06060A] pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.12] px-4 py-1.5 text-xs font-semibold text-white/60 mb-8"
          >
            Legal
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-4"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/50 text-base"
          >
            Last updated: {LAST_UPDATED}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">

          <motion.p {...fadeUp} className="text-[#6E6E73] text-base leading-relaxed mb-12">
            Trivinex Partners ("we", "us", or "our") operates the website{" "}
            <a href="https://trivinexpartners.com" className="text-blue-600 hover:underline">trivinexpartners.com</a>.
            This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you
            visit our website or use our services. By using our website, you agree to the practices described in this policy.
          </motion.p>

          <Section title="1. Information We Collect">
            <p><strong className="text-[#1D1D1F]">Information you provide directly:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact details (name, email address, phone number) submitted through contact or quote forms.</li>
              <li>Project details, requirements, or messages submitted through inquiry forms.</li>
              <li>Payment information — processed securely through third-party payment providers; we do not store card data.</li>
              <li>Job application information submitted through our Careers or Freelancers pages.</li>
            </ul>
            <p><strong className="text-[#1D1D1F]">Information collected automatically:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browser type, IP address, operating system, and referring URLs collected via server logs.</li>
              <li>Pages visited, time on site, and interaction data collected via analytics tools.</li>
              <li>Cookies and similar tracking technologies (see Section 5).</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to your enquiries, quotes, and service requests.</li>
              <li>Deliver the digital services you have contracted us for.</li>
              <li>Process payments and manage invoices.</li>
              <li>Send service-related communications (project updates, receipts, support).</li>
              <li>Improve our website and services through analytics.</li>
              <li>Comply with our legal obligations.</li>
              <li>Evaluate freelancer applications and manage our talent pool.</li>
            </ul>
            <p>We do <strong className="text-[#1D1D1F]">not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </Section>

          <Section title="3. How We Share Your Information">
            <p>We may share your information only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1D1D1F]">Service delivery:</strong> With team members or contractors directly involved in fulfilling your project.</li>
              <li><strong className="text-[#1D1D1F]">Payment processors:</strong> With secure payment providers (PayPal, banking institutions) to process transactions.</li>
              <li><strong className="text-[#1D1D1F]">Legal requirements:</strong> When required by law, court order, or government authority.</li>
              <li><strong className="text-[#1D1D1F]">Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, with notice provided to you.</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain personal data for as long as necessary to provide our services, comply with legal obligations,
              resolve disputes, and enforce our agreements. Client project records are typically retained for 3 years
              after project completion. You may request deletion of your data at any time (see Section 7).
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>
              Our website uses cookies — small text files stored on your device — to improve your experience. We use:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1D1D1F]">Essential cookies:</strong> Required for the website to function (e.g. session management). Cannot be disabled.</li>
              <li><strong className="text-[#1D1D1F]">Analytics cookies:</strong> Help us understand how visitors use the site. These are anonymised.</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Disabling certain cookies may affect site functionality.
            </p>
          </Section>

          <Section title="6. Data Security">
            <p>
              We implement industry-standard security measures including HTTPS encryption, secure server configurations,
              rate limiting, and restricted access controls to protect your personal data from unauthorised access,
              disclosure, alteration, or destruction. While we take reasonable precautions, no method of transmission
              over the internet is 100% secure.
            </p>
          </Section>

          <Section title="7. Your Rights (GDPR & Privacy Rights)">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-[#1D1D1F]">Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong className="text-[#1D1D1F]">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong className="text-[#1D1D1F]">Deletion:</strong> Request that we delete your personal data ("right to be forgotten").</li>
              <li><strong className="text-[#1D1D1F]">Objection:</strong> Object to processing of your data for certain purposes.</li>
              <li><strong className="text-[#1D1D1F]">Portability:</strong> Request a copy of your data in a machine-readable format.</li>
              <li><strong className="text-[#1D1D1F]">Withdrawal of consent:</strong> Withdraw consent at any time where processing is based on consent.</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:trivinexpartners@gmail.com" className="text-blue-600 hover:underline">
                trivinexpartners@gmail.com
              </a>. We will respond within 30 days.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal
              information from children. If you believe a child has provided us with personal data, please contact us
              immediately and we will promptly delete it.
            </p>
          </Section>

          <Section title="9. Third-Party Links">
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices
              of those sites and encourage you to review their privacy policies independently.
            </p>
          </Section>

          <Section title="10. International Data Transfers">
            <p>
              Trivinex Partners operates globally. Your data may be processed in countries other than your own.
              By using our services, you consent to the transfer of your information to countries that may have
              different data protection laws than your jurisdiction. We take steps to ensure appropriate safeguards
              are in place for any such transfers.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date
              at the top of this page. We encourage you to review this policy periodically. Continued use of our website
              after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data,
              please contact us:
            </p>
            <div className="bg-[#F5F5F7] rounded-2xl p-6 mt-4">
              <p className="font-bold text-[#1D1D1F] mb-1">Trivinex Partners</p>
              <p>
                Email:{" "}
                <a href="mailto:trivinexpartners@gmail.com" className="text-blue-600 hover:underline">
                  trivinexpartners@gmail.com
                </a>
              </p>
              <p>Website: <a href="https://trivinexpartners.com" className="text-blue-600 hover:underline">trivinexpartners.com</a></p>
            </div>
          </Section>

          <motion.div {...fadeUp} className="pt-8 border-t border-[#E8E8ED]">
            <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
