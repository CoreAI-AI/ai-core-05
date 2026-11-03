import { memo, useEffect, useState } from 'react';
import coreaiLogo from '@/assets/coreai-logo.png';

interface ImageGenerationBubbleProps {
  prompt?: string;
}

const STAGES = [
  '🪔 Diya roshan ho raha hai...',
  '✨ Rangon ki rangoli saj rahi hai...',
  '🎆 Diwali magic ban raha hai...',
  '🎇 Aapki tasveer chamakne wali hai...',
];

// Pre-computed spark positions (no per-render randomness)
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  left: `${8 + ((i * 37) % 84)}%`,
  delay: `${(i * 0.37) % 3}s`,
  duration: `${2.6 + ((i * 0.53) % 1.8)}s`,
  size: 3 + (i % 3),
}));

/**
 * Lightweight Diwali-themed "Creating image" bubble.
 * Pure CSS (GPU transforms/opacity) — animation stays inside the bubble.
 */
export const ImageGenerationBubble = memo(({ prompt }: ImageGenerationBubbleProps) => {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + (p < 50 ? 4 : p < 80 ? 2 : 0.6), 95);
        setStage(next < 25 ? 0 : next < 55 ? 1 : next < 80 ? 2 : 3);
        return next;
      });
    }, 900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex mb-3 animate-fade-in" role="status" aria-live="polite">
      <div className="mr-2 flex items-start shrink-0">
        <img src={coreaiLogo} alt="CoreAI" className="w-7 h-7 rounded-full shadow-sm ring-1 ring-background" />
      </div>

      <div className="flex-1 min-w-0 max-w-[88%] sm:max-w-[80%] lg:max-w-[75%]">
        <div className="rounded-2xl rounded-tl-md overflow-hidden border border-border/50 bg-card shadow-sm w-[260px] sm:w-[320px]">
          <div className="diwali-stage relative aspect-square overflow-hidden isolate">
            <div className="diwali-rangoli" aria-hidden />
            <div className="diwali-glow" aria-hidden />
            {SPARKS.map((s, i) => (
              <span
                key={i}
                className="diwali-spark"
                style={{ left: s.left, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration }}
                aria-hidden
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className="relative flex flex-col items-center">
                <span className="diwali-flame-halo" />
                <span className="diwali-flame" />
                <span className="text-5xl leading-none -mt-1 select-none">🪔</span>
              </div>
            </div>
            <div className="absolute top-3 left-3 right-3 text-sm font-medium text-foreground/90">
              {STAGES[stage]}
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                <div className="diwali-bar h-full rounded-full" style={{ transform: `scaleX(${progress / 100})` }} />
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground text-right">{Math.round(progress)}%</div>
            </div>
          </div>
          {prompt && (
            <div className="px-3 py-2 text-xs text-muted-foreground line-clamp-2 border-t border-border/40">
              “{prompt}”
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
ImageGenerationBubble.displayName = "ImageGenerationBubble";
