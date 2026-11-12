import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // 3.0s animation + 0.4s smooth fade handover
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F17] overflow-hidden select-none pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.45,
        delay: shouldReduceMotion ? 0.6 : 3.0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Dynamic Ambient Background Glow Bloom */}
      <motion.div
        className="absolute w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.4) 0%, rgba(20, 184, 166, 0.18) 40%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.3, scale: 1 }
            : {
                opacity: [0, 0.25, 0.4, 0.7, 0.35],
                scale: [0.8, 0.95, 1.0, 1.25, 1.0],
              }
        }
        transition={{
          duration: 3.0,
          times: [0, 0.3, 0.65, 0.76, 1],
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36">
        {/* Phase 1 (0.0s – 2.0s): ChatGPT-style Geometric Logo Structure Assembly */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.85, 1, 1.02, 0.95],
              rotate: [0, 15, 35, 45],
            }}
            transition={{
              duration: 2.05,
              times: [0, 0.25, 0.85, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <svg
              className="w-24 h-24 sm:w-32 sm:h-32"
              viewBox="0 0 100 100"
              fill="none"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(45, 212, 191, 0.9)) drop-shadow(0 0 24px rgba(20, 184, 166, 0.65))',
              }}
            >
              <g stroke="url(#splashTealGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M50 20 C62 20 70 28 70 38 C70 48 58 56 50 50"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 20 C62 20 70 28 70 38 C70 48 58 56 50 50"
                  transform="rotate(60 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 20 C62 20 70 28 70 38 C70 48 58 56 50 50"
                  transform="rotate(120 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 20 C62 20 70 28 70 38 C70 48 58 56 50 50"
                  transform="rotate(180 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 20 C62 20 70 28 70 38 C70 48 58 56 50 50"
                  transform="rotate(240 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 20 C62 20 70 28 70 38 C70 48 58 56 50 50"
                  transform="rotate(300 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              </g>
              <defs>
                <linearGradient id="splashTealGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.5" stopColor="#2dd4bf" />
                  <stop offset="1" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        )}

        {/* Shockwave Pulse Ring (at 1.95s – 2.7s) */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              border: '2px solid rgba(45, 212, 191, 0.75)',
              boxShadow: '0 0 25px rgba(45, 212, 191, 0.6), inset 0 0 15px rgba(45, 212, 191, 0.35)',
            }}
            initial={{ width: 40, height: 40, opacity: 0, scale: 0.6 }}
            animate={{
              width: [40, 170],
              height: [40, 170],
              opacity: [0, 0.85, 0],
              scale: [0.6, 1.45],
            }}
            transition={{
              delay: 1.9,
              duration: 0.75,
              ease: 'easeOut',
            }}
          />
        )}

        {/* Phase 2 (2.0s – 3.0s): CoreAI Full Logo Reveal with Neon Glow Effect */}
        <motion.div
          className="relative z-20 flex items-center justify-center"
          initial={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.75 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: [0, 0, 1, 1],
                  scale: [0.75, 0.75, 1.05, 1.0],
                }
          }
          transition={{
            duration: 3.0,
            times: [0, 0.63, 0.78, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <img
            src={coreaiLogo}
            alt="CoreAI"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl object-contain will-change-transform"
            style={{
              filter: 'drop-shadow(0 0 25px rgba(45, 212, 191, 0.95)) drop-shadow(0 0 60px rgba(20, 184, 166, 0.65))',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
