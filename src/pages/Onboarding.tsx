import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  Briefcase,
  Languages,
  Mic,
  Image as ImageIcon,
  Code2,
  GraduationCap,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

type Answers = {
  name: string;
  role: string;
  useCase: string;
  language: string;
};

const ROLES = [
  "Student",
  "Working Professional",
  "Business Owner",
  "Creator / Artist",
  "Just Exploring",
];

const USE_CASES = [
  "Learning & Homework",
  "Work & Productivity",
  "Image Generation",
  "Coding Help",
  "Daily Chat",
  "Recipes & Lifestyle",
];

const LANGUAGES = ["Hinglish (Mixed)", "Hindi", "English"];

const CAPABILITIES = [
  {
    icon: GraduationCap,
    title: "Seekho aur samjho",
    desc: "Koi bhi topic simple language mein, step-by-step explanation ke saath.",
  },
  {
    icon: ImageIcon,
    title: "Images banao",
    desc: "Sirf likho aur CoreAI aapke idea ko image mein badal dega.",
  },
  {
    icon: Code2,
    title: "Code likho aur fix karo",
    desc: "Bugs dhundo, code samjho aur naye features banao.",
  },
  {
    icon: Mic,
    title: "Bolkar baat karo",
    desc: "Mic dabao, boliye — CoreAI sunega aur jawaab dega.",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const startedAt = useRef(Date.now());
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    name: "",
    role: "",
    useCase: "",
    language: "",
  });

  const totalPages = 5;

  useEffect(() => {
    track("onboarding_page_viewed", { page });
  }, [page]);

  const canProceed = useMemo(() => {
    if (page === 2) return answers.name.trim().length > 0;
    if (page === 3) return answers.role !== "" && answers.useCase !== "" && answers.language !== "";
    return true;
  }, [page, answers]);

  const persist = (status: "completed" | "skipped") => {
    try {
      localStorage.setItem(
        "coreai_onboarding",
        JSON.stringify({
          status,
          answers,
          completed_at: new Date().toISOString(),
        })
      );
      localStorage.setItem("coreai_onboarding_done", "1");
      if (answers.name.trim()) localStorage.setItem("coreai_user_name", answers.name.trim());
    } catch {}
  };

  const finish = (status: "completed" | "skipped") => {
    persist(status);
    track(status === "completed" ? "onboarding_completed" : "onboarding_skipped", {
      duration_ms: Date.now() - startedAt.current,
      page,
    });
    navigate("/", { replace: true });
  };

  const next = () => {
    if (!canProceed) return;
    if (page === totalPages - 1) return finish("completed");
    setDir(1);
    setPage((p) => p + 1);
  };

  const back = () => {
    if (page === 0) return;
    setDir(-1);
    setPage((p) => p - 1);
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(var(--primary) / 0.16), transparent 60%), radial-gradient(ellipse at bottom right, hsl(280 80% 60% / 0.12), transparent 60%), hsl(var(--background))",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-8 pt-5">
        <button
          onClick={back}
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors",
            page === 0 && "opacity-0 pointer-events-none"
          )}
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === page ? "w-7 bg-primary" : i < page ? "w-3 bg-primary/50" : "w-3 bg-muted"
              )}
            />
          ))}
        </div>

        <button
          onClick={() => finish("skipped")}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Pages */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={page}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              {page === 0 && <WelcomePage />}
              {page === 1 && <CapabilitiesPage />}
              {page === 2 && (
                <NamePage
                  value={answers.name}
                  onChange={(v) => setAnswers((a) => ({ ...a, name: v }))}
                  onEnter={next}
                />
              )}
              {page === 3 && (
                <PreferencesPage
                  answers={answers}
                  onChange={(patch) => setAnswers((a) => ({ ...a, ...patch }))}
                />
              )}
              {page === 4 && <ReadyPage name={answers.name} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 sm:px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <Button
            size="lg"
            className="w-full h-12 text-base gap-2 rounded-xl"
            disabled={!canProceed}
            onClick={next}
          >
            {page === totalPages - 1 ? "Start chatting" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

const WelcomePage = () => (
  <div className="text-center space-y-5">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
      className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center"
    >
      <Sparkles className="w-9 h-9 text-primary" />
    </motion.div>
    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
      Welcome to <span className="text-primary">CoreAI</span>
    </h1>
    <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
      Aapka apna AI partner — seekhne, likhne, banane aur sochne ke liye. Chaliye 30 second mein
      setup kar lete hain.
    </p>
  </div>
);

const CapabilitiesPage = () => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">CoreAI kya kar sakta hai</h2>
      <p className="text-muted-foreground text-sm sm:text-base">
        Ek hi jagah par sab kuch — chat, images, code aur voice.
      </p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      {CAPABILITIES.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 * i }}
          className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-4 flex gap-3"
        >
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            <c.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">{c.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const NamePage = ({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) => (
  <div className="space-y-6 max-w-md mx-auto">
    <div className="text-center space-y-3">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
        <User className="w-6 h-6 text-primary" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Aapka naam kya hai?</h2>
      <p className="text-muted-foreground text-sm">
        Taaki CoreAI aapko personally address kar sake.
      </p>
    </div>
    <Input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter()}
      placeholder="e.g. Prem"
      className="h-14 text-center text-lg rounded-xl"
    />
  </div>
);

const OptionGrid = ({
  icon: Icon,
  label,
  options,
  value,
  onSelect,
}: {
  icon: typeof User;
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) => (
  <div className="space-y-2.5">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onSelect(o)}
          className={cn(
            "px-3.5 py-2 rounded-full text-sm border transition-all",
            value === o
              ? "border-primary bg-primary/10 text-primary font-medium"
              : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const PreferencesPage = ({
  answers,
  onChange,
}: {
  answers: Answers;
  onChange: (patch: Partial<Answers>) => void;
}) => (
  <div className="space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Thoda personalize karein</h2>
      <p className="text-muted-foreground text-sm">
        Isse CoreAI aapke liye behtar jawaab de payega.
      </p>
    </div>
    <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur p-5 space-y-5">
      <OptionGrid
        icon={Briefcase}
        label="Aap kya karte hain?"
        options={ROLES}
        value={answers.role}
        onSelect={(v) => onChange({ role: v })}
      />
      <OptionGrid
        icon={Sparkles}
        label="CoreAI kis liye use karenge?"
        options={USE_CASES}
        value={answers.useCase}
        onSelect={(v) => onChange({ useCase: v })}
      />
      <OptionGrid
        icon={Languages}
        label="Reply language"
        options={LANGUAGES}
        value={answers.language}
        onSelect={(v) => onChange({ language: v })}
      />
    </div>
  </div>
);

const ReadyPage = ({ name }: { name: string }) => (
  <div className="text-center space-y-5">
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 15 }}
      className="mx-auto w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
    >
      <CheckCircle2 className="w-10 h-10 text-primary" />
    </motion.div>
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
      Sab set hai{name ? `, ${name}` : ""}!
    </h2>
    <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
      Free plan mein roz chat, images aur modes milte hain. Aur zyada chahiye to Premium kabhi bhi
      unlock kar sakte hain.
    </p>
    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs text-muted-foreground">
      <Crown className="w-3.5 h-3.5 text-primary" />
      Premium: unlimited chats, Deep Research aur priority speed
    </div>
  </div>
);
