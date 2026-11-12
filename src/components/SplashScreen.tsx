import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [showFinalLogo, setShowFinalLogo] = useState(false);

  useEffect(() => {
    // Exactly 2.5s tak sirf structure, 2.5s par final logo reveal
    const logoTimer = setTimeout(() => {
      setShowFinalLogo(true);
    }, 2500);

    // 3.0s total animation + 0.3s fade-out handover to CoreAI
    const exitTimer = setTimeout(() => {
      onComplete?.();
    }, 3300);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(exitTimer);
    };
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
        {/* 0.0s – 2.5s: Pure Minimalist Structure (No black background, no image) */}
        {!showFinalLogo && !shouldReduceMotion && (
          <motion.div
            key="structure"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.3, ease: 'easeInOut' }}
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
                  transition={{ duration: 1.9, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(60 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.9, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(120 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.9, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(180 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.9, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(240 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.9, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M50 18 C64 18 72 26 72 38 C72 50 58 58 50 50"
                  transform="rotate(300 50 50)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.9, ease: 'easeInOut' }}
                />
              </g>
            </svg>
          </motion.div>
        )}

        {/* 2.5s – 3.0s: Final Crisp CoreAI Logo (End ke 0.50s mein smoothly appear hota hai) */}
        {(showFinalLogo || shouldReduceMotion) && (
          <motion.div
            key="final-logo"
            className="relative flex items-center justify-center w-full h-full"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <img
              src={coreaiLogo}
              alt="CoreAI"
              className="w-full h-full rounded-2xl sm:rounded-3xl object-contain will-change-transform"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SplashScreen;
