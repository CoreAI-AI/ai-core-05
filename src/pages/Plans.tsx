import { useState } from "react";
import { Crown, CheckCircle2, Gift } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PricingPlans, Plan, PlanId } from "@/components/PricingPlans";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

const getSavedPlan = (): PlanId => {
  try {
    const saved = localStorage.getItem("coreai_selected_plan");
    const id = saved ? JSON.parse(saved)?.id : null;
    return ["monthly", "quarterly", "yearly"].includes(id) ? id : "free";
  } catch {
    return "free";
  }
};

const Plans = () => {
  const { isPremium, activatePremium } = useSubscription();
  const [showRedeem, setShowRedeem] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanId>(() => isPremium ? getSavedPlan() : "free");

  const handleSelect = (plan: Plan) => {
    if (plan.id === "free") return;
    localStorage.setItem("coreai_selected_plan", JSON.stringify({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      cadence: plan.cadence,
    }));
    setCurrentPlan(plan.id);
    setShowRedeem(true);
  };

  return (
    <PageShell
      title="Premium Plans"
      description="Compare CoreAI Free, Monthly, Quarterly, and Yearly plans. Premium activation is currently available by redeem code."
    >
      <section className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Crown className="h-7 w-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">CoreAI Plans</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          Compare every plan anytime. Online payments are not available yet; Premium can currently be activated only with a valid redeem code.
        </p>
      </section>

      {isPremium && (
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">You already have the {currentPlan === "free" ? "Premium" : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan.</p>
            <p className="text-sm text-muted-foreground">Unlimited chats, Premium models, image generation, deep research, code tools, and priority responses are unlocked.</p>
          </div>
        </div>
      )}

      <PricingPlans onSelect={handleSelect} currentPlan={isPremium ? currentPlan : "free"} />

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Gift className="h-4 w-4 text-primary" />
        Redeem-code activation only. UPI and card payments are coming later.
      </div>

      <PaymentMethodSelector
        open={showRedeem}
        onOpenChange={setShowRedeem}
        onPaymentComplete={() => {
          activatePremium();
          toast.success("CoreAI Premium is now active.");
        }}
      />
    </PageShell>
  );
};

export default Plans;