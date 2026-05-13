import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AIHomeworkHelper = () => (
  <PageShell
    title="AI Homework Helper"
    description="Get instant homework help with CoreAI — math, science, English, history. Step-by-step explanations, free for students."
  >
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>AI Homework Helper for Students</h1>
      <p>
        Stuck on a homework problem? CoreAI explains every answer step-by-step so you actually learn,
        not just copy. Used by students from class 6 to college.
      </p>
      <h2>Subjects we cover</h2>
      <ul>
        <li>Maths — algebra, calculus, geometry</li>
        <li>Science — physics, chemistry, biology</li>
        <li>English — essays, grammar, summaries</li>
        <li>History, geography, computer science</li>
      </ul>
      <p>
        <Button asChild><Link to="/">Try Homework Helper Free</Link></Button>
      </p>
    </article>
  </PageShell>
);

export default AIHomeworkHelper;
