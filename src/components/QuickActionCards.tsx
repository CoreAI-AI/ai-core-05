
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mic,
  MessageSquare,
  Image as ImageIcon,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import coreaiLogo from "@/assets/coreai-logo.png";

interface QuickActionCardsProps {
  onAction: (prompt: string) => void;
  onSkip?: () => void;
}

const categoryPills = [
  {
    id: "study",
    label: "Study planner",
    prompt:
      "Help me create an effective daily study planner with realistic goals and breaks.",
  },
  {
    id: "inspire",
    label: "Daily inspiration",
    prompt:
      "Give me an inspiring thought and a practical productivity challenge for today.",
  },
  {
    id: "code",
    label: "Code Helper",
    prompt:
      "Act as my senior code assistant. Help me write, debug, and optimize my code.",
  },
  {
    id: "facts",
    label: "Quick facts",
    prompt: "Share 5 fascinating, lesser-known scientific and tech facts.",
  },
  {
    id: "search",
    label: "Deep Research",
    prompt:
      "Perform deep research on the latest breakthroughs in artificial intelligence.",
  },
  {
    id: "creative",
    label: "Creative Ideas",
    prompt:
      "Give me 5 unique creative ideas to build and launch as a solo founder.",
  },
];

const greetingWords = ["Hii,", "how", "can", "I", "help", "you", "today?"];

export const QuickActionCards = ({ onAction, onSkip }: QuickActionCardsProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleSuggestions = () => {
    setShowSuggestions((current) => !current);
    if (showSuggestions) onSkip?.();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Always-visible welcome greeting */}
      <motion.div
        className="flex items-center justify-between gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="min-w-0 space-y-2">
          <h1
            aria-label="Hii, how can I help you today?"
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight"
          >
            {greetingWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="inline-block mr-[0.28em]"
                initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.42,
                  delay: 0.12 + index * 0.075,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="text-xs sm:text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
          >
            Your smart companion for chatting, coding, and creative ideas.
          </motion.p>
        </div>

        <motion.div
          className="relative flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center p-1.5 shadow-sm"
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={coreaiLogo}
            alt="CoreAI"
            className="w-full h-full object-contain"
          />
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
          </span>
        </motion.div>
      </motion.div>

      {/* Quick Actions are opt-in, never expanded automatically */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.55 }}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleSuggestions}
          aria-expanded={showSuggestions}
          className="h-9 rounded-full px-4 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
          {showSuggestions ? "Hide Quick Actions" : "Show Quick Actions"}
        </Button>
      </motion.div>

      <AnimatePresence initial={false}>
        {showSuggestions && (
          <motion.div
            key="quick-actions-content"
            initial={{ opacity: 0, y: 14, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden space-y-5"
          >
            {/* Category pills */}
            <motion.div
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.08 }}
            >
              {categoryPills.map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onAction(pill.prompt)}
                  className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/50 text-muted-foreground transition-all duration-200 whitespace-nowrap active:scale-95 shadow-2xs"
                >
                  {pill.label}
                </button>
              ))}
            </motion.div>

            {/* Quick action cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card
                onClick={() =>
                  onAction(
                    "Let's talk! Can you ask me how my day is going and chat naturally with me?",
                  )
                }
                className="p-4 rounded-2xl cursor-pointer bg-gradient-to-br from-cyan-500/10 via-background to-blue-500/5 hover:border-cyan-500/40 border border-border/60 transition-all duration-200 group hover:shadow-md relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    Voice &amp; Audio
                  </span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-cyan-500 transition-colors">
                  Talk with Bot
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  Chat naturally and get thoughtful instant answers to any
                  question.
                </p>
              </Card>

              <Card
                onClick={() =>
                  onAction(
                    "Hello CoreAI! What are some of the coolest things you can help me with right now?",
                  )
                }
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
                  Get instant responses, homework help, explanations, and
                  advice.
                </p>
              </Card>

              <Card
                onClick={() =>
                  onAction(
                    "Generate an image of a futuristic, friendly assistant robot in a clean modern workspace",
                  )
                }
                className="sm:col-span-2 p-4 rounded-2xl cursor-pointer bg-gradient-to-r from-purple-500/10 via-background to-pink-500/10 hover:border-purple-500/40 border border-border/60 transition-all duration-200 group hover:shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-purple-500 transition-colors">
                      Create an Image
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Turn your imagination into stunning visuals.
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickActionCards;
