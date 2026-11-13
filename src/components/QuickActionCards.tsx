import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  Code2, 
  Bot, 
  Mic, 
  MessageSquare, 
  Image as ImageIcon, 
  ArrowUpRight, 
  BookOpen, 
  Compass, 
  HelpCircle, 
  Zap,
  X,
  Send
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import coreaiLogo from "@/assets/coreai-logo.png";

interface QuickActionCardsProps {
  onAction: (prompt: string) => void;
  onSkip?: () => void;
}

// Top Category Pills inspired by Curio AI layout
const categoryPills = [
  { id: "study", label: "Study planner", prompt: "Help me create an effective daily study planner with realistic goals and breaks." },
  { id: "inspire", label: "Daily inspiration", prompt: "Give me an inspiring thought and a practical productivity challenge for today." },
  { id: "code", label: "Code Helper", prompt: "Act as my senior code assistant. Help me write, debug, and optimize my code." },
  { id: "facts", label: "Quick facts", prompt: "Share 5 fascinating, lesser-known scientific and tech facts." },
  { id: "search", label: "Deep Research", prompt: "Perform deep research on the latest breakthroughs in artificial intelligence." },
  { id: "creative", label: "Creative Ideas", prompt: "Give me 5 unique creative ideas to build and launch as a solo founder." },
];

export const QuickActionCards = ({ onAction, onSkip }: QuickActionCardsProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const handleModalSubmit = (e: React.FormEvent, basePrompt: string) => {
    e.preventDefault();
    if (customInput.trim()) {
      onAction(`${basePrompt}: ${customInput.trim()}`);
      setActiveModal(null);
      setCustomInput("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Friendly Curio-style Greeting Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Hi! <span className="text-primary font-extrabold">How can I help you today?</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your smart companion for chatting, coding, and creative ideas.
          </p>
        </div>

        {/* Cute CoreAI Robot Badge */}
        <motion.div 
          className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center p-1.5 shadow-sm"
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img src={coreaiLogo} alt="CoreAI" className="w-full h-full object-contain" />
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-background"></span>
          </span>
        </motion.div>
      </motion.div>

      {/* Category Pills (Curio AI style) */}
      <motion.div 
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        {categoryPills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => onAction(pill.prompt)}
            className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/50 text-muted-foreground transition-all duration-200 whitespace-nowrap active:scale-95 shadow-2xs"
          >
            {pill.label}
          </button>
        ))}
      </motion.div>

      {/* Bento Grid: Talk with Bot, Chat with Bot, Generate Image */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        {/* Card 1: Talk with Bot */}
        <Card
          onClick={() => onAction("Let's talk! Can you ask me how my day is going and chat naturally with me?")}
          className="p-4 rounded-2xl cursor-pointer bg-gradient-to-br from-cyan-500/10 via-background to-blue-500/5 hover:border-cyan-500/40 border border-border/60 transition-all duration-200 group hover:shadow-md relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              Voice & Audio
            </span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-cyan-500 transition-colors">
            Talk with Bot
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            Chat naturally and get thoughtful instant answers to any question.
          </p>
        </Card>

        {/* Card 2: Chat with Bot */}
        <Card
          onClick={() => onAction("Hello CoreAI! What are some of the coolest things you can help me with right now?")}
          className="p-4 rounded-2xl cursor-pointer bg-gradient-to-br from-primary/10 via-background to-indigo-500/5 hover:border-primary/40 border border-border/60 transition-all duration-200 group hover:shadow-md relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Real-time
            </span>
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
            Chat with Bot
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            Get instant responses, homework help, explanations, and advice.
          </p>
        </Card>

        {/* Card 3: Wide Card - Generate Image */}
        <Card
          onClick={() => onAction("Generate an image of a futuristic, friendly assistant robot in a clean modern workspace")}
          className="sm:col-span-2 p-4 rounded-2xl cursor-pointer bg-gradient-to-r from-purple-500/10 via-background to-pink-500/10 hover:border-purple-500/40 border border-border/60 transition-all duration-200 group hover:shadow-md flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-purple-500 transition-colors">
                  Generate Image
                </h3>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  4K AI Art
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Create unique, photorealistic images and art from your prompts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0 pl-2">
            <span>Try it now</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </Card>
      </motion.div>

      {/* Dismiss / Skip */}
      {onSkip && (
        <div className="text-center pt-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSkip} 
            className="text-xs text-muted-foreground hover:text-foreground h-8 rounded-full"
          >
            Hide suggestions
          </Button>
        </div>
      )}
    </div>
  );
};
