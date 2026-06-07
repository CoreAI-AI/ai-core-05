import { PageShell } from "@/components/PageShell";

const TermsAndConditions = () => (
  <PageShell
    title="Terms & Conditions | CoreAI"
    description="Read CoreAI's full Terms & Conditions covering acceptable use, accounts, AI content, payments, liability and more."
  >
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Terms &amp; Conditions</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        Welcome to CoreAI. These Terms &amp; Conditions ("Terms") govern your access to and use of
        the CoreAI website, mobile apps and related services (collectively, the "Service"). By
        creating an account or using the Service, you agree to these Terms.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 13 years old (or the minimum age in your country) to use CoreAI. If you
        are under 18, you confirm that a parent or guardian has reviewed and agreed to these Terms
        on your behalf.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You are responsible for keeping your login credentials confidential.</li>
        <li>You are responsible for all activity that happens under your account.</li>
        <li>Notify us immediately at <strong>likhaipadhai415@gmail.com</strong> if you suspect unauthorized access.</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>You agree NOT to use CoreAI to:</p>
      <ul>
        <li>Break any law or violate anyone's rights.</li>
        <li>Generate hateful, sexual, violent, harassing or misleading content.</li>
        <li>Create malware, phishing pages, or content that exploits minors.</li>
        <li>Reverse-engineer, scrape, or overload the Service.</li>
        <li>Resell or redistribute the Service without written permission.</li>
      </ul>

      <h2>4. AI-generated content</h2>
      <p>
        CoreAI uses third-party AI models. Output can be inaccurate, biased or incomplete. You are
        responsible for reviewing AI output before relying on it for medical, legal, financial or
        other important decisions. You own the content you create using CoreAI, subject to the
        underlying model providers' terms and applicable law.
      </p>

      <h2>5. Subscriptions &amp; payments</h2>
      <ul>
        <li>Free plans include daily usage limits that may change at any time.</li>
        <li>Paid plans renew automatically unless cancelled before the renewal date.</li>
        <li>Prices are shown in INR/USD and may include applicable taxes.</li>
        <li>Refunds are handled on a case-by-case basis — contact support within 7 days of purchase.</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        The CoreAI name, logo, design and software are owned by CoreAI and protected by applicable
        IP laws. You may not copy or use our branding without permission.
      </p>

      <h2>7. Third-party services</h2>
      <p>
        CoreAI integrates with services like Google, OpenAI and Gemini. Your use of those services
        is also subject to their own terms and privacy policies.
      </p>

      <h2>8. Termination</h2>
      <p>
        We may suspend or terminate your account at any time for violating these Terms. You can
        delete your account anytime from Settings.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        The Service is provided "as is" and "as available" without warranties of any kind, whether
        express or implied, including merchantability, fitness for a particular purpose, and
        non-infringement.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, CoreAI shall not be liable for any indirect,
        incidental, special, consequential or punitive damages arising out of your use of the
        Service.
      </p>

      <h2>11. Indemnity</h2>
      <p>
        You agree to indemnify and hold CoreAI harmless from any claims arising out of your misuse
        of the Service or violation of these Terms.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These Terms are governed by the laws of India. Any disputes shall be subject to the
        exclusive jurisdiction of the courts in your local jurisdiction in India.
      </p>

      <h2>13. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be notified in-app or by
        email. Continued use of the Service after changes means you accept the updated Terms.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:likhaipadhai415@gmail.com">likhaipadhai415@gmail.com</a>.
      </p>
    </article>
  </PageShell>
);

export default TermsAndConditions;
