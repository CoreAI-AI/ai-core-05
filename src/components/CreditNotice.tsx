import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

interface CreditNoticeProps {
  /** Delay before showing (ms) — after interface is ready */
  delay?: number;
  /** How long to stay visible before auto-dismiss (ms) */
  duration?: number;
}

export const CreditNotice = ({ delay = 600, duration = 6500 }: CreditNoticeProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay);
    const hideTimer = setTimeout(() => setVisible(false), delay + duration);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [delay, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] px-3 w-[min(94vw,420px)]"
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-background/85 backdrop-blur-xl shadow-2xl shadow-primary/20">
            {/* Animated gradient sheen */}
            <motion.div
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "linear-gradient(120deg, transparent 30%, hsl(var(--primary) / 0.18) 50%, transparent 70%)",
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative flex items-center gap-3 px-3.5 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] sm:text-sm font-semibold leading-tight">
                  Built by{" "}
                  <span className="gradient-text font-bold">Prem Prasad</span>
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground tracking-wide leading-tight mt-0.5">
                  <span className="text-primary/90 font-medium">3 Brothers</span>
                  {" · "}Dipak{" • "}
                  <span className="text-foreground font-medium">Prem</span>
                  {" • "}Manish Prasad
                </p>
              </div>

              <button
                onClick={() => setVisible(false)}
                className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-primary/70 to-primary/40"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
