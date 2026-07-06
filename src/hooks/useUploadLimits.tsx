import { useCallback, useEffect, useState } from 'react';
import { getPlanLimits, isUnlimited, type PlanId } from '@/config/planLimits';

interface UploadState {
  date: string;
  count: number;
}

const today = () => new Date().toISOString().slice(0, 10);
const key = (uid?: string) => `coreai_upload_limits_${uid || 'anon'}`;

const load = (uid?: string): UploadState => {
  try {
    const raw = localStorage.getItem(key(uid));
    if (!raw) return { date: today(), count: 0 };
    const parsed = JSON.parse(raw) as UploadState;
    if (parsed.date !== today()) return { date: today(), count: 0 };
    return parsed;
  } catch {
    return { date: today(), count: 0 };
  }
};

const save = (uid: string | undefined, s: UploadState) => {
  try { localStorage.setItem(key(uid), JSON.stringify(s)); } catch {}
};

export const useUploadLimits = (userId: string | undefined, plan: PlanId) => {
  const [state, setState] = useState<UploadState>(() => load(userId));
  const limits = getPlanLimits(plan).uploads;

  useEffect(() => { setState(load(userId)); }, [userId]);

  const remainingDaily = isUnlimited(limits.perDay)
    ? Infinity
    : Math.max(0, limits.perDay - state.count);

  /**
   * Check if a batch of N files can be uploaded now.
   * Returns { allowed, allowedCount, reason }.
   * If batch size is bigger than perBatch → allowedCount trimmed to perBatch.
   * If remainingDaily < allowed → allowedCount trimmed to remainingDaily.
   */
  const checkBatch = useCallback(
    (fileCount: number): { allowed: boolean; allowedCount: number; reason?: 'batch' | 'daily' | 'empty' } => {
      if (fileCount <= 0) return { allowed: false, allowedCount: 0, reason: 'empty' };
      const perBatchCap = isUnlimited(limits.perBatch) ? fileCount : limits.perBatch;
      let allowedCount = Math.min(fileCount, perBatchCap);
      let reason: 'batch' | 'daily' | undefined =
        fileCount > perBatchCap ? 'batch' : undefined;

      if (!isUnlimited(limits.perDay)) {
        const rem = Math.max(0, limits.perDay - state.count);
        if (rem <= 0) return { allowed: false, allowedCount: 0, reason: 'daily' };
        if (allowedCount > rem) {
          allowedCount = rem;
          reason = 'daily';
        }
      }
      return { allowed: allowedCount > 0, allowedCount, reason };
    },
    [limits.perBatch, limits.perDay, state.count]
  );

  const recordUploads = useCallback((n: number) => {
    if (isUnlimited(limits.perDay)) return;
    setState((prev) => {
      const cur = prev.date === today() ? prev : { date: today(), count: 0 };
      const next = { date: today(), count: cur.count + n };
      save(userId, next);
      return next;
    });
  }, [limits.perDay, userId]);

  return {
    limits,
    usedToday: state.count,
    remainingDaily,
    checkBatch,
    recordUploads,
  };
};
