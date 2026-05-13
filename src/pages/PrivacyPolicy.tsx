import { PageShell } from "@/components/PageShell";

const PrivacyPolicy = () => (
  <PageShell
    title="Privacy Policy"
    description="Read how CoreAI collects, uses and protects your data. Privacy-first AI assistant with local-first chat history."
  >
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>What we collect</h2>
      <ul>
        <li>Account email (for sign-in)</li>
        <li>Chat messages you send to the AI (processed in real time, stored locally on your device)</li>
        <li>Optional uploaded files for analysis</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        Your prompts are sent to AI providers (Google Gemini, OpenAI) via a secure gateway only to
        generate responses. We do not sell your data. Chat history is stored on your device, not on
        our servers.
      </p>

      <h2>Security</h2>
      <ul>
        <li>HTTPS encryption end-to-end</li>
        <li>Authentication via secure tokens</li>
        <li>Row-level security on all backend data</li>
      </ul>

      <h2>Your rights</h2>
      <p>You can delete your account and clear local chat history at any time from Settings.</p>

      <h2>Contact</h2>
      <p>For privacy questions email <a href="mailto:privacy@coreai.app">privacy@coreai.app</a>.</p>
    </article>
  </PageShell>
);

export default PrivacyPolicy;
