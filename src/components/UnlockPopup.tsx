import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, PlayCircle, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { AD_BONUS, MONETAG_DIRECT_LINK } from '@/hooks/useUsageLimits';

interface UnlockPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: 'daily' | 'mode';
  modeLabel?: string;
  onUnlock: () => void;       // called after ad watched -> bonus granted
  onUpgrade: () => void;      // open subscription popup
}

const WAIT_SECONDS = 10;

export const UnlockPopup = ({ open, onOpenChange, reason, modeLabel, onUnlock, onUpgrade }: UnlockPopupProps) => {
  const [watching, setWatching] = useState(false);
  const [seconds, setSeconds] = useState(WAIT_SECONDS);

  useEffect(() => {
    if (!open) {
      setWatching(false);
      setSeconds(WAIT_SECONDS);
    }
  }, [open]);

  useEffect(() => {
    if (!watching) return;
    if (seconds <= 0) {
      onUnlock();
      toast.success(`+${AD_BONUS} chats unlocked`);
      setWatching(false);
      setSeconds(WAIT_SECONDS);
      onOpenChange(false);
      return;
    }
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [watching, seconds, onUnlock, onOpenChange]);

  const startAd = () => {
    try {
      window.open(MONETAG_DIRECT_LINK, '_blank', 'noopener,noreferrer');
    } catch {}
    setWatching(true);
  };

  const title = reason === 'mode' ? `${modeLabel || 'Mode'} Limit Reached` : 'Daily Limit Reached';
  const desc = reason === 'mode'
    ? `You've used today's free ${modeLabel || 'mode'} quota. Watch a short ad to unlock ${AD_BONUS} more chats or upgrade to Premium.`
    : `Watch a short ad to unlock ${AD_BONUS} more chats or upgrade to Premium for unlimited access.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {watching ? (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center space-y-2">
              <Loader2 className="w-6 h-6 mx-auto animate-spin text-primary" />
              <p className="text-sm font-medium">Unlocking in {seconds}s…</p>
              <p className="text-xs text-muted-foreground">Please keep the ad tab open.</p>
            </div>
          ) : (
            <Button onClick={startAd} className="w-full h-11 gap-2">
              <PlayCircle className="w-4 h-4" />
              Watch Ad to Unlock (+{AD_BONUS} chats)
            </Button>
          )}

          <Button onClick={onUpgrade} variant="outline" className="w-full h-11 gap-2">
            <Sparkles className="w-4 h-4" />
            Upgrade to Premium
          </Button>

          {!watching && (
            <Button onClick={() => onOpenChange(false)} variant="ghost" className="w-full h-10 gap-2 text-muted-foreground">
              <X className="w-4 h-4" />
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
