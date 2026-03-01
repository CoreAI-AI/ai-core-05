import { ReactNode, useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { FeatureId, PREMIUM_FEATURES } from '@/hooks/useFeatureAccess';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface FeatureLockOverlayProps {
  featureId: FeatureId;
  isUnlocked: boolean;
  children: ReactNode;
}

export const FeatureLockOverlay = ({ featureId, isUnlocked, children }: FeatureLockOverlayProps) => {
  const [showPayment, setShowPayment] = useState(false);
  const feature = PREMIUM_FEATURES[featureId];

  if (isUnlocked) return <>{children}</>;

  return (
    <div className="relative">
      <div className="filter blur-sm pointer-events-none select-none opacity-60">
        {children}
      </div>
      <div
        className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] rounded-xl cursor-pointer"
        onClick={() => setShowPayment(true)}
      >
        <motion.div
          className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/90 border border-border shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-semibold text-foreground">{feature.name}</p>
          <Button size="sm" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Unlock ₹{feature.priceINR}
          </Button>
        </motion.div>
      </div>

      <PaymentPopup
        feature={feature}
        open={showPayment}
        onOpenChange={setShowPayment}
      />
    </div>
  );
};

// Reusable payment popup
interface PaymentPopupProps {
  feature: typeof PREMIUM_FEATURES[FeatureId];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentPopup = ({ feature, open, onOpenChange }: PaymentPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{feature.icon}</span>
            {feature.name}
          </DialogTitle>
          <DialogDescription>{feature.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-3xl font-bold text-primary">₹{feature.priceINR}</p>
            <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
          </div>
          <div className="space-y-2">
            {['PhonePe', 'BharatPe', 'PayPal', 'Card Payment'].map((method) => (
              <Button
                key={method}
                variant="outline"
                className="w-full justify-start h-11"
                onClick={() => {
                  toast.info('Payment integration coming soon! Stripe API key required.');
                  onOpenChange(false);
                }}
              >
                {method}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
