import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, PartyPopper, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPosition } from "@/lib/waitlist";

interface WaitlistSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: number;
  name?: string;
}

export const WaitlistSuccessModal = ({
  open,
  onOpenChange,
  position,
  name,
}: WaitlistSuccessModalProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://coreaii.vercel.app/waitlist";

  const handleShare = async () => {
    const shareData = {
      title: "CoreAI Waitlist",
      text: `I just joined the CoreAI waitlist at ${formatPosition(position)} — join me!`,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user dismissed — fall through to copy */
      }
    }
    await navigator.clipboard.writeText(`${shareData.text} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="waitlist-scope max-w-md rounded-3xl border-border bg-card p-8 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
        >
          <PartyPopper className="h-8 w-8" aria-hidden="true" />
        </motion.div>

        <DialogTitle className="mt-5 text-2xl font-semibold tracking-tight">
          You&apos;re on the Waitlist!
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Thank you{name ? `, ${name.split(" ")[0]}` : ""} for joining CoreAI early. We&apos;ll
          email you the moment your access opens up.
        </DialogDescription>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-2 rounded-2xl border border-border bg-muted/60 p-5"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Your position
          </p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-primary">
            {formatPosition(position)}
          </p>
        </motion.div>

        <Button onClick={handleShare} className="mt-4 h-11 w-full rounded-xl">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" aria-hidden="true" /> Link copied
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" /> Share with Friends
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mt-1 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Close
        </button>

        <span className="sr-only">
          <Copy aria-hidden="true" />
        </span>
      </DialogContent>
    </Dialog>
  );
};
