import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // 2.5s structure + 0.5s final logo + 0.3s clean fade handover
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3300);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F17] overflow-hidden select-none pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.35,
        delay: shouldReduceMotion ? 0.6 : 3.0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="relative z-10 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
        {/* 0.0s – 2.5s: Pure Minimalist Geometric Logo Structure */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.9, 1, 1, 0.98],
              rotate: [0, 10, 25, 30],
            }}
            transition={{
              duration: 2.8,
              times: [0, 0.15, 0.88, 1], // 2.5s tak full visible, then 2.5s-2.8s fade out into final logo
              ease: 'easeInOut',
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              fill="none"
            >
              <g stroke="#2dd4bf" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.0, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(60 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.0, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(120 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.0, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(180 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.0, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(240 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.0, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(300 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.0, ease: 'easeInOut' }}
                />
              </g>
            </svg>
          </motion.div>
        )}

        {/* 2.5s – 3.0s: Structure morphs into Final Crisp CoreAI Logo (End ke 0.50s) */}
        <motion.div
          className="relative flex items-center justify-center w-full h-full"
          initial={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.96 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: [0, 0, 1, 1],
                  scale: [0.96, 0.96, 1.0, 1.0],
                }
          }
          transition={{
            duration: 3.0,
            times: [0, 0.83, 0.95, 1], // 0.83 * 3.0s = exactly 2.5s par start hota hai
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <img
            src={coreaiLogo}
            alt="CoreAI"
            className="w-full h-full rounded-2xl sm:rounded-3xl object-contain will-change-transform"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
