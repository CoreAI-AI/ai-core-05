import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MessageSquare, ImagePlus, Mic, ChefHat, BookOpen, Code,
  Search, Sparkles, Shield, Zap, ArrowRight, X
} from "lucide-react";
import coreaiLogo from "@/assets/coreai-logo.png";
import { track } from "@/lib/analytics";

interface IntroExperienceProps {
  onComplete: () => void;
  source?: "first_visit" | "login" | "signup" | "manual";
}

const slides = [
  {
    id: "hero",
    kind: "hero" as const,
  },
  {
    id: "chat",
    title: "Smart AI Chat",
    subtitle: "Hindi + English mein natural conversations",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
    bullets: ["Context-aware replies", "Real-time streaming", "Unlimited topics"],
  },
  {
    id: "image",
    title: "AI Image Generation",
    subtitle: "Bas describe karo — image ban jaayegi",
    icon: ImagePlus,
    color: "from-purple-500 to-pink-500",
    bullets: ["Festival-aware styles", "HD quality", "Edit & remix"],
  },
  {
    id: "voice",
    title: "Voice & Audio",
    subtitle: "Bolo, sunlo — typing optional",
    icon: Mic,
    color: "from-emerald-500 to-teal-500",
    bullets: ["Voice transcription", "Natural text-to-speech", "Hands-free mode"],
  },
  {
    id: "modes",
    title: "Specialised Modes",
    subtitle: "Har kaam ke liye expert AI",
    icon: Sparkles,
    color: "from-amber-500 to-orange-500",
    bullets: [
      "🍳 Food Recipe Chef",
      "📚 Homework Helper",
      "💻 Code Assistant",
      "🔬 Deep Research",
    ],
  },
  {
    id: "trust",
    title: "Free • Private • Secure",
    subtitle: "Aapka data, aapke control mein",
    icon: Shield,
    color: "from-indigo-500 to-violet-500",
    bullets: ["Powered by AI", "End-to-end secure", "Always free to use"],
  },
  {
    id: "cta",
    kind: "cta" as const,
  },
];

export const IntroExperience = ({ onComplete, source = "first_visit" }: IntroExperienceProps) => {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const startedAt = useRef<number>(Date.now());

  // Fire 'viewed' once when intro mounts
  useEffect(() => {
    startedAt.current = Date.now();
    track("intro_viewed", { source });
  }, [source]);

  // Track every slide view + auto-advance non-CTA slides
  useEffect(() => {
    track("intro_slide_viewed", {
      source,
      slide_index: index,
      slide_id: (slide as any).id,
    });
    if ((slide as any).kind === "cta") return;
    const t = setTimeout(() => setIndex((i) => Math.min(i + 1, slides.length - 1)), 3200);
    return () => clearTimeout(t);
  }, [index]);

  const persistSeen = (status: "skipped" | "completed") => {
    try {
      localStorage.setItem(
        "coreai_intro_seen",
        JSON.stringify({
          status,
          source,
          slide_index: index,
          completed_at: new Date().toISOString(),
        })
      );
    } catch {
      localStorage.setItem("coreai_intro_seen", "1");
    }
  };

  const handleSkip = () => {
    track("intro_skipped", {
      source,
      slide_index: index,
      slide_id: (slide as any).id,
      duration_ms: Date.now() - startedAt.current,
    });
    persistSeen("skipped");
    onComplete();
  };

  const finish = () => {
    track("intro_completed", {
      source,
      duration_ms: Date.now() - startedAt.current,
    });
    persistSeen("completed");
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(ellipse at bottom, hsl(280 80% 60% / 0.12), transparent 60%), hsl(var(--background))",
      }}
    >
      {/* Floating ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
            initial={{
              x: `${(i * 37) % 100}%`,
              y: `${(i * 53) % 100}%`,
              opacity: 0,
            }}
            animate={{
              y: [`${(i * 53) % 100}%`, `${((i * 53) % 100 + 30) % 100}%`],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 6 + (i % 4),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={finish}
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-card/60 backdrop-blur-md border border-border rounded-full transition-colors"
      >
        Skip <X className="h-3 w-3" />
      </button>

      {/* Progress dots */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <motion.div
            key={i}
            className="h-1 rounded-full bg-muted-foreground/30 overflow-hidden"
            animate={{ width: i === index ? 28 : 8 }}
            transition={{ duration: 0.3 }}
          >
            {i === index && (
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.2, ease: "linear" }}
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative h-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* HERO */}
          {(slide as any).kind === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.4 } }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center max-w-md"
            >
              <motion.div
                className="relative mb-8"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                <motion.div
                  className="absolute -inset-8 rounded-full border-2 border-primary/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute -inset-4 rounded-full border border-primary/40"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full blur-3xl bg-primary"
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <img
                  src={coreaiLogo}
                  alt="CoreAI"
                  className="relative w-32 h-32 rounded-full shadow-2xl ring-4 ring-primary/30"
                />
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl font-bold gradient-text mb-3"
                initial={{ opacity: 0, y: 20, letterSpacing: "0.3em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                CoreAI
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg text-muted-foreground font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Your Intelligent AI Companion
              </motion.p>
              <motion.div
                className="mt-4 flex items-center gap-2 text-xs text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Powered by AI • Free Forever</span>
              </motion.div>
            </motion.div>
          )}

          {/* FEATURE SLIDES */}
          {slide && !(slide as any).kind && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, transition: { duration: 0.35 } }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center max-w-md"
            >
              <motion.div
                className={`relative w-28 h-28 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center mb-8 shadow-2xl`}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 14, stiffness: 180, delay: 0.1 }}
              >
                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${slide.color} blur-2xl opacity-60`}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <slide.icon className="relative w-14 h-14 text-white" strokeWidth={2.2} />
              </motion.div>

              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
              >
                {slide.title}
              </motion.h2>
              <motion.p
                className="text-base text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
              >
                {slide.subtitle}
              </motion.p>

              <div className="space-y-2.5 w-full">
                {slide.bullets?.map((b, i) => (
                  <motion.div
                    key={b}
                    className="flex items-center gap-3 px-4 py-2.5 bg-card/70 backdrop-blur-md border border-border rounded-xl text-sm text-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${slide.color}`} />
                    <span className="text-left flex-1">{b}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          {(slide as any).kind === "cta" && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="relative mb-6"
              >
                <motion.div
                  className="absolute inset-0 rounded-full blur-2xl bg-primary"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <img src={coreaiLogo} alt="CoreAI" className="relative w-20 h-20 rounded-full shadow-xl" />
              </motion.div>
              <motion.h2
                className="text-4xl sm:text-5xl font-bold gradient-text mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                You're all set!
              </motion.h2>
              <motion.p
                className="text-base text-muted-foreground mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Chaliye CoreAI ki duniya mein qadam rakhte hain ✨
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  size="lg"
                  onClick={finish}
                  className="gradient-bg text-white font-semibold px-8 h-12 rounded-full shadow-xl btn-press group"
                >
                  Start Chatting
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav arrows (bottom) */}
      {!(slide as any).kind && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 px-3 py-1.5"
          >
            Back
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 px-3 py-1.5"
          >
            Next <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
