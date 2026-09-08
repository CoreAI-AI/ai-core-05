import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, Cake, Sparkles } from "lucide-react";
import coreaiLogo from "@/assets/coreai-logo.png";

export const PROFILE_KEY = "coreai_profile";

export const hasProfile = () => {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return false;
    const p = JSON.parse(raw);
    return Boolean(p?.name && p?.age && p?.gender);
  } catch {
    return false;
  }
};

interface ProfileSetupProps {
  onComplete: () => void;
}

const genders = [
  { id: "male", label: "Male", emoji: "👨" },
  { id: "female", label: "Female", emoji: "👩" },
  { id: "other", label: "Other", emoji: "🌈" },
];

export const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const canNext = step === 0 ? name.trim().length > 1 : step === 1 ? Number(age) > 0 && Number(age) < 120 : !!gender;

  const next = () => {
    if (!canNext) return;
    if (step < 2) return setStep(step + 1);
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ name: name.trim(), age: Number(age), gender, at: Date.now() })
    );
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[290] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background:
          "radial-gradient(120% 90% at 20% 0%, #dfe3ff 0%, transparent 60%), radial-gradient(100% 80% at 90% 20%, #d6f3ff 0%, transparent 55%), radial-gradient(120% 100% at 50% 110%, #e6e2ff 0%, transparent 60%), #eef1fd",
      }}
    >
      <motion.div
        className="pointer-events-none absolute left-[-3rem] top-1/4 h-24 w-24 rounded-full blur-[2px]"
        style={{ background: "linear-gradient(135deg,#8b8cf9,#6f7bf7)", opacity: 0.6 }}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-[-2rem] top-[30%] h-20 w-20 rounded-full blur-[2px]"
        style={{ background: "linear-gradient(135deg,#5ee7a8,#37d3c0)", opacity: 0.55 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] rounded-[2.25rem] border border-white/60 bg-white/45 p-6 shadow-[0_30px_80px_-30px_rgba(80,90,180,0.55)] backdrop-blur-2xl sm:p-8"
        >
          <div className="flex flex-col items-center text-center">
            <motion.img
              src={coreaiLogo}
              alt="CoreAI logo"
              className="h-16 w-16 rounded-full shadow-[0_16px_30px_-12px_rgba(80,90,180,0.8)]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <h1 className="mt-3 text-[1.55rem] font-extrabold tracking-tight text-slate-800">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                CoreAI
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">Let's personalise your experience</p>
          </div>

          {/* progress */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? "w-8 bg-gradient-to-r from-cyan-500 to-emerald-400" : "w-4 bg-white/80"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
            >
              {step === 0 && (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <User className="h-4 w-4 text-indigo-500" /> What's your name?
                  </label>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                    placeholder="Your name"
                    className="h-14 w-full rounded-2xl border border-white bg-white/85 px-4 text-base text-slate-800 shadow-[0_10px_24px_-16px_rgba(80,90,180,0.9)] outline-none backdrop-blur-sm transition focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.18)]"
                  />
                </div>
              )}

              {step === 1 && (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Cake className="h-4 w-4 text-indigo-500" /> How old are you?
                  </label>
                  <input
                    autoFocus
                    value={age}
                    inputMode="numeric"
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                    placeholder="Age"
                    className="h-14 w-full rounded-2xl border border-white bg-white/85 px-4 text-base text-slate-800 shadow-[0_10px_24px_-16px_rgba(80,90,180,0.9)] outline-none backdrop-blur-sm transition focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.18)]"
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Sparkles className="h-4 w-4 text-indigo-500" /> Choose your gender
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {genders.map((g) => (
                      <motion.button
                        key={g.id}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setGender(g.id)}
                        className={[
                          "flex flex-col items-center gap-1.5 rounded-2xl border bg-white/80 py-4 text-sm font-medium text-slate-700 backdrop-blur-sm transition-all",
                          gender === g.id
                            ? "border-cyan-400 shadow-[0_0_0_4px_rgba(56,189,248,0.18)]"
                            : "border-white shadow-[0_10px_20px_-14px_rgba(80,90,180,0.9)]",
                        ].join(" ")}
                      >
                        <span className="text-2xl">{g.emoji}</span>
                        {g.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={next}
            disabled={!canNext}
            className={[
              "mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-[1.4rem] text-base font-semibold text-white transition-all duration-300",
              canNext
                ? "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_16px_34px_-14px_rgba(20,184,166,0.9)]"
                : "cursor-not-allowed bg-gradient-to-r from-cyan-500/40 to-emerald-400/40",
            ].join(" ")}
          >
            {step === 2 ? "Start CoreAI" : "Continue"} <ArrowRight className="h-5 w-5" />
          </motion.button>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-3 w-full text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Back
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
