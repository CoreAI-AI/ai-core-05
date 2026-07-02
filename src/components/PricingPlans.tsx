import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PlanId = "free" | "monthly" | "quarterly" | "yearly";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  perMonth?: string;
  savings?: string;
  icon: typeof Gift;
  features: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
  accent: string; // tailwind gradient utility fragment
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    cadence: "forever",
    tagline: "Get started with the essentials",
    icon: Gift,
    features: [
      "20 chats / day",
      "Basic AI model",
      "Standard responses",
      "Community support",
    ],
    cta: "Current Plan",
    accent: "from-muted/40 to-muted/10",
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "₹249",
    cadence: "/month",
    tagline: "Flexible premium access",
    icon: Sparkles,
    features: [
      "Unlimited chats",
      "All 3 Premium models",
      "Image generation",
      "Priority responses",
    ],
    cta: "Upgrade to Premium",
    accent: "from-primary/20 to-primary/5",
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: "₹599",
    cadence: "/ 3 months",
    perMonth: "≈ ₹199/mo",
    savings: "Save 20%",
    tagline: "Most flexible savings",
    icon: Zap,
    features: [
      "Everything in Monthly",
      "Deep Research mode",
      "Advanced code tools",
      "Faster streaming",
    ],
    cta: "Upgrade to Premium",
    accent: "from-amber-500/20 to-orange-500/5",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "₹1,999",
    cadence: "/year",
    perMonth: "≈ ₹166/mo",
    savings: "Save 33%",
    tagline: "Maximum value, maximum power",
    icon: Crown,
    features: [
      "Everything in Quarterly",
      "Long PDF analysis",
      "Early access to new models",
      "Diamond badge & support",
    ],
    cta: "Upgrade to Premium",
    highlight: true,
    badge: "Best Value",
    accent: "from-primary/30 via-fuchsia-500/20 to-amber-500/20",
  },
];

interface PricingPlansProps {
  onSelect: (plan: Plan) => void;
  currentPlan?: PlanId;
}

export const PricingPlans = ({ onSelect, currentPlan = "free" }: PricingPlansProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {PLANS.map((plan, index) => {
        const Icon = plan.icon;
        const isCurrent = plan.id === currentPlan;
        const isFree = plan.id === "free";

        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -6 }}
            className={cn(
              "relative rounded-2xl border bg-card p-5 lg:p-6 flex flex-col",
              "transition-all duration-300",
              "hover:shadow-xl hover:shadow-primary/10",
              plan.highlight
                ? "border-primary/60 ring-2 ring-primary/40 shadow-lg shadow-primary/20 lg:scale-[1.03]"
                : "border-border hover:border-primary/40"
            )}
          >
            {/* Ambient gradient wash */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br opacity-70",
                plan.accent
              )}
              aria-hidden
            />

            {/* Best Value badge */}
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gradient-to-r from-primary via-fuchsia-500 to-amber-500 text-primary-foreground shadow-md">
                  <Crown className="w-3 h-3" /> {plan.badge}
                </span>
              </div>
            )}

            <div className="relative flex flex-col flex-1">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center",
                    plan.highlight
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-foreground"
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base leading-tight">{plan.name}</h3>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {plan.tagline}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">{plan.cadence}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 min-h-[18px]">
                  {plan.perMonth && (
                    <span className="text-[11px] text-muted-foreground">
                      {plan.perMonth}
                    </span>
                  )}
                  {plan.savings && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500">
                      {plan.savings}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <Check
                      className={cn(
                        "w-3.5 h-3.5 mt-0.5 shrink-0",
                        plan.highlight ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                disabled={isCurrent || isFree}
                onClick={() => onSelect(plan)}
                className={cn(
                  "w-full font-semibold",
                  plan.highlight &&
                    "bg-gradient-to-r from-primary via-fuchsia-500 to-amber-500 hover:opacity-90 text-primary-foreground border-0"
                )}
                variant={plan.highlight ? "default" : isFree ? "outline" : "secondary"}
              >
                {isCurrent ? "Current Plan" : plan.cta}
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
