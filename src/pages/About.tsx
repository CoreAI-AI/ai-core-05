import { PageShell } from "@/components/PageShell";

const About = () => (
  <PageShell
    title="About CoreAI"
    description="Learn about CoreAI — a free AI chatbot and study assistant built for students, writers, coders and curious learners in English and Hindi."
  >
    <article className="prose prose-neutral dark:prose-invert max-w-none">
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

      <h2>Founder</h2>
      <p>
        CoreAI was founded by <strong>Prem Prasad</strong>, with a vision to build the most
        student-friendly AI assistant in India.
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
