import { useState, useCallback } from 'react';

const LIMITED_MODES = ['deep-search', 'code', 'photo'] as const;
type LimitedMode = typeof LIMITED_MODES[number];

const DAILY_LIMIT = 10;

interface DailyUsage {
  date: string;
  counts: Record<string, number>;
}

const getStorageKey = (userId: string) => `coreai_daily_usage_${userId}`;

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const loadUsage = (userId: string): DailyUsage => {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as DailyUsage;
      if (parsed.date === getTodayStr()) return parsed;
    }
  } catch {}
  return { date: getTodayStr(), counts: {} };
};

const saveUsage = (userId: string, usage: DailyUsage) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(usage));
};

export const useDailyLimit = (userId: string | undefined, isPremium: boolean) => {
  const [usage, setUsage] = useState<DailyUsage>(() =>
    userId ? loadUsage(userId) : { date: getTodayStr(), counts: {} }
  );

  const getRemaining = useCallback((mode: string): number => {
    if (isPremium) return Infinity;
    if (!(LIMITED_MODES as readonly string[]).includes(mode)) return Infinity;
    const count = usage.counts[mode] || 0;
    return Math.max(0, DAILY_LIMIT - count);
  }, [usage, isPremium]);

  const canUse = useCallback((mode: string): boolean => {
    return getRemaining(mode) > 0;
  }, [getRemaining]);

  const recordUsage = useCallback((mode: string) => {
    if (!userId) return;
    if (isPremium) return;
    if (!(LIMITED_MODES as readonly string[]).includes(mode)) return;

    const current = loadUsage(userId);
    current.counts[mode] = (current.counts[mode] || 0) + 1;
    saveUsage(userId, current);
    setUsage({ ...current });
  }, [userId, isPremium]);

  const isLimitedMode = useCallback((mode: string): boolean => {
    return (LIMITED_MODES as readonly string[]).includes(mode);
  }, []);

  return { canUse, recordUsage, getRemaining, isLimitedMode, DAILY_LIMIT };
};
