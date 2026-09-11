import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Gift, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";

const VALID_REDEEM_CODES = ["PREM-FCEO"];

interface PaymentMethodSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentComplete: () => void;
}

export const PaymentMethodSelector = ({ open, onOpenChange, onPaymentComplete }: PaymentMethodSelectorProps) => {
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemError, setRedeemError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetState = () => {
    setRedeemCode("");
    setRedeemError("");
    setSuccess(false);
  };

  const handleRedeem = () => {
    const code = redeemCode.trim().toUpperCase();
    if (!VALID_REDEEM_CODES.includes(code)) {
      setRedeemError("Invalid redeem code. Please check and try again.");
      return;
    }

    setRedeemError("");
    setSuccess(true);
    track("premium_purchase_successful", { method: "redeem" });
    toast.success("Redeem code applied — Premium unlocked!");
    window.setTimeout(() => {
      onPaymentComplete();
      onOpenChange(false);
      resetState();
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (!nextOpen) resetState();
      onOpenChange(nextOpen);
    }}>
      <DialogContent className="max-w-[94vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{success ? "Premium Unlocked" : "Activate with Redeem Code"}</DialogTitle>
        </DialogHeader>

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <p className="text-lg font-bold">Welcome to CoreAI Premium</p>
            <p className="text-sm text-muted-foreground">All Premium features are now unlocked.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
              <Gift className="mx-auto mb-2 h-9 w-9 text-primary" />
              <p className="font-semibold">Enter your redeem code</p>
              <p className="mt-1 text-xs text-muted-foreground">UPI and card payments are not available yet.</p>
            </div>

            <div className="space-y-2">
              <Input
                aria-label="Redeem code"
                placeholder="PREM-XXXX"
                value={redeemCode}
                onChange={(event) => {
                  setRedeemCode(event.target.value.toUpperCase());
                  setRedeemError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && redeemCode.trim()) handleRedeem();
                }}
                className="h-12 text-center font-mono tracking-widest uppercase"
                maxLength={20}
                autoFocus
              />
              {redeemError && <p className="text-center text-xs text-destructive">{redeemError}</p>}
            </div>

            <Button className="w-full h-11" disabled={!redeemCode.trim()} onClick={handleRedeem}>
              <Gift className="mr-2 h-4 w-4" /> Redeem & Unlock Premium
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Only a valid CoreAI redeem code can activate Premium.
            </p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};