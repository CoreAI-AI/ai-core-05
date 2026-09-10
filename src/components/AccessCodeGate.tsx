import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import coreaiLogo from "@/assets/coreai-logo.png";
import heroArt from "@/assets/access-hero-3d.png";

const ACCESS_CODE = "PREMPP";
const LENGTH = 6;

interface AccessCodeGateProps {
  onUnlock: () => void;
}

export const AccessCodeGate = ({ onUnlock }: AccessCodeGateProps) => {
  const [chars, setChars] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const code = chars.join("");
  const filled = code.length === LENGTH && chars.every(Boolean);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const setAt = (i: number, v: string) => {
    setError(false);
    setChars((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  const handleChange = (i: number, raw: string) => {
    const clean = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (!clean) {
      setAt(i, "");
      return;
    }
    if (clean.length > 1) {
      // paste
      setError(false);
      setChars((prev) => {
        const next = [...prev];
        for (let k = 0; k < clean.length && i + k < LENGTH; k++) next[i + k] = clean[k];
        return next;
      });
      const target = Math.min(i + clean.length, LENGTH - 1);
      refs.current[target]?.focus();
      return;
    }
    setAt(i, clean);
    if (i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[i] && i > 0) {
      e.preventDefault();
      setAt(i - 1, "");
      refs.current[i - 1]?.focus();
    } else if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < LENGTH - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const submit = () => {
    if (!filled || loading) return;
    refs.current.forEach((r) => r?.blur());
    if (code === ACCESS_CODE) {
      setLoading(true);
      setTimeout(onUnlock, 800);
    } else {
      setError(true);
      setTimeout(() => {
        setChars(Array(LENGTH).fill(""));
        refs.current[0]?.focus();
      }, 450);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:
          "radial-gradient(120% 90% at 20% 0%, #dfe3ff 0%, transparent 60%), radial-gradient(100% 80% at 90% 20%, #d6f3ff 0%, transparent 55%), radial-gradient(120% 100% at 50% 110%, #e6e2ff 0%, transparent 60%), #eef1fd",
      }}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[440px] rounded-[2.25rem] border border-white/60 bg-white/50 p-5 shadow-[0_30px_80px_-30px_rgba(80,90,180,0.55)] backdrop-blur-2xl sm:p-8 lg:grid lg:max-w-[1040px] lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:p-12 xl:max-w-[1180px] 2xl:max-w-[1320px]"
        >
          {/* Left / brand + hero */}
          <div className="lg:order-1">
          {/* Branding */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={coreaiLogo} alt="CoreAI logo" className="h-10 w-10 rounded-full shadow-md lg:h-14 lg:w-14" />
              <span className="text-2xl font-bold tracking-tight text-slate-800 lg:text-4xl">
                Core
                <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/80 shadow-sm lg:hidden">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
            </div>
          </div>

          {/* 3D hero */}
          <motion.img
            src={heroArt}
            alt="CoreAI 3D assistant illustration"
            className="mx-auto mt-2 w-[72%] max-w-[260px] drop-shadow-[0_20px_30px_rgba(110,110,200,0.28)] lg:mt-6 lg:w-full lg:max-w-[460px] 2xl:max-w-[540px]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          </div>

          {/* Right / form */}
          <div className="lg:order-2">
          {/* Heading */}
          <div className="mt-1 text-center lg:mt-0 lg:text-left">
            <span className="mb-4 hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/80 shadow-sm lg:inline-flex">
              <ShieldCheck className="h-6 w-6 text-indigo-500" />
            </span>
            <h1 className="text-[1.55rem] font-extrabold leading-tight tracking-tight text-slate-800 sm:text-[1.9rem] lg:text-[2.6rem] 2xl:text-[3rem]">
              Enter Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                6-Character Access Code
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 lg:text-lg">Your secure access to CoreAI</p>
          </div>

          {/* Inputs */}
          <motion.div
            className="mt-6 flex items-center justify-center gap-1.5 sm:gap-2.5 lg:justify-start lg:gap-3"
            animate={error ? { x: [0, -10, 9, -6, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
          >
            {chars.map((c, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                value={c}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                onFocus={(e) => e.currentTarget.select()}
                inputMode="text"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                maxLength={LENGTH}
                aria-label={`Access code character ${i + 1}`}
                className={[
                  "h-[3.1rem] w-[2.6rem] rounded-2xl border bg-white/85 text-center text-xl font-bold uppercase text-slate-700 outline-none transition-all duration-200 sm:h-14 sm:w-12 sm:text-2xl lg:h-16 lg:w-14 lg:text-3xl",
                  error
                    ? "border-rose-300 shadow-[0_0_0_3px_rgba(244,114,182,0.18)]"
                    : "border-white shadow-[0_8px_18px_-10px_rgba(80,90,180,0.6)] focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.2)]",
                ].join(" ")}
              />
            ))}
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center text-sm font-medium text-rose-500 lg:text-left"
              >
                Invalid Access Code — please try again.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Continue */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={submit}
            disabled={!filled || loading}
            className={[
              "mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-semibold text-white transition-all duration-300 lg:h-16 lg:max-w-[420px] lg:text-lg",
              filled
                ? "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_16px_34px_-14px_rgba(20,184,166,0.9)]"
                : "cursor-not-allowed bg-gradient-to-r from-cyan-500/40 to-emerald-400/40",
            ].join(" ")}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Unlocking…
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Access is never persisted — the code must be entered on every visit.
export const hasAccessGranted = () => false;
