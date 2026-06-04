import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, X, User, Briefcase, Sparkles, Languages, CheckCircle2 } from "lucide-react";
import { track } from "@/lib/analytics";

interface OnboardingQuestionsProps {
  onComplete: () => void;
}

type Answers = {
  name: string;
  role: string;
  useCase: string;
  language: string;
};

const steps = [
  {
    id: "name",
    icon: User,
    title: "Aapka naam kya hai?",
    subtitle: "Taaki main aapko personally address kar saku",
    color: "from-blue-500 to-cyan-500",
    type: "text" as const,
    placeholder: "e.g. Prem",
    field: "name" as keyof Answers,
  },
  {
    id: "role",
    icon: Briefcase,
    title: "Aap kya karte hain?",
    subtitle: "Best experience ke liye",
    color: "from-purple-500 to-pink-500",
    type: "choice" as const,
    field: "role" as keyof Answers,
    options: ["Student", "Working Professional", "Business Owner", "Creator / Artist", "Just Exploring"],
  },
  {
    id: "useCase",
    icon: Sparkles,
    title: "CoreAI kis liye use karenge?",
    subtitle: "Aap ek se zyada bhi choose kar sakte hain baad mein",
    color: "from-amber-500 to-orange-500",
    type: "choice" as const,
    field: "useCase" as keyof Answers,
    options: ["Learning & Homework", "Work & Productivity", "Image Generation", "Coding Help", "Daily Chat", "Recipes & Lifestyle"],
  },
  {
    id: "language",
    icon: Languages,
    title: "Preferred reply language?",
    subtitle: "AI is hi language mein jawaab dega",
    color: "from-emerald-500 to-teal-500",
    type: "choice" as const,
    field: "language" as keyof Answers,
    options: ["Hinglish (Mixed)", "Hindi", "English"],
  },
];

export const OnboardingQuestions = ({ onComplete }: OnboardingQuestionsProps) => {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ name: "", role: "", useCase: "", language: "" });
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());
  const step = steps[index];
  const isLast = index === steps.length - 1;
  const currentValue = answers[step.field];
  const canProceed = currentValue.trim().length > 0;

  useEffect(() => {
    track("onboarding_viewed", { step: index, step_id: step.id });
  }, [index]);

  const persist = (status: "completed" | "skipped", data: Answers) => {
    try {
      localStorage.setItem(
        "coreai_onboarding",
        JSON.stringify({ status, answers: data, completed_at: new Date().toISOString() })
      );
      localStorage.setItem("coreai_onboarding_done", "1");
      if (data.name) localStorage.setItem("coreai_user_name", data.name);
    } catch {}
  };

  const handleSkip = () => {
    track("onboarding_skipped", { step: index, duration_ms: Date.now() - startedAt.current });
    persist("skipped", answers);
    onComplete();
  };

  const handleNext = () => {
    if (!canProceed) return;
    track("onboarding_answered", { step: index, step_id: step.id });
    if (isLast) {
      persist("completed", answers);
      track("onboarding_completed", { duration_ms: Date.now() - startedAt.current, answers });
      setDone(true);
      setTimeout(onComplete, 1400);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const setValue = (val: string) => setAnswers((a) => ({ ...a, [step.field]: val }));

  return (
    <motion.div
      className="fixed inset-0 z-[210] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(ellipse at bottom, hsl(280 80% 60% / 0.10), transparent 60%), hsl(var(--background))",
      }}
    >
      {!done && (
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-card/60 backdrop-blur-md border border-border rounded-full transition-colors"
        >
          Skip <X className="h-3 w-3" />
        </button>
      )}

      {/* Progress dots */}
      {!done && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full bg-muted-foreground/30"
              animate={{ width: i === index ? 28 : 8, backgroundColor: i < index ? "hsl(var(--primary))" : undefined }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}

      <div className="relative h-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="mb-6"
              >
                <CheckCircle2 className="w-24 h-24 text-primary" strokeWidth={2} />
              </motion.div>
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Welcome{answers.name ? `, ${answers.name}` : ""}! 🎉
              </h2>
              <p className="text-muted-foreground">Aapka CoreAI ready hai...</p>
            </motion.div>
          ) : (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.25 } }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center w-full max-w-md"
            >
              <motion.div
                className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-2xl`}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 14, stiffness: 180 }}
              >
                <motion.div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} blur-2xl opacity-50`}
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <step.icon className="relative w-10 h-10 text-white" strokeWidth={2.2} />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{step.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{step.subtitle}</p>

              {step.type === "text" ? (
                <Input
                  autoFocus
                  value={currentValue}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  placeholder={step.placeholder}
                  className="h-12 text-center text-base bg-card/70 backdrop-blur-md mb-6"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mb-6">
                  {step.options?.map((opt, i) => {
                    const selected = currentValue === opt;
                    return (
                      <motion.button
                        key={opt}
                        onClick={() => setValue(opt)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left ${
                          selected
                            ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                            : "bg-card/70 backdrop-blur-md border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canProceed}
                className="gradient-bg text-white font-semibold px-8 h-12 rounded-full shadow-xl btn-press group w-full sm:w-auto"
              >
                {isLast ? "Finish" : "Next"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
