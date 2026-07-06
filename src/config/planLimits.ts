// Future-ready plan/limit configuration.
// Backend swap: replace PLAN_LIMITS lookup with a fetch from a `plan_configs`
// table — UI code stays identical. `-1` = unlimited.

export type PlanId =
  | 'free'
  | 'premium_monthly'
  | 'premium_quarterly'
  | 'premium_yearly';

export interface PlanLimits {
  uploads: {
    perBatch: number; // max files in a single upload action
    perDay: number;   // rolling daily upload count
    maxFileMB: number;
  };
  imageGen: {
    perDay: number;
    hdEnabled: boolean;
    styles: string[]; // style ids available for this plan
  };
  imageEdit: {
    perDay: number;
  };
  features: {
    deepResearch: boolean;
    codeMode: boolean;
    pdfExport: boolean;
    proModels: boolean;
    chatSave: boolean;
  };
}

// NOTE: numbers are placeholders — owner will finalize per-plan limits.
export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    uploads: { perBatch: 5, perDay: 10, maxFileMB: 10 },
    imageGen: { perDay: 5, hdEnabled: false, styles: ['basic'] },
    imageEdit: { perDay: 3 },
    features: {
      deepResearch: false,
      codeMode: false,
      pdfExport: false,
      proModels: false,
      chatSave: false,
    },
  },
  premium_monthly: {
    uploads: { perBatch: 10, perDay: 50, maxFileMB: 20 },
    imageGen: { perDay: 30, hdEnabled: true, styles: ['basic', 'pro'] },
    imageEdit: { perDay: 20 },
    features: {
      deepResearch: true,
      codeMode: true,
      pdfExport: true,
      proModels: false,
      chatSave: true,
    },
  },
  premium_quarterly: {
    uploads: { perBatch: 15, perDay: 100, maxFileMB: 25 },
    imageGen: { perDay: 60, hdEnabled: true, styles: ['basic', 'pro', 'artistic'] },
    imageEdit: { perDay: 40 },
    features: {
      deepResearch: true,
      codeMode: true,
      pdfExport: true,
      proModels: true,
      chatSave: true,
    },
  },
  premium_yearly: {
    uploads: { perBatch: -1, perDay: -1, maxFileMB: 50 },
    imageGen: { perDay: -1, hdEnabled: true, styles: ['basic', 'pro', 'artistic', 'cinematic'] },
    imageEdit: { perDay: -1 },
    features: {
      deepResearch: true,
      codeMode: true,
      pdfExport: true,
      proModels: true,
      chatSave: true,
    },
  },
};

export const getPlanLimits = (plan: PlanId | undefined | null): PlanLimits =>
  PLAN_LIMITS[plan ?? 'free'] ?? PLAN_LIMITS.free;

export const isUnlimited = (n: number) => n < 0;
