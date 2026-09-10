import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bell, MessageSquare, Rocket, Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import coreaiLogo from "@/assets/coreai-logo.png";
import heroArt from "@/assets/access-hero-3d.png";
import { joinWaitlist, DuplicateEmailError } from "@/lib/waitlist";

interface TestingFeedbackProps {
  onContinue: () => void;
}

const MAX = 500;

export const TestingFeedback = ({ onContinue }: TestingFeedbackProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const [showNotify, setShowNotify] = useState(false);
  const [email, setEmail] = useState("");
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);

  const sendFeedback = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    const { error } = await supabase.from("app_feedback").insert({ message: text.slice(0, MAX) });
    setSending(false);
    if (error) {
      toast.error("Feedback could not be sent. Please try again.");
      return;
    }
    setSent(true);
    setMessage("");
    toast.success("Thank you! Your feedback has been received.");
  };

  const notifyMe = async () => {
    if (!showNotify) {
      setShowNotify(true);
      return;
    }
    const value = email.trim();
    if (!value || notifying) return;
    setNotifying(true);
    try {
      await joinWaitlist({ email: value });
      setNotified(true);
      toast.success("You're on the list — we'll notify you at launch.");
    } catch (err) {
      if (err instanceof DuplicateEmailError) {
        setNotified(true);
        toast.success("You're already on the list!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setNotifying(false);
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
      <div className="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[560px] rounded-[2.25rem] border border-white/60 bg-white/50 p-5 shadow-[0_30px_80px_-30px_rgba(80,90,180,0.55)] backdrop-blur-2xl sm:p-8 lg:grid lg:max-w-[1120px] lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14 lg:p-12 2xl:max-w-[1340px]"
        >
          <div className="lg:order-1">
          {/* Branding */}
          <div className="flex items-center gap-2.5">
            <img src={coreaiLogo} alt="CoreAI logo" className="h-10 w-10 rounded-full shadow-md lg:h-14 lg:w-14" />
            <span className="text-2xl font-bold tracking-tight text-slate-800 lg:text-4xl">
              Core
              <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </div>

          <motion.img
            src={heroArt}
            alt="CoreAI 3D assistant illustration"
            className="mx-auto mt-1 w-[62%] max-w-[240px] drop-shadow-[0_20px_30px_rgba(110,110,200,0.28)] lg:mt-6 lg:w-full lg:max-w-[420px] 2xl:max-w-[500px]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="text-center lg:mt-4 lg:text-left">
            <h1 className="text-[1.5rem] font-extrabold leading-tight tracking-tight text-slate-800 sm:text-[1.85rem] lg:text-[2.5rem] 2xl:text-[2.9rem]">
              🚀 CoreAI is Currently
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                in Testing
              </span>
            </h1>
            <p className="mx-auto mt-2 max-w-[420px] text-sm text-slate-500 sm:text-base lg:mx-0 lg:max-w-none lg:text-lg">
              CoreAI is currently being tested. Try all features and help us improve by sharing your
              feedback.
            </p>
          </div>
          </div>

          <div className="lg:order-2">
          {/* Feedback card */}
          <div className="mt-5 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-[0_18px_40px_-28px_rgba(80,90,180,0.7)] lg:mt-0 lg:p-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                <MessageSquare className="h-4.5 w-4.5 text-indigo-500" />
              </span>
              <span className="font-semibold text-slate-800">Your Feedback</span>
            </div>

            <div className="relative mt-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
                placeholder="Write your feedback here..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-white bg-white/85 p-3.5 pb-7 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.18)]"
              />
              <span className="pointer-events-none absolute bottom-3 right-3.5 text-xs text-slate-400">
                {message.length}/{MAX}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={sendFeedback}
              disabled={!message.trim() || sending}
              className={[
                "mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold text-white transition-all duration-300",
                message.trim()
                  ? "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_16px_34px_-16px_rgba(20,184,166,0.9)]"
                  : "cursor-not-allowed bg-gradient-to-r from-cyan-500/40 to-emerald-400/40",
              ].join(" ")}
            >
              {sending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                </>
              ) : sent ? (
                <>
                  <Check className="h-5 w-5" /> Feedback Sent
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" /> Send Feedback
                </>
              )}
            </motion.button>
          </div>

          {/* Notify card */}
          <div className="mt-4 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-[0_18px_40px_-28px_rgba(80,90,180,0.7)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                  <Bell className="h-4.5 w-4.5 text-indigo-500" />
                </span>
                <div>
                  <p className="font-semibold text-slate-800">🔔 Notify Me When CoreAI Launches</p>
                  <p className="text-sm text-slate-500">
                    When CoreAI officially launches for everyone, you'll be among the first to know.
                  </p>
                </div>
              </div>
              {!notified && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={notifyMe}
                  disabled={notifying}
                  className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 px-5 font-semibold text-white shadow-[0_14px_30px_-16px_rgba(20,184,166,0.9)]"
                >
                  {notifying ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <Bell className="h-4.5 w-4.5" />
                  )}
                  Notify Me
                </motion.button>
              )}
            </div>

            {showNotify && !notified && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && notifyMe()}
                placeholder="you@example.com"
                className="mt-3 h-12 w-full rounded-2xl border border-white bg-white/85 px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.18)]"
              />
            )}

            {notified && (
              <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600">
                <Check className="h-4 w-4" /> You're on the launch list.
              </p>
            )}
          </div>

          {/* Coming soon badge */}
          <div className="mt-4 overflow-hidden rounded-3xl bg-[radial-gradient(120%_140%_at_10%_0%,#1e2a6b_0%,#0b1030_60%,#080b22_100%)] p-4 text-white shadow-[0_20px_45px_-25px_rgba(20,25,80,0.9)]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-xs font-bold uppercase italic tracking-wide text-white/80">
                  Ready to beat
                </p>
                <p className="bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-2xl font-extrabold italic tracking-tight text-transparent">
                  CHATGPT
                </p>
                <span className="mt-1 inline-block rounded-full border border-cyan-300/60 px-3 py-0.5 text-[0.7rem] font-semibold tracking-wide text-cyan-200">
                  COMING SOON
                </span>
              </div>
            </div>
          </div>

          {/* Continue */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-slate-900 text-base font-semibold text-white shadow-[0_18px_36px_-18px_rgba(15,23,42,0.9)]"
          >
            <Rocket className="h-5 w-5" /> Continue to CoreAI
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
