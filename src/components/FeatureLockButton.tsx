import { ReactNode, useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureId, PREMIUM_FEATURES } from '@/hooks/useFeatureAccess';
import { PaymentPopup } from '@/components/FeatureLockOverlay';

interface FeatureLockButtonProps {
  featureId: FeatureId;
  isUnlocked: boolean;
  onClick: () => void;
  children: ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const FeatureLockButton = ({
  featureId,
  isUnlocked,
  onClick,
  children,
  variant = 'default',
  size = 'default',
  className,
}: FeatureLockButtonProps) => {
  const [showPayment, setShowPayment] = useState(false);
  const feature = PREMIUM_FEATURES[featureId];

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => {
          if (isUnlocked) {
            onClick();
          } else {
            setShowPayment(true);
          }
        }}
      >
        {!isUnlocked && <Lock className="w-3.5 h-3.5 mr-1.5" />}
        {children}
      </Button>
      <PaymentPopup
        feature={feature}
        open={showPayment}
        onOpenChange={setShowPayment}
      />
    </>
  );
};
