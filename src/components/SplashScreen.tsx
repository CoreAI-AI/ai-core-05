import { motion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <motion.img 
          src={coreaiLogo}
          alt="CoreAI Logo"
          className="w-16 h-16 rounded-2xl shadow-lg"
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        
        {/* Brand name */}
        <motion.h1
          className="text-2xl font-semibold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          CoreAI
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};
