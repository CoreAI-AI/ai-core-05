import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('pwa_banner_dismissed') === 'true';
  });

  useEffect(() => {
    if (dismissed) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Also show banner on iOS (no beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setShowBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!showBanner || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Download className="w-4 h-4 shrink-0" />
          <p className="text-sm font-medium truncate">
            Install CoreAI App for best experience
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {deferredPrompt ? (
            <Button
              size="sm"
              variant="secondary"
              className="h-7 text-xs font-semibold"
              onClick={handleInstall}
            >
              Install
            </Button>
          ) : (
            <span className="text-xs opacity-80">Share → Add to Home Screen</span>
          )}
          <button onClick={handleDismiss} className="p-1 hover:bg-primary-foreground/10 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
