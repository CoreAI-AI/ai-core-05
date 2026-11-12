import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Exactly 3000ms duration
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F17] overflow-hidden select-none pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.6,
        delay: shouldReduceMotion ? 0.8 : 2.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* 0.0–0.5s: Subtle Dark-Teal Ambient Center Glow */}
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full pointer-events-none blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, rgba(13, 148, 136, 0.08) 45%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.25, scale: 1 }
            : {
                opacity: [0, 0.45, 0.35, 0.4, 0.2],
                scale: [0.85, 1, 1.03, 1, 0.95],
              }
        }
        transition={{
          duration: 2.4,
          times: [0, 0.21, 0.62, 0.8, 1],
          ease: 'easeInOut',
        }}
      />

      {/* Centered Logo Container */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Soft Ambient Halo around Logo */}
        <motion.div
          className="absolute inset-0 rounded-3xl blur-xl pointer-events-none"
          style={{ background: 'rgba(20, 184, 166, 0.22)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            shouldReduceMotion
              ? { opacity: 0.2, scale: 1 }
              : {
                  opacity: [0, 0, 0.35, 0.4, 0.25],
                  scale: [0.85, 0.85, 1, 1.04, 1],
                }
          }
          transition={{
            duration: 2.4,
            times: [0, 0.21, 0.62, 0.8, 1],
            ease: 'easeInOut',
          }}
        />

        {/* 0.5–1.5s Reveal & 1.5–2.4s Settle: Original CoreAI Logo */}
        <motion.img
          src={coreaiLogo}
          alt="CoreAI"
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl shadow-2xl object-contain will-change-transform"
          initial={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.85 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: [0, 0, 1, 1, 1],
                  scale: [0.85, 0.85, 1.0, 1.02, 1.0],
                }
          }
          transition={{
            duration: 2.4,
            times: [0, 0.21, 0.62, 0.8, 1],
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
