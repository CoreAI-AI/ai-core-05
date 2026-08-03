import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";
import coreaiLogo from "@/assets/coreai-logo.png";

const ACCESS_CODE = "premcf";
const STORAGE_KEY = "coreai_access_granted";
const LENGTH = 6;

interface AccessCodeGateProps {
  onUnlock: () => void;
}

export const AccessCodeGate = ({ onUnlock }: AccessCodeGateProps) => {
  const [values, setValues] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const submit = (code: string) => {
    if (code.toLowerCase() === ACCESS_CODE) {
      setError(false);
      setUnlocking(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setTimeout(onUnlock, 1100);
    } else {
      setError(true);
      setValues(Array(LENGTH).fill(""));
      setTimeout(() => inputs.current[0]?.focus(), 50);
    }
  };

  const handleChange = (index: number, raw: string) => {
    const chars = raw.replace(/\s/g, "").split("");
    if (!chars.length) return;
    const next = [...values];
    let i = index;
    for (const c of chars) {
      if (i >= LENGTH) break;
      next[i] = c;
      i++;
    }
    setValues(next);
    setError(false);
    const focusAt = Math.min(i, LENGTH - 1);
    inputs.current[focusAt]?.focus();
    if (next.every((v) => v !== "")) submit(next.join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (next[index]) {
        next[index] = "";
        setValues(next);
      } else if (index > 0) {
        next[index - 1] = "";
        setValues(next);
        inputs.current[index - 1]?.focus();
      }
      setError(false);
    } else if (e.key === "Enter" && values.every((v) => v !== "")) {
      submit(values.join(""));
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.18) 0%, transparent 60%), radial-gradient(circle at 20% 80%, hsl(var(--primary) / 0.12) 0%, transparent 55%)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className={[
          "relative w-full max-w-md rounded-3xl border border-border/60 bg-card/60 p-6 sm:p-9",
          "shadow-2xl backdrop-blur-2xl",
        ].join(" ")}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={
          error
            ? { opacity: 1, y: 0, scale: 1, x: [0, -12, 11, -8, 6, -3, 0] }
            : { opacity: 1, y: 0, scale: 1, x: 0 }
        }
        transition={error ? { duration: 0.5 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            className="relative"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute -inset-3 rounded-full bg-primary/25 blur-xl" />
            <img
              src={coreaiLogo}
              alt="CoreAI logo"
              className="relative h-16 w-16 rounded-2xl shadow-lg sm:h-20 sm:w-20"
            />
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold sm:text-3xl">
              <span className="gradient-text">CoreAI Access</span>
            </h1>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              <Lock className="h-3.5 w-3.5" />
              Enter your 6-digit access code to continue
            </p>
          </div>

          {/* Code inputs */}
          <div className="mt-2 flex w-full items-center justify-center gap-2 sm:gap-3">
            {values.map((v, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                value={v}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.currentTarget.select()}
                maxLength={LENGTH}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label={`Access code character ${i + 1}`}
                disabled={unlocking}
                className={[
                  "h-12 w-10 rounded-xl border bg-background/50 text-center text-lg font-semibold uppercase",
                  "outline-none transition-all duration-200 backdrop-blur-sm sm:h-14 sm:w-12 sm:text-xl",
                  error
                    ? "border-destructive/70 text-destructive shadow-[0_0_0_3px_hsl(var(--destructive)/0.15)]"
                    : "border-border focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]",
                ].join(" ")}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium text-destructive"
              >
                Invalid Access Code
              </motion.p>
            )}
            {unlocking && (
              <motion.p
                key="ok"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm font-medium text-primary"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Access granted — unlocking CoreAI…
              </motion.p>
            )}
          </AnimatePresence>

          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary/80" />
            Protected preview build
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const hasAccessGranted = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
};
