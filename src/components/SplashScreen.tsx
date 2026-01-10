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
      transition={{ duration: 0.5, delay: 1.2 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="flex flex-col items-center gap-5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Premium Logo */}
        <motion.div 
          className="relative"
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 w-20 h-20 rounded-full blur-xl opacity-30 bg-primary" />
          
          {/* Main logo */}
          <img 
            src={coreaiLogo} 
            alt="CoreAI Logo" 
            className="relative w-20 h-20 rounded-full shadow-2xl"
          />
        </motion.div>
        
        {/* Brand name with gradient */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold gradient-text">
            CoreAI
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Intelligent Assistant
          </p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          className="flex gap-1.5 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
          <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
