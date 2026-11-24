import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TypingWaveformProps {
  show: boolean;
}

export const TypingWaveform = memo(({ show }: TypingWaveformProps) => {
  if (!show) return null;

  const reduceMotion = useReducedMotion();

  // 3 circles configuration (Equilateral triangle)
  const size = 28; // Total width/height of the indicator
  const circleRadius = 4.2; // Radius of each dot
  const spreadDistance = 8.5; // Normal resting distance from center
  const contractedDistance = 3.8; // Inward collapsed distance when breathing in

  // Angles for the 3 dots (0°, 120°, 240° relative to vertical top)
  const dotAngles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];

  return (
    <motion.div 
      className="mb-6 flex items-center gap-3 will-change-transform max-w-2xl px-1 py-1"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      aria-live="polite"
      aria-label="CoreAI is thinking"
    >
      {/* Claude-Style 3-Circle Breathing Animation Container */}
      <motion.div
        className="relative flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-muted/30 border border-border/40"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {dotAngles.map((angle, index) => {
            const centerX = size / 2;
            const centerY = size / 2;

            // Expanded coordinates
            const xExpanded = centerX + Math.cos(angle) * spreadDistance;
            const yExpanded = centerY + Math.sin(angle) * spreadDistance;

            // Contracted coordinates (when circles touch at center)
            const xContracted = centerX + Math.cos(angle) * contractedDistance;
            const yContracted = centerY + Math.sin(angle) * contractedDistance;

            return (
              <motion.circle
                key={index}
                r={circleRadius}
                className="fill-foreground/90 dark:fill-white"
                initial={{ cx: xExpanded, cy: yExpanded }}
                animate={reduceMotion ? undefined : {
                  cx: [xExpanded, xContracted, xExpanded],
                  cy: [yExpanded, yContracted, yExpanded],
                  scale: [1, 1.08, 1],
                  opacity: [0.85, 1, 0.85]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1], // Smooth sine-like easeInOut
                }}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Thinking Text Label */}
      <div className="flex items-center gap-1.5 pt-0.5">
        <span className="text-xs font-medium text-muted-foreground/90 tracking-wide animate-pulse">
          CoreAI is thinking...
        </span>
      </div>
    </motion.div>
  );
});

TypingWaveform.displayName = 'TypingWaveform';
