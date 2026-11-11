import { useEffect } from 'react';
import { motion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    // Exactly 3 seconds baad CoreAI chat open karne ki guarantee
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.45, delay: 2.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle ChatGPT-style Center Radial Glow */}
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.4, 0.25], 
          scale: [0.8, 1.1, 1] 
        }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Center Logo with Breathing Micro-interaction */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Soft Breathing Halo Aura */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl bg-primary/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.9, 1.2, 1],
            opacity: [0.2, 0.45, 0.25],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Iconic CoreAI Logo */}
        <motion.img
          src={coreaiLogo}
          alt="CoreAI"
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl shadow-xl will-change-transform object-contain"
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{
            scale: [0.75, 1.02, 1, 1.03, 1],
            opacity: [0, 1, 1, 1, 1],
          }}
          transition={{
            duration: 2.5,
            times: [0, 0.25, 0.5, 0.8, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
