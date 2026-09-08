import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2, Delete } from "lucide-react";
import coreaiLogo from "@/assets/coreai-logo.png";
import heroArt from "@/assets/access-hero-3d.png";

const ACCESS_CODE = "123456";
const LENGTH = 6;

interface AccessCodeGateProps {
  onUnlock: () => void;
}

export const AccessCodeGate = ({ onUnlock }: AccessCodeGateProps) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const hiddenRef = useRef<HTMLInputElement | null>(null);
  const filled = digits.length === LENGTH;

  useEffect(() => {
    hiddenRef.current?.focus();
  }, []);

  const push = (d: string) => {
    if (loading) return;
    setError(false);
    setDigits((prev) => (prev.length >= LENGTH ? prev : [...prev, d]));
  };

  const pop = () => {
    setError(false);
    setDigits((prev) => prev.slice(0, -1));
  };

  const submit = () => {
    if (!filled || loading) return;
    if (digits.join("") === ACCESS_CODE) {
      setLoading(true);
      setTimeout(onUnlock, 900);
    } else {
      setError(true);
      setTimeout(() => setDigits([]), 450);
    }
  };

  useEffect(() => {
    if (digits.length === LENGTH) {
      const t = setTimeout(submit, 180);
      return () => clearTimeout(t);
    }
  }, [digits]);

  const onKey = (e: React.KeyboardEvent) => {
    if (/^[0-9]$/.test(e.key)) push(e.key);
    else if (e.key === "Backspace") pop();
    else if (e.key === "Enter") submit();
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <motion.div
      className="fixed inset-0 z-[300] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => hiddenRef.current?.focus()}
      style={{
        background:
          "radial-gradient(120% 90% at 20% 0%, #dfe3ff 0%, transparent 60%), radial-gradient(100% 80% at 90% 20%, #d6f3ff 0%, transparent 55%), radial-gradient(120% 100% at 50% 110%, #e6e2ff 0%, transparent 60%), #eef1fd",
      }}
    >
      {/* Floating ambient orbs */}
      <motion.div
        className="pointer-events-none absolute left-[-3rem] top-1/3 h-24 w-24 rounded-full blur-[2px]"
        style={{ background: "linear-gradient(135deg,#8b8cf9,#6f7bf7)", opacity: 0.65 }}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-2rem] top-[28%] h-20 w-20 rounded-full blur-[2px]"
        style={{ background: "linear-gradient(135deg,#5ee7a8,#37d3c0)", opacity: 0.6 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <input
        ref={hiddenRef}
        inputMode="numeric"
        pattern="[0-9]*"
        className="absolute h-0 w-0 opacity-0"
        onKeyDown={onKey}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "");
          if (v) v.split("").forEach(push);
          e.target.value = "";
        }}
        aria-label="Access code"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] rounded-[2.25rem] border border-white/60 bg-white/45 p-5 shadow-[0_30px_80px_-30px_rgba(80,90,180,0.55)] backdrop-blur-2xl sm:p-7"
        >
          {/* Top brand row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src={coreaiLogo} alt="CoreAI logo" className="h-10 w-10 rounded-full shadow-md" />
              <span className="text-2xl font-bold tracking-tight text-slate-800">
                Core
                <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/70 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-indigo-500" />
            </div>
          </div>

          {/* 3D hero */}
          <motion.img
            src={heroArt}
            alt="CoreAI futuristic assistant illustration"
            width={1024}
            height={768}
            className="mx-auto -mb-2 mt-1 w-[78%] max-w-[280px] drop-shadow-[0_20px_30px_rgba(110,110,200,0.28)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Headline */}
          <div className="text-center">
            <h1 className="text-[1.6rem] font-extrabold leading-tight tracking-tight text-slate-800 sm:text-[1.9rem]">
              Enter Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                6-Digit Access Code
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">Your secure access to CoreAI</p>
          </div>

          {/* PIN boxes */}
          <motion.div
            className="mt-5 flex items-center justify-center gap-2 sm:gap-2.5"
            animate={error ? { x: [0, -10, 9, -6, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
          >
            {Array.from({ length: LENGTH }).map((_, i) => {
              const active = digits.length === i;
              const has = i < digits.length;
              return (
                <div
                  key={i}
                  className={[
                    "flex h-12 w-11 items-center justify-center rounded-2xl border bg-white/80 backdrop-blur-sm transition-all duration-200 sm:h-14 sm:w-12",
                    error
                      ? "border-rose-300/80 shadow-[0_0_0_3px_rgba(244,114,182,0.18)]"
                      : active
                      ? "border-cyan-400 shadow-[0_0_0_4px_rgba(56,189,248,0.18)]"
                      : "border-white shadow-[0_8px_18px_-10px_rgba(80,90,180,0.6)]",
                  ].join(" ")}
                >
                  {has && (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="h-2.5 w-2.5 rounded-full bg-slate-600"
                    />
                  )}
                </div>
              );
            })}
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center text-sm font-medium text-rose-500"
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
              "mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[1.4rem] text-base font-semibold text-white transition-all duration-300",
              filled
                ? "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_16px_34px_-14px_rgba(20,184,166,0.9)]"
                : "cursor-not-allowed bg-gradient-to-r from-cyan-500/40 to-emerald-400/40 shadow-none",
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

          {/* Keypad */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
            {keys.map((k, i) =>
              k === "" ? (
                <div key={i} />
              ) : (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => (k === "del" ? pop() : push(k))}
                  className="flex h-12 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-xl font-semibold text-slate-700 shadow-[0_10px_20px_-14px_rgba(80,90,180,0.9)] backdrop-blur-sm transition-colors hover:bg-white sm:h-14"
                  aria-label={k === "del" ? "Delete" : k}
                >
                  {k === "del" ? <Delete className="h-5 w-5 text-slate-500" /> : k}
                </motion.button>
              )
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Access is never persisted — the code must be entered on every visit.
export const hasAccessGranted = () => false;
