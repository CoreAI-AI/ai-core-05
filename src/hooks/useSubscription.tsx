import { useState } from 'react';

// Bump this version to force-invalidate ALL previously granted premium sessions.
// Every user with old premium will need to re-subscribe.
const PREMIUM_VERSION = 'v2';
const STATUS_KEY = 'coreai_premium_status';
const VERSION_KEY = 'coreai_premium_version';

const readPremium = (): boolean => {
  try {
    const status = localStorage.getItem(STATUS_KEY);
    const version = localStorage.getItem(VERSION_KEY);
    if (status === 'active' && version === PREMIUM_VERSION) return true;
    // Old-version premium → wipe so user must re-buy
    if (status === 'active' && version !== PREMIUM_VERSION) {
      localStorage.removeItem(STATUS_KEY);
      localStorage.removeItem(VERSION_KEY);
    }
    return false;
  } catch {
    return false;
  }
};

export const useSubscription = () => {
  const [isPremium, setIsPremium] = useState(readPremium);
  const [isLoading] = useState(false);

  const activatePremium = () => {
    setIsPremium(true);
    localStorage.setItem(STATUS_KEY, 'active');
    localStorage.setItem(VERSION_KEY, PREMIUM_VERSION);
    localStorage.setItem('coreai_premium_activated_at', String(Date.now()));
  };

  const deactivatePremium = () => {
    setIsPremium(false);
    localStorage.removeItem(STATUS_KEY);
    localStorage.removeItem(VERSION_KEY);
    localStorage.removeItem('coreai_premium_activated_at');
  };

  return {
    isPremium,
    isLoading,
    activatePremium,
    deactivatePremium,
  };
};
