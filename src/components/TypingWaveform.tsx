import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';
import { Sparkles } from 'lucide-react';

interface TypingWaveformProps {
  show: boolean;
}

export const TypingWaveform = memo(({ show }: TypingWaveformProps) => {
  if (!show) return null;

  const reduceMotion = useReducedMotion();
  
  return (
    <motion.div 
      className="mb-6 flex items-start gap-3 will-change-transform max-w-2xl"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-live="polite"
      aria-label="CoreAI is thinking"
    >
      {/* Gemini-Style Iridescent Avatar Ring */}
      <div className="relative mt-0.5 h-8 w-8 shrink-0 flex items-center justify-center">
        {/* Animated Gemini Aura Glow */}
        <motion.div
          className="absolute -inset-1 rounded-full opacity-70 blur-[6px] pointer-events-none bg-gradient-to-tr from-blue-500 via-indigo-500 via-purple-500 to-cyan-400"
          animate={reduceMotion ? undefined : {
            scale: [0.95, 1.15, 0.95],
            opacity: [0.45, 0.75, 0.45],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />

        {/* Orbiting Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-transparent border-t-cyan-400 border-r-indigo-400 border-b-purple-400 pointer-events-none"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />

        {/* CoreAI Avatar */}
        <img 
          src={coreaiLogo} 
          alt="CoreAI" 
          className="relative h-6 w-6 rounded-full object-cover shadow-sm ring-1 ring-border/50" 
        />
      </div>
      
      {/* Gemini Thinking Content */}
      <div className="flex flex-col gap-2 pt-0.5 flex-1 min-w-0">
        {/* Shimmer Label with Sparkle */}
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={reduceMotion ? undefined : { rotate: [0, 15, -15, 0], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          </motion.div>
          <span className="text-xs font-medium bg-gradient-to-r from-blue-400 via-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-pulse tracking-wide">
            CoreAI is thinking...
          </span>
        </div>

        {/* Gemini Signature Fluid Light Wave Beam */}
        <div className="relative h-1.5 w-48 sm:w-64 rounded-full bg-muted/40 overflow-hidden border border-border/40">
          <motion.div
            className="absolute inset-y-0 w-2/5 rounded-full bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 via-purple-500 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.5)]"
            animate={reduceMotion ? undefined : {
              x: ['-100%', '280%'],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
});

TypingWaveform.displayName = 'TypingWaveform';
