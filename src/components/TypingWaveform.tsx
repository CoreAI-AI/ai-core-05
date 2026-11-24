import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface TypingWaveformProps {
  show: boolean;
}

export const TypingWaveform = memo(({ show }: TypingWaveformProps) => {
  if (!show) return null;

  const reduceMotion = useReducedMotion();

  // 3 dots configuration (Equilateral triangle)
  const size = 26;
  const circleRadius = 3.8;
  const spreadDistance = 7.5;
  const contractedDistance = 3.2;
  const dotAngles = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];

  // CoreAI Logo Green/Teal Palette
  const dotColors = ['#67e8f9', '#2dd4bf', '#86efac']; // Cyan, Teal, Mint Green

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
      {/* CoreAI Avatar with Soft Emerald Glow */}
      <div className="relative h-7 w-7 shrink-0 flex items-center justify-center">
        <motion.div
          className="absolute -inset-1 rounded-full opacity-60 blur-[6px] pointer-events-none bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400"
          animate={reduceMotion ? undefined : {
            scale: [0.95, 1.15, 0.95],
            opacity: [0.4, 0.75, 0.4]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <img 
          src={coreaiLogo} 
          alt="CoreAI" 
          className="relative h-7 w-7 rounded-full object-cover ring-1 ring-emerald-500/40 shadow-sm" 
        />
      </div>

      {/* Claude-Style 3-Circle Inward Breathing Animation (CoreAI Green Theme) */}
      <motion.div
        className="relative flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-500/25 backdrop-blur-xs shadow-[0_0_12px_rgba(45,212,191,0.15)]"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {dotAngles.map((angle, index) => {
            const centerX = size / 2;
            const centerY = size / 2;

            const xExpanded = centerX + Math.cos(angle) * spreadDistance;
            const yExpanded = centerY + Math.sin(angle) * spreadDistance;

            const xContracted = centerX + Math.cos(angle) * contractedDistance;
            const yContracted = centerY + Math.sin(angle) * contractedDistance;

            return (
              <motion.circle
                key={index}
                r={circleRadius}
                fill={dotColors[index]}
                initial={{ cx: xExpanded, cy: yExpanded }}
                animate={reduceMotion ? undefined : {
                  cx: [xExpanded, xContracted, xExpanded],
                  cy: [yExpanded, yContracted, yExpanded],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Thinking Text Label with Green Shimmer */}
      <span className="text-xs font-medium bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-300 bg-clip-text text-transparent animate-pulse tracking-wide">
        CoreAI is thinking...
      </span>
    </motion.div>
  );
});

TypingWaveform.displayName = 'TypingWaveform';
