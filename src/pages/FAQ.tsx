import { PageShell } from "@/components/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect } from "react";

const faqs = [
  { q: "Is CoreAI free?", a: "Yes, CoreAI is completely free to use with generous daily limits." },
  { q: "Can students use CoreAI?", a: "Absolutely. Students use CoreAI every day for homework help, research, essay writing and exam prep." },
  { q: "Does CoreAI support Hindi?", a: "Yes. CoreAI fluently understands and responds in Hindi, English and Hinglish." },
  { q: "Do I need to create an account?", a: "Yes, a free account is required to save your chat history and personal settings." },
  { q: "Is my data private?", a: "Your chat history is stored locally on your device. Prompts are sent securely to AI providers only to generate responses." },
  { q: "Can CoreAI generate images?", a: "Yes — just type a prompt like 'generate an image of...' and CoreAI will create it." },
  { q: "Does CoreAI work on mobile?", a: "Yes, CoreAI is fully responsive and works on phones, tablets and desktops." },
  { q: "Can CoreAI help with coding?", a: "Yes. CoreAI can write, explain and debug code in 30+ programming languages." },
];

const FAQ = () => {
  useEffect(() => {
    const ld = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(ld);
    script.id = "faq-jsonld";
    document.querySelector("#faq-jsonld")?.remove();
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return (
    <PageShell
      title="FAQ"
      description="Frequently asked questions about CoreAI — pricing, languages, privacy, account and more."
    >
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">Quick answers to common questions about CoreAI.</p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageShell>
  );
};

export default FAQ;
