# CoreAI Update Plan

UI, design, branding, animations aur workflow same rahenge. Sirf functionality changes.

## 1. Settings cleanup
- `src/components/Settings.tsx`: remove "Default Model" (AI Preferences) aur pura "Text-to-Speech" block (TTS toggle, voice picker, speech rate).
- `src/hooks/useSettings.tsx`: `defaultModel`, `textToSpeechEnabled`, `selectedVoice`, `speechRate` fields hataao.
- Baaki jaha bhi ye fields read ho rahe hain (agar), unko safely remove ya default fallback.

## 2. App Lock default ON
- `src/hooks/useAppLock.ts`: default state `enabled: true` for all users (first-time bhi enabled ho).
- Migration ke liye: agar user ke storage me flag hi nahi hai, treat as enabled. User baad me manually off kar sakta hai settings se.

## 3. Central config file (future-ready, backend-swappable)
Naya file: `src/config/planLimits.ts`

```ts
export type PlanId = 'free' | 'premium_monthly' | 'premium_quarterly' | 'premium_yearly';

export interface PlanLimits {
  uploads: { perBatch: number; perDay: number };          // -1 = unlimited
  imageGen: { perDay: number; hdEnabled: boolean; styles: string[] };
  imageEdit: { perDay: number };
  features: { deepResearch: boolean; codeMode: boolean; pdfExport: boolean; proModels: boolean };
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free:              { uploads:{perBatch:5,  perDay:10}, imageGen:{perDay:5,  hdEnabled:false, styles:['basic']},
                       imageEdit:{perDay:3},  features:{deepResearch:false,codeMode:false,pdfExport:false,proModels:false} },
  premium_monthly:   { uploads:{perBatch:10, perDay:50}, imageGen:{perDay:30, hdEnabled:true,  styles:['basic','pro']},
                       imageEdit:{perDay:20}, features:{deepResearch:true, codeMode:true, pdfExport:true, proModels:false} },
  premium_quarterly: { uploads:{perBatch:15, perDay:100},imageGen:{perDay:60, hdEnabled:true,  styles:['basic','pro','artistic']},
                       imageEdit:{perDay:40}, features:{deepResearch:true, codeMode:true, pdfExport:true, proModels:true } },
  premium_yearly:    { uploads:{perBatch:-1, perDay:-1}, imageGen:{perDay:-1, hdEnabled:true,  styles:['basic','pro','artistic','cinematic']},
                       imageEdit:{perDay:-1}, features:{deepResearch:true, codeMode:true, pdfExport:true, proModels:true } },
};
```

Aap future me ye numbers ya poora object backend `plan_configs` table se load kar sakte ho — sirf ek fetch helper add karna hoga, UI code touch nahi hoga. Default values placeholder hain; final numbers aap dijiyega, main update kar dunga.

## 4. Upload limits (multi-file + daily)
- Naya hook: `src/hooks/useUploadLimits.tsx` — localStorage me `uploads_YYYY-MM-DD` counter, plan ke `perBatch`/`perDay` se check.
- `ImageUploadModal.tsx` / wherever `<input type="file">` hai: `multiple` attribute ON, selection me `perBatch` se zyaada aane par pehle N accept + toast "Max 5 files at once".
- Daily quota exhausted → existing `LimitPopup` reuse with plan-specific message + "Upgrade" CTA.

## 5. Smart Image Editing (Gemini-style intent detection)
- `src/lib/imageEditIntent.ts` (new): regex/keyword list — remove background, change dress, add/remove object, improve quality, make realistic, poster, edit this, change style, replace background, add text, extend, resize, upscale (Hindi + English).
- Send flow (ChatInput → Index): agar attachments length ≥ 1 AND intent matches → route to existing `image-edit` edge function using **uploaded images as reference** (multi-image supported by passing array). Warna normal chat/image-gen flow.
- Multi-image edit: `image-edit` function ko update — accept `images: string[]` (base64/URL) instead of single.

## 6. Image Generator mode — hybrid
- Photo/Image mode me:
  - Attachments hain → edit path (reference-based).
  - Attachments nahi → existing text-to-image (`local-image-gen`).
- Same input, same button — branching internal.

## 7. Upload option in ALL modes
- ChatInput ka "+" / attach button har mode me visible (currently kuch modes me hidden ho sakta hai). Chat, Study, Code, Photo, Deep Research — sab me file/image upload allowed. Backend prompt me file context inject already existing pipeline se.

## 8. Premium plans UI (Coming Soon + Redeem)
- `PricingPlans.tsx` / `SubscriptionPopup.tsx`: 3 plan cards (Monthly ₹249, Quarterly ₹599, Yearly ₹1,999) — already partially present.
- Pay button → disabled "Coming Soon" badge.
- Redeem code input visible + active (existing `PREM-FCEO` flow already works in `PaymentMethodSelector`). Redeem successful → user's plan = `premium_yearly` (unlimited placeholder) until aap change karo.
- `useSubscription`: `planId` field add, redeem/purchase sets it; `isPremium` = planId !== 'free'.

## 9. Feature gating via plan
- `useFeatureAccess` / `isPremium` checks ko `PLAN_LIMITS[planId].features.*` se replace. Hardcoded unlimited hataana.
- HD image, deep research, code, pdf export — plan features flag padhein.

## 10. Analytics
- Existing `track()` events preserve. Add: `upload_limit_reached`, `image_edit_intent_detected`, `plan_gate_hit` (plan, feature).

## Out of scope (per your ask)
- Payment gateway wiring — skip until aap bolo.
- Final limit numbers — placeholder hain; aap batayenge to update kar dunga.
- Koi UI redesign nahi.

## Files touched (approx)
- new: `src/config/planLimits.ts`, `src/hooks/useUploadLimits.tsx`, `src/lib/imageEditIntent.ts`
- edit: `Settings.tsx`, `useSettings.tsx`, `useAppLock.ts`, `useSubscription.tsx`, `useFeatureAccess.tsx`, `ChatInput.tsx`, `ImageUploadModal.tsx`, `Index.tsx`, `PricingPlans.tsx`, `SubscriptionPopup.tsx`, `PaymentMethodSelector.tsx`, `supabase/functions/image-edit/index.ts`

Approve karo to main implement start karta hoon. Agar kisi placeholder limit ko abhi change karna ho batao.
