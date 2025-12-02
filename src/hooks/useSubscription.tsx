import { useState, useEffect } from 'react';

export const useSubscription = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load subscription status from localStorage
    const savedStatus = localStorage.getItem('coreai_premium_status');
    if (savedStatus === 'active') {
      setIsPremium(true);
    }
    setIsLoading(false);
  }, []);

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
