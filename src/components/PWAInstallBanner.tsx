import { useState, useEffect } from 'react';
import { X, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('pwa_install_dismissed') === 'true';
  });

  useEffect(() => {
    if (dismissed) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show popup after a brief delay for better UX
      setTimeout(() => setShowPopup(true), 1500);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // iOS fallback
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowPopup(true), 1500);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPopup(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
    setDismissed(true);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (!showPopup || dismissed) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <AnimatePresence>
      {showPopup && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[90vw] max-w-sm"
          >
            <div className="relative bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-400 to-primary" />

              {/* Content */}
              <div className="flex flex-col items-center px-6 pt-6 pb-5">
                {/* App icon */}
                <div className="w-20 h-20 rounded-[22px] overflow-hidden shadow-lg mb-4 ring-2 ring-primary/20">
                  <img
                    src="/app-icon-192.png"
                    alt="CoreAI"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* App name & rating */}
                <h2 className="text-xl font-bold text-foreground">CoreAI</h2>
                <div className="flex items-center gap-0.5 mt-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1.5">4.9</span>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-1.5 leading-relaxed">
                  Smart AI assistant — chat, create images, research & more. Install for the best experience.
                </p>

                {/* Install button */}
                {deferredPrompt ? (
                  <Button
                    onClick={handleInstall}
                    className="w-full mt-5 h-12 rounded-xl text-base font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                  >
                    <Download className="w-5 h-5" />
                    Install App
                  </Button>
                ) : isIOS ? (
                  <div className="w-full mt-5 bg-muted rounded-xl p-3 text-center">
                    <p className="text-sm text-foreground font-medium">
                      Tap <span className="inline-block mx-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline text-primary"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      </span> Share → <span className="font-semibold text-primary">Add to Home Screen</span>
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleDismiss}
                    variant="secondary"
                    className="w-full mt-5 h-12 rounded-xl text-base font-medium"
                  >
                    Continue in Browser
                  </Button>
                )}

                {/* Dismiss link */}
                <button
                  onClick={handleDismiss}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
