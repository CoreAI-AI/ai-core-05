import { motion } from "framer-motion";
import coreaiLogo from "@/assets/coreai-logo.png";

interface QuickActionCardsProps {
  onAction: (prompt: string) => void;
  onSkip?: () => void;
}

/**
 * CoreAI welcome canvas.
 * Visual-only redesign: all available modes and tools remain in the existing
 * ChatInput / ChatSidebar components and are intentionally not duplicated here.
 */
export const QuickActionCards = ({ onAction }: QuickActionCardsProps) => {
  return (
    <section className="coreai-welcome relative mx-auto flex min-h-[min(66vh,680px)] w-full max-w-6xl flex-col items-center justify-center overflow-hidden px-4 py-8 text-center sm:px-8">
      <style>{`
        .coreai-welcome { isolation: isolate; }
        .coreai-welcome::before {
          content: "";
          position: absolute;
          z-index: -1;
          width: min(78vw, 760px);
          height: 360px;
          top: 2%;
          left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(0, 197, 219, .13), rgba(0, 92, 210, .08) 38%, transparent 72%);
          filter: blur(24px);
          pointer-events: none;
        }
        .coreai-welcome-logo {
          filter: drop-shadow(0 0 16px rgba(0, 226, 224, .34)) drop-shadow(0 0 42px rgba(0, 127, 255, .18));
        }
        .coreai-welcome-kicker {
          letter-spacing: .52em;
          text-indent: .52em;
        }
        .coreai-welcome-title {
          text-shadow: 0 4px 28px rgba(0,0,0,.25);
        }
        @media (max-width: 640px) {
          .coreai-welcome-kicker { letter-spacing: .28em; text-indent: .28em; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: .88, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8 flex h-36 w-36 items-center justify-center sm:mb-9 sm:h-48 sm:w-48"
      >
        <div className="absolute inset-0 rounded-full border-2 border-cyan-300/90 bg-cyan-400/[0.035] shadow-[0_0_22px_rgba(0,229,230,.25),0_0_70px_rgba(0,158,255,.16),inset_0_0_24px_rgba(0,220,230,.10)]" />
        <div className="absolute -inset-5 rounded-full bg-cyan-400/10 blur-2xl" />
        <img
          src={coreaiLogo}
          alt="CoreAI"
          className="coreai-welcome-logo relative z-10 h-[76%] w-[76%] object-contain"
        />
        <div className="absolute -bottom-3 left-1/2 h-3 w-[145%] -translate-x-1/2 rounded-full bg-cyan-400/60 blur-xl" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .12, duration: .5 }}
        className="coreai-welcome-kicker mb-3 text-sm font-semibold uppercase text-slate-100/90 sm:text-xl"
      >
        Welcome Back
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .22, duration: .55 }}
        className="coreai-welcome-title max-w-5xl text-balance text-3xl font-semibold leading-tight tracking-[-.045em] text-white sm:text-4xl md:text-5xl"
      >
        Bring your ideas to{" "}
        <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
          life today
        </span>
      </motion.h1>

      <motion.button
        type="button"
        onClick={() => onAction("Hello CoreAI!")}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .42, duration: .45 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: .985 }}
        className="mt-7 rounded-full border border-cyan-300/20 bg-cyan-400/[0.055] px-5 py-2 text-xs font-medium text-cyan-100/65 opacity-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        aria-label="Start a conversation"
      >
        Start a conversation
      </motion.button>
    </section>
  );
};
