import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HindiAIAssistant = () => (
  <PageShell
    title="Hindi AI Assistant"
    description="CoreAI Hindi mein baat karta hai — chat, padhai, writing aur code help, sab kuch Hindi mein. Free AI assistant for India."
  >
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Hindi AI Assistant — CoreAI</h1>
      <p>
        CoreAI ek free Hindi AI assistant hai jo aapke har sawaal ka jawaab Hindi, English ya
        Hinglish mein de sakta hai. Padhai, likhayi, code ya rozmarra ki baatcheet — sab kuch ek
        jagah.
      </p>
      <h2>CoreAI Hindi mein kya kar sakta hai?</h2>
      <ul>
        <li>Homework aur padhai mein madad</li>
        <li>Essay, application aur email likhna</li>
        <li>Translation — Hindi to English aur English to Hindi</li>
        <li>Code samjhaana aur debug karna</li>
      </ul>
      <p>
        <Button asChild><Link to="/">Hindi mein Chat Shuru Karein</Link></Button>
      </p>
    </article>
  </PageShell>
);

export default HindiAIAssistant;
