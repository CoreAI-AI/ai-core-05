import { useCallback, useEffect, useState } from 'react';

export type LimitMode = 'chat' | 'study' | 'image' | 'code';

export const DAILY_CHAT_LIMIT = 20;
export const PER_MODE_LIMIT = 5;
export const AD_BONUS = 3;
export const MONETAG_DIRECT_LINK = 'https://omg10.com/4/11114867';

interface UsageState {
  lastResetDate: string;
  dailyChatsUsed: number;
  bonusChats: number;
  modeUsage: Record<LimitMode, number>;
}

const today = () => new Date().toISOString().slice(0, 10);

const blank = (): UsageState => ({
  lastResetDate: today(),
  dailyChatsUsed: 0,
  bonusChats: 0,
  modeUsage: { chat: 0, study: 0, image: 0, code: 0 },
});

const storageKey = (uid?: string) => `coreai_usage_limits_${uid || 'anon'}`;

const load = (uid?: string): UsageState => {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return blank();
    const parsed = JSON.parse(raw) as UsageState;
    if (parsed.lastResetDate !== today()) {
      return blank();
    }
    return { ...blank(), ...parsed, modeUsage: { ...blank().modeUsage, ...parsed.modeUsage } };
  } catch {
    return blank();
  }
};

const save = (uid: string | undefined, s: UsageState) => {
  try { localStorage.setItem(storageKey(uid), JSON.stringify(s)); } catch {}
};

// Map a chat mode string to one of the 4 limit buckets
export const mapToLimitMode = (mode: string): LimitMode => {
  if (mode === 'photo') return 'image';
  if (mode === 'code') return 'code';
  if (mode === 'study' || mode === 'homework') return 'study';
  return 'chat';
};

export const useUsageLimits = (userId: string | undefined, isPremium: boolean) => {
  const [state, setState] = useState<UsageState>(() => load(userId));

  // Reload when user changes / daily reset
  useEffect(() => {
    setState(load(userId));
  }, [userId]);

  // Auto reset check on mount + interval
  useEffect(() => {
    const check = () => {
      setState(prev => {
        if (prev.lastResetDate !== today()) {
          const fresh = blank();
          save(userId, fresh);
          return fresh;
        }
        return prev;
      });
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [userId]);

  const update = useCallback((updater: (s: UsageState) => UsageState) => {
    setState(prev => {
      const next = updater(prev);
      save(userId, next);
      return next;
    });
  }, [userId]);

  /** Returns { allowed, reason } — call BEFORE sending. */
  const checkCanSend = useCallback((mode: string): { allowed: boolean; reason?: 'daily' | 'mode'; limitMode?: LimitMode } => {
    if (isPremium) return { allowed: true };
    const lm = mapToLimitMode(mode);
    const cur = load(userId); // fresh
    if ((cur.modeUsage[lm] || 0) >= PER_MODE_LIMIT) {
      return { allowed: false, reason: 'mode', limitMode: lm };
    }
    if (cur.dailyChatsUsed >= DAILY_CHAT_LIMIT && cur.bonusChats <= 0) {
      return { allowed: false, reason: 'daily', limitMode: lm };
    }
    return { allowed: true, limitMode: lm };
  }, [isPremium, userId]);

  /** Record a successful send — call AFTER allowed send. */
  const recordSend = useCallback((mode: string) => {
    if (isPremium) return;
    const lm = mapToLimitMode(mode);
    update(prev => {
      const next = { ...prev, modeUsage: { ...prev.modeUsage } };
      next.modeUsage[lm] = (next.modeUsage[lm] || 0) + 1;
      if (prev.dailyChatsUsed < DAILY_CHAT_LIMIT) {
        next.dailyChatsUsed = prev.dailyChatsUsed + 1;
      } else if (prev.bonusChats > 0) {
        next.bonusChats = prev.bonusChats - 1;
      }
      return next;
    });
  }, [isPremium, update]);

  const addBonusChats = useCallback((n = AD_BONUS) => {
    update(prev => ({ ...prev, bonusChats: prev.bonusChats + n }));
  }, [update]);

  return {
    state,
    checkCanSend,
    recordSend,
    addBonusChats,
    DAILY_CHAT_LIMIT,
    PER_MODE_LIMIT,
  };
};
