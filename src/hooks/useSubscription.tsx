import { useState, useEffect } from 'react';

export const useSubscription = () => {
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('coreai_premium_status') === 'active';
  });
  const [isLoading, setIsLoading] = useState(false);

  const activatePremium = () => {
    setIsPremium(true);
    localStorage.setItem('coreai_premium_status', 'active');
  };

  const deactivatePremium = () => {
    setIsPremium(false);
    localStorage.removeItem('coreai_premium_status');
  };

  return {
    isPremium,
    isLoading,
    activatePremium,
    deactivatePremium,
  };
};
