import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

interface ImageGeneratingOverlayProps {
  isGenerating: boolean;
  prompt?: string;
}

export const ImageGeneratingOverlay = ({ isGenerating, prompt }: ImageGeneratingOverlayProps) => {
  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative flex flex-col items-center gap-6 p-8"
          >
            {/* Blurred placeholder card */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden">
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20"
                animate={{
                  background: [
                    'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.2), hsl(var(--secondary)/0.2))',
                    'linear-gradient(225deg, hsl(var(--secondary)/0.2), hsl(var(--primary)/0.2), hsl(var(--accent)/0.2))',
                    'linear-gradient(315deg, hsl(var(--accent)/0.2), hsl(var(--secondary)/0.2), hsl(var(--primary)/0.2))',
                    'linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--accent)/0.2), hsl(var(--secondary)/0.2))',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Blur overlay with noise texture effect */}
              <div className="absolute inset-0 backdrop-blur-xl bg-muted/30" />
              
              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Center loading indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-12 h-12 text-primary" />
                </motion.div>
              </div>
              
              {/* Corner decorations */}
              <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-primary/40 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-primary/40 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-primary/40 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-primary/40 rounded-br-lg" />
            </div>
            
            {/* Loading text */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-lg font-medium text-foreground">Creating your image...</span>
              </div>
              {prompt && (
                <p className="text-sm text-muted-foreground text-center max-w-xs line-clamp-2">
                  "{prompt}"
                </p>
              )}
            </div>
            
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
