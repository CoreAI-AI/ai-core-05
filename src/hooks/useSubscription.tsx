import { useState } from 'react';
import { getPlanLimits, type PlanId } from '@/config/planLimits';

// Bump this to invalidate ALL previously granted premium sessions.
const PREMIUM_VERSION = 'v2';
const STATUS_KEY = 'coreai_premium_status';
const VERSION_KEY = 'coreai_premium_version';
const PLAN_KEY = 'coreai_premium_plan';

const readPlan = (): PlanId => {
  try {
    const status = localStorage.getItem(STATUS_KEY);
    const version = localStorage.getItem(VERSION_KEY);
    if (status === 'active' && version === PREMIUM_VERSION) {
      const p = localStorage.getItem(PLAN_KEY) as PlanId | null;
      if (p === 'premium_monthly' || p === 'premium_quarterly' || p === 'premium_yearly') {
        return p;
      }
      // legacy activation without stored plan → treat as yearly (backwards compat)
      return 'premium_yearly';
    }
    if (status === 'active' && version !== PREMIUM_VERSION) {
      localStorage.removeItem(STATUS_KEY);
      localStorage.removeItem(VERSION_KEY);
      localStorage.removeItem(PLAN_KEY);
    }
    return 'free';
  } catch {
    return 'free';
  }
};

export const useSubscription = () => {
  const [planId, setPlanId] = useState<PlanId>(readPlan);
  const [isLoading] = useState(false);

  const isPremium = planId !== 'free';
  const limits = getPlanLimits(planId);

  const activatePremium = (plan: PlanId = 'premium_yearly') => {
    setPlanId(plan);
    localStorage.setItem(STATUS_KEY, 'active');
    localStorage.setItem(VERSION_KEY, PREMIUM_VERSION);
    localStorage.setItem(PLAN_KEY, plan);
    localStorage.setItem('coreai_premium_activated_at', String(Date.now()));
  };

  const deactivatePremium = () => {
    setPlanId('free');
    localStorage.removeItem(STATUS_KEY);
    localStorage.removeItem(VERSION_KEY);
    localStorage.removeItem(PLAN_KEY);
    localStorage.removeItem('coreai_premium_activated_at');
  };

  return {
    isPremium,
    isLoading,
    planId,
    limits,
    activatePremium,
    deactivatePremium,
  };
};
