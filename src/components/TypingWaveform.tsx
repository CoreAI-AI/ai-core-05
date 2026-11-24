import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface TypingWaveformProps {
  show: boolean;
}

export const TypingWaveform = memo(({ show }: TypingWaveformProps) => {
  if (!show) return null;

  const reduceMotion = useReducedMotion();

  return (
    <motion.div 
      className="mb-6 flex items-center gap-2.5 will-change-transform max-w-2xl px-1 py-1"
      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      aria-label="CoreAI is thinking"
    >
      {/* Pure Clean CoreAI Logo with Smooth Spin (No Extra Effects) */}
      <motion.img
        src={coreaiLogo}
        alt="CoreAI"
        className="w-6 h-6 rounded-full object-cover shrink-0 select-none"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Simple Clean Thinking Text */}
      <span className="text-xs font-normal text-muted-foreground select-none">
        CoreAI is thinking...
      </span>
    </motion.div>
  );
});

TypingWaveform.displayName = 'TypingWaveform';
