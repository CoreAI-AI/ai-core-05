import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Diamond, Check, Bot, Brain, Zap } from "lucide-react";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import { PricingPlans, Plan } from "@/components/PricingPlans";

interface SubscriptionPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

const premiumModels = [
  { name: "Chat-Bot", description: "Fast & smart everyday AI", icon: Bot, color: "text-blue-400" },
  { name: "Core-AI", description: "Advanced reasoning & analysis", icon: Brain, color: "text-purple-400" },
  { name: "Chat-Pro", description: "Ultra powerful premium model", icon: Zap, color: "text-amber-400" },
];

export const SubscriptionPopup = ({ open, onOpenChange, onUpgrade }: SubscriptionPopupProps) => {
  const [showPayment, setShowPayment] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === "free") return;
    try {
      localStorage.setItem("coreai_selected_plan", JSON.stringify({
        id: plan.id, name: plan.name, price: plan.price, cadence: plan.cadence,
      }));
    } catch {}
    onOpenChange(false);
    setShowPayment(true);
  };

  return (
    <>
      <Dialog open={open && !showPayment} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-5xl max-h-[92vh] overflow-y-auto p-5 sm:p-7">
          <DialogHeader className="text-center sm:text-left">
            <DialogTitle className="flex items-center justify-center sm:justify-start gap-2 text-2xl sm:text-3xl font-bold">
              <Diamond className="w-6 h-6 text-primary" />
              CoreAI Premium
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Pick a plan that fits how you build. Cancel anytime.
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Premium models strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {premiumModels.map((model, index) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border"
                >
                  <model.icon className={`w-6 h-6 ${model.color}`} />
                  <span className="text-xs font-semibold text-foreground">{model.name}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight hidden sm:block">
                    {model.description}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Pricing grid */}
            <div className="pt-3">
              <PricingPlans onSelect={handleSelectPlan} currentPlan="free" />
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground pt-2 border-t border-border">
              <span className="inline-flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Secure payments</span>
              <span className="inline-flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Instant activation</span>
              <span className="inline-flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Cancel anytime</span>
              <span className="inline-flex items-center gap-1"><Check className="w-3 h-3 text-primary" /> Redeem code supported</span>
            </div>

            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground"
              >
                Maybe later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentMethodSelector
        open={showPayment}
        onOpenChange={setShowPayment}
        onPaymentComplete={() => {
          setShowPayment(false);
          onUpgrade();
        }}
      />
    </>
  );
};

