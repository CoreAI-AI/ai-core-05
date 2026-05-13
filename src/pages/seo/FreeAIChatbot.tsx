import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FreeAIChatbot = () => (
  <PageShell
    title="Free AI Chatbot"
    description="CoreAI is a 100% free AI chatbot — chat, write, learn and solve problems instantly. No credit card needed."
  >
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Free AI Chatbot — CoreAI</h1>
      <p>
        Looking for a free AI chatbot that actually works? CoreAI gives you unlimited everyday chat,
        writing help, homework support and code assistance — without paying a rupee.
      </p>
      <h2>Why CoreAI is the best free AI chatbot</h2>
      <ul>
        <li>Truly free — no trials, no credit card</li>
        <li>Powered by latest Gemini & GPT models</li>
        <li>Hindi + English + Hinglish support</li>
        <li>Works on mobile and desktop</li>
      </ul>
      <p>
        <Button asChild><Link to="/">Start Chatting Free</Link></Button>
      </p>
    </article>
  </PageShell>
);

export default FreeAIChatbot;
