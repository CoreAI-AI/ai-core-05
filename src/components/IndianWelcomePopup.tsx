import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import welcomeImage from '@/assets/welcome-namaste.jpg';

interface IndianWelcomePopupProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
}

export const IndianWelcomePopup = ({ open, onClose, userName }: IndianWelcomePopupProps) => {
  const [showContent, setShowContent] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (open && !hasPlayedRef.current) {
      // Start animations
      setTimeout(() => setShowContent(true), 300);
      setTimeout(() => setParticlesVisible(true), 500);
      
      // Play voice greeting
      setTimeout(() => {
        playWelcomeVoice();
        hasPlayedRef.current = true;
      }, 800);
    }

    if (!open) {
      setShowContent(false);
      setParticlesVisible(false);
      hasPlayedRef.current = false;
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
    }
  }, [open]);

  const playWelcomeVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const greeting = userName 
        ? `नमस्ते ${userName}, आपका स्वागत है CoreAI में।`
        : 'नमस्ते, आपका स्वागत है CoreAI में।';
      
      const utterance = new SpeechSynthesisUtterance(greeting);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      // Find a female Hindi voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => 
        v.lang.includes('hi') && v.name.toLowerCase().includes('female')
      ) || voices.find(v => 
        v.lang.includes('hi')
      ) || voices.find(v => 
        v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')
      );
      
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
      
      audioRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Golden particles for festive effect
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-gradient-to-b from-amber-950 via-orange-950 to-red-950 border-2 border-amber-500/50 rounded-2xl">
        {/* Animated particles */}
        <AnimatePresence>
          {particlesVisible && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: particle.size,
                    height: particle.size,
                    background: 'radial-gradient(circle, #FFD700 0%, #FFA500 50%, transparent 70%)',
                    boxShadow: '0 0 10px #FFD700, 0 0 20px #FFA500',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0.5, 1, 0],
                    scale: [0, 1, 0.8, 1.2, 0],
                    y: [0, -50, -100],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Mandala rotating background */}
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'%23FFD700\' stroke-width=\'0.5\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'30\' fill=\'none\' stroke=\'%23FFD700\' stroke-width=\'0.5\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'20\' fill=\'none\' stroke=\'%23FFD700\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
            backgroundPosition: 'center',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />

        {/* Main content */}
        <div className="relative z-20">
          {/* Hero image with glow */}
          <motion.div
            className="relative h-64 sm:h-80 overflow-hidden"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-transparent to-transparent z-10" />
            <motion.img
              src={welcomeImage}
              alt="Namaste Welcome"
              className="w-full h-full object-cover object-top"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            
            {/* Divine glow effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center top, rgba(255, 215, 0, 0.3) 0%, transparent 60%)',
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Text content */}
          <div className="p-6 text-center space-y-4">
            {/* Namaste greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.h1
                className="text-4xl sm:text-5xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FF8C00 50%, #FFD700 75%, #FFEC8B 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                🙏 नमस्ते 🙏
              </motion.h1>
            </motion.div>

            {/* Welcome message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-2"
            >
              <p className="text-xl sm:text-2xl text-amber-200 font-medium">
                {userName ? `${userName}, ` : ''}आपका स्वागत है
              </p>
              <motion.p
                className="text-2xl sm:text-3xl font-bold text-white"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(255, 215, 0, 0.5)',
                    '0 0 20px rgba(255, 215, 0, 0.8)',
                    '0 0 10px rgba(255, 215, 0, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="gradient-text">CoreAI</span> में
              </motion.p>
            </motion.div>

            {/* Decorative divider */}
            <motion.div
              className="flex items-center justify-center gap-3 py-2"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={showContent ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500" />
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500" />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-amber-300/80 text-sm"
              initial={{ opacity: 0 }}
              animate={showContent ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              आपकी AI सहायक सेवा में हाज़िर है
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Button
                onClick={onClose}
                className="mt-4 px-8 py-3 text-lg font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-orange-500/50"
              >
                <motion.span
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🪔 शुरू करें 🪔
                </motion.span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Diya (lamp) decorations */}
        <motion.div
          className="absolute bottom-4 left-4 text-3xl"
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🪔
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-4 text-3xl"
          animate={{
            opacity: [1, 0.8, 1],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🪔
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
