import { PageShell } from "@/components/PageShell";
import { MessageCircle, GraduationCap, Zap, Languages, PenLine, Search, Image as ImageIcon, Code2 } from "lucide-react";

const features = [
  { icon: MessageCircle, title: "AI Chat", desc: "Natural conversations on any topic, 24/7." },
  { icon: GraduationCap, title: "Homework Help", desc: "Step-by-step explanations for math, science and more." },
  { icon: Zap, title: "Fast Responses", desc: "Optimized for low latency — answers in seconds." },
  { icon: Languages, title: "Hindi Support", desc: "Chat in Hindi, Hinglish or English seamlessly." },
  { icon: PenLine, title: "Writing Assistant", desc: "Essays, emails, summaries and creative writing." },
  { icon: Search, title: "Smart Search", desc: "Find answers across your chats and documents." },
  { icon: ImageIcon, title: "Image Generation", desc: "Create stunning images from text prompts." },
  { icon: Code2, title: "Code Helper", desc: "Debug, explain and write code in 30+ languages." },
];

const Features = () => (
  <PageShell
    title="Features"
    description="Explore all CoreAI features — AI chat, homework help, writing, code, image generation, Hindi support and more."
  >
    <h1 className="text-3xl font-bold mb-3">Everything CoreAI can do</h1>
    <p className="text-muted-foreground mb-10">A complete AI toolkit — completely free.</p>

    <div className="grid gap-4 md:grid-cols-2">
      {features.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="border border-border rounded-xl p-5 hover:shadow-md transition">
          <Icon className="w-6 h-6 text-primary mb-3" />
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>
  </PageShell>
);

export default Features;
