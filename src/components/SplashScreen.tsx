import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CoreAILogo } from './CoreAILogo';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showBrand, setShowBrand] = useState(false);

  useEffect(() => {
    // 1.8s par logo lock hokar CoreAI text show hoga
    const brandTimer = setTimeout(() => setShowBrand(true), 1800);
    // 3.0s par complete hokar chat screen khulegi
    const exitTimer = setTimeout(() => onComplete?.(), 3000);

    return () => {
      clearTimeout(brandTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden select-none pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.35, delay: 2.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated Drawing Vector Logo (Exactly like GPT_AI.mp4) */}
        <motion.div
          className="relative w-20 h-20 text-foreground"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <CoreAILogo className="w-full h-full text-foreground" />
        </motion.div>

        {/* Brand Name 'CoreAI' (ChatGPT ke jagah) */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: showBrand ? 1 : 0, y: showBrand ? 0 : 6 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-xl font-medium tracking-tight text-foreground"
        >
          CoreAI
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
