import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Diamond, Check, Bot, Brain, Zap } from "lucide-react";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";

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

  const benefits = [
    "Access all 3 Premium AI Models",
    "Chat-Pro Ultra Advance Model",
    "Image & Web Prompt Expert",
    "Image Generator Expert",
    "Full A to Z Automation",
    "Unlimited Smart Chat",
    "Priority Response",
    "Premium Diamond Mode Experience"
  ];

  return (
    <>
      <Dialog open={open && !showPayment} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Diamond className="w-6 h-6 text-primary" />
              CoreAI Premium
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Unlock all advanced AI models and premium features instantly.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {premiumModels.map((model, index) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 border border-border"
                >
                  <model.icon className={`w-6 h-6 ${model.color}`} />
                  <span className="text-xs font-semibold text-foreground">{model.name}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{model.description}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="flex items-start gap-2"
                >
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-primary/10 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">₹199/month</p>
              <p className="text-xs text-muted-foreground mt-1">Full access to all premium features</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Not Now
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  setShowPayment(true);
                }}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Upgrade Now
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
