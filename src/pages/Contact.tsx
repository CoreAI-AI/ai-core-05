import { PageShell } from "@/components/PageShell";
import { Mail, MessageSquare, Globe } from "lucide-react";

const Contact = () => (
  <PageShell
    title="Contact CoreAI"
    description="Get in touch with the CoreAI team for support, feedback, partnerships or press inquiries."
  >
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Contact Us</h1>
      <p>
        Have a question, feedback or partnership idea? We'd love to hear from you. CoreAI is built
        with our community in mind, and every message helps us improve.
      </p>

      <div className="not-prose grid gap-4 md:grid-cols-3 my-8">
        <div className="border border-border rounded-xl p-5">
          <Mail className="w-5 h-5 mb-2 text-primary" />
          <h3 className="font-semibold">Email</h3>
          <a href="mailto:hello@coreai.app" className="text-sm text-muted-foreground">hello@coreai.app</a>
        </div>
        <div className="border border-border rounded-xl p-5">
          <MessageSquare className="w-5 h-5 mb-2 text-primary" />
          <h3 className="font-semibold">Support</h3>
          <a href="mailto:support@coreai.app" className="text-sm text-muted-foreground">support@coreai.app</a>
        </div>
        <div className="border border-border rounded-xl p-5">
          <Globe className="w-5 h-5 mb-2 text-primary" />
          <h3 className="font-semibold">Website</h3>
          <span className="text-sm text-muted-foreground">coreaii.vercel.app</span>
        </div>
      </div>

      <h2>Response time</h2>
      <p>We aim to respond to every email within 24–48 hours on weekdays.</p>
    </article>
  </PageShell>
);

export default Contact;
