import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, RefreshCw, XCircle, Settings2, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { track } from "@/lib/analytics";
import premiumLogo from "@/assets/coreai-premium-logo.png";

interface ManageSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeClick?: () => void;
}

export const ManageSubscriptionDialog = ({
  open,
  onOpenChange,
  onUpgradeClick,
}: ManageSubscriptionDialogProps) => {
  const { isPremium, activatePremium, deactivatePremium } = useSubscription();
  const [confirming, setConfirming] = useState(false);

  const activatedAt = (() => {
    try {
      const raw = localStorage.getItem("coreai_premium_activated_at");
      if (!raw) return null;
      return new Date(Number(raw)).toLocaleDateString();
    } catch { return null; }
  })();

  const plan = (() => {
    try {
      const raw = localStorage.getItem("coreai_selected_plan");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const handleManage = () => {
    track("premium_subscription_managed", { plan: plan?.id });
    toast.success("Subscription details refreshed.");
  };

  const handleCancel = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    deactivatePremium();
    track("premium_subscription_cancelled", { plan: plan?.id });
    try { localStorage.removeItem("coreai_selected_plan"); } catch {}
    toast.success("Subscription cancelled. Premium access removed.");
    setConfirming(false);
    onOpenChange(false);
  };

  const handleRestore = () => {
    // Simulated restore — re-activate premium if a plan is remembered
    if (plan) {
      activatePremium();
      track("premium_purchase_restored", { plan: plan?.id, source: "local" });
      toast.success("Purchase restored — Premium re-activated 👑");
      onOpenChange(false);
    } else {
      track("premium_purchase_restored", { restored: false });
      toast.info("No previous purchase found on this device.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md p-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img
              src={premiumLogo}
              alt="Premium"
              className="w-12 h-12 drop-shadow-[0_0_18px_rgba(234,179,8,0.5)]"
            />
            <div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-purple-500 bg-clip-text text-transparent">
                Manage Subscription
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPremium
                  ? `${plan?.name || "Premium"} · Active${activatedAt ? ` since ${activatedAt}` : ""}`
                  : "You're on the Free plan"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2.5 mt-4">
          {isPremium ? (
            <>
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4" />
                Premium access is active
              </div>

              <Button
                variant="outline"
                className="w-full justify-start h-11"
                onClick={handleManage}
              >
                <Settings2 className="w-4 h-4 mr-2 text-primary" />
                Manage Subscription
                <span className="ml-auto text-xs text-muted-foreground">Details</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-11"
                onClick={handleRestore}
              >
                <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />
                Restore Purchase
              </Button>

              <Button
                variant="outline"
                className={`w-full justify-start h-11 ${confirming ? "border-destructive text-destructive" : ""}`}
                onClick={handleCancel}
              >
                <XCircle className="w-4 h-4 mr-2 text-destructive" />
                {confirming ? "Tap again to confirm cancel" : "Cancel Subscription"}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Upgrade to CoreAI Premium for unlimited chats, advanced models, and priority speed.
              </p>
              <Button
                className="w-full h-11 gradient-bg text-white"
                onClick={() => { onOpenChange(false); onUpgradeClick?.(); }}
              >
                <Sparkles className="w-4 h-4 mr-1.5" /> Upgrade to Premium
              </Button>
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={handleRestore}
              >
                <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />
                Restore Purchase
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
