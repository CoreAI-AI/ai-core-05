import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Moon, Sparkles } from 'lucide-react';
import { DAILY_CHAT_LIMIT } from '@/hooks/useUsageLimits';

interface UnlockPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: 'daily' | 'mode';
  modeLabel?: string;
  onUnlock?: () => void;
  onUpgrade: () => void;
}

export const UnlockPopup = ({ open, onOpenChange, onUpgrade }: UnlockPopupProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-primary" />
          Aaj ka free quota poora ho gaya
        </DialogTitle>
        <DialogDescription>
          You've used all {DAILY_CHAT_LIMIT} free chats for today. Your chats reset tomorrow — see you then! 😊
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 pt-2">
        <Button onClick={() => onOpenChange(false)} className="w-full h-11">
          Okay, see you tomorrow
        </Button>
        <Button onClick={onUpgrade} variant="ghost" className="w-full h-10 gap-2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          Have a redeem code?
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
