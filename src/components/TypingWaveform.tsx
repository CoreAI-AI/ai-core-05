import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CoreAILogo } from './CoreAILogo';

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
      aria-label="CoreAI is thinking"
    >
      <motion.div
        className="w-5 h-5 text-foreground shrink-0"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <CoreAILogo className="w-full h-full text-foreground" />
      </motion.div>
      <span className="text-xs text-muted-foreground">
        CoreAI is thinking...
      </span>
    </motion.div>
  );
});

TypingWaveform.displayName = 'TypingWaveform';
