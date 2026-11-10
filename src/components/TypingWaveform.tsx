import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';
import { Shimmer } from '@/components/ai-elements/shimmer';

interface TypingWaveformProps {
  show: boolean;
}

export const TypingWaveform = memo(({ show }: TypingWaveformProps) => {
  if (!show) return null;

  const reduceMotion = useReducedMotion();
  const bars = [12, 20, 28, 18, 24];
  
  return (
    <motion.div 
      className="mb-6 flex items-start gap-3 will-change-transform"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      aria-label="CoreAI is thinking"
    >
      <div className="relative mt-0.5 h-9 w-9 shrink-0">
        <motion.span
          className="absolute inset-0 rounded-full border border-primary/35 border-r-primary border-t-transparent will-change-transform"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
        <img 
          src={coreaiLogo} 
          alt="CoreAI" 
          className="absolute inset-1 h-7 w-7 rounded-full object-cover shadow-sm" 
        />
      </div>
      
      <div className="flex min-h-10 flex-col justify-center gap-1.5 pt-0.5">
        <Shimmer
          as="span"
          duration={1.5}
          spread={1.35}
          className="text-sm font-medium"
        >
          CoreAI is thinking
        </Shimmer>

        <div className="flex h-3 items-center gap-1" aria-hidden="true">
          {bars.map((height, index) => (
            <motion.div
              key={height}
              className="h-1 w-1 rounded-full bg-primary will-change-transform"
              animate={reduceMotion ? undefined : {
                width: [4, Math.max(8, height - 4), 4],
                opacity: [0.35, 1, 0.35],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

TypingWaveform.displayName = 'TypingWaveform';
