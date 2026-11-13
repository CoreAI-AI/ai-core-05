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
      {/* Premium blue welcome greeting */}
      <motion.section
        className="relative isolate overflow-hidden rounded-[28px] px-5 py-7 sm:px-7 sm:py-9"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Soft blue atmospheric glow */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-[18%] h-64 w-64 rounded-full bg-blue-500/20 blur-[85px]"
          animate={{ x: [0, 22, 0], y: [0, 12, 0], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 right-[8%] h-56 w-56 rounded-full bg-cyan-400/15 blur-[80px]"
          animate={{ x: [0, -18, 0], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] border border-blue-400/15 bg-gradient-to-br from-blue-500/[0.07] via-background/20 to-cyan-400/[0.04]" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500 dark:text-blue-300"
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
            >
              <Sparkles className="h-3 w-3" />
              <span>Your AI workspace</span>
            </motion.div>

            <h1
              aria-label="Hii, how can I help you today?"
              className="max-w-xl text-[2rem] font-semibold leading-[1.13] tracking-[-0.045em] text-foreground sm:text-[2.8rem] md:text-[3.15rem]"
            >
              {greetingWords.map((word, index) => {
                const isBlue = word === "help" || word === "you";
                return (
                  <motion.span
                    key={`${word}-${index}`}
                    className={`mr-[0.24em] inline-block ${isBlue ? "bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(56,189,248,0.18)]" : ""}`}
                    initial={{ opacity: 0, y: 16, filter: "blur(7px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.18 + index * 0.085,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </h1>

            <motion.p
              className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.82 }}
            >
              Ask anything. Explore ideas, solve problems, and create something amazing.
            </motion.p>
          </div>

          <motion.div
            className="relative mt-1 hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/25 bg-gradient-to-br from-blue-500/15 to-cyan-400/10 p-2 shadow-[0_0_35px_rgba(59,130,246,0.16)] sm:flex"
            whileHover={{ scale: 1.06, rotate: 4 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
          >
            <img src={coreaiLogo} alt="CoreAI" className="h-full w-full object-contain" />
            <span className="absolute -inset-px -z-10 rounded-2xl bg-blue-400/10 blur-xl" />
          </motion.div>
        </div>
      </motion.section>

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
          className="h-10 rounded-full border border-blue-400/25 bg-blue-500/[0.06] px-5 text-xs font-semibold text-blue-600 shadow-[0_0_22px_rgba(59,130,246,0.08)] transition-all hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-500 hover:shadow-[0_0_26px_rgba(59,130,246,0.16)] dark:text-blue-300 sm:text-sm"
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
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-purple-500 transition-colors">
                        Generate Image
                      </h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
                        4K AI Art
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Create unique, photorealistic images and art from your
                      prompts.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0 pl-2">
                  <span>Try it now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
