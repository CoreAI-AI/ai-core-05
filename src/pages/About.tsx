import { PageShell } from "@/components/PageShell";
import { FounderIdentity } from "@/components/FounderIdentity";

const About = () => (
  <PageShell
    managedHead
    title="About CoreAI"
    description="Learn about CoreAI — a free AI chatbot and study assistant built for students, writers, coders and curious learners in English and Hindi."
  >
    <FounderIdentity />
    <article className="prose prose-neutral dark:prose-invert max-w-none mt-12">
      <h1>About CoreAI</h1>
      <p>
        CoreAI is a free AI assistant created to make learning, writing and problem-solving easier
        for everyone. Whether you're a student looking for homework help, a professional drafting
        emails, or a developer debugging code, CoreAI gives you fast, accurate answers in both
        English and Hindi.
      </p>

      <h2>Our Mission</h2>
      <p>
        We believe powerful AI should be accessible to everyone — not locked behind expensive
        subscriptions. CoreAI is free, private and works on any device.
      </p>

      <h2>What makes CoreAI different</h2>
      <ul>
        <li>Truly free — no hidden charges</li>
        <li>Hindi & English support out of the box</li>
        <li>Built for students, writers and developers</li>
        <li>Privacy-first: your chats stay on your device</li>
      </ul>
    </article>
  </PageShell>
);

export default About;
