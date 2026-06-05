import { motion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface ImageGenerationBubbleProps {
  prompt?: string;
}

/**
 * ChatGPT-style inline "Creating image" bubble.
 * Square dark card with a pulsing dot-grid wave animation,
 * branded with CoreAI primary color.
 */
export const ImageGenerationBubble = ({ prompt }: ImageGenerationBubbleProps) => {
  const cols = 16;
  const rows = 16;

  return (
    <motion.div
      className="flex mb-3"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Avatar */}
      <div className="mr-2 flex items-start shrink-0">
        <img
          src={coreaiLogo}
          alt="CoreAI"
          className="w-7 h-7 rounded-full shadow-sm ring-1 ring-background"
        />
      </div>

      <div className="flex-1 min-w-0 max-w-[88%] sm:max-w-[80%] lg:max-w-[75%]">
        <div className="rounded-2xl rounded-tl-md overflow-hidden border border-border/50 bg-card shadow-sm">
          {/* Square dot-grid canvas */}
          <div className="relative w-[260px] sm:w-[320px] aspect-square bg-muted/50">
            {/* Pulsing background gradient */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.18), transparent 70%)',
              }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Label */}
            <div className="absolute top-3 left-3 z-10 text-sm font-medium text-foreground/85">
              Creating image
              <motion.span
                className="inline-block ml-1"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                …
              </motion.span>
            </div>

            {/* Dot grid */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="grid gap-[6px]"
                style={{
                  gridTemplateColumns: `repeat(${cols}, 3px)`,
                  gridTemplateRows: `repeat(${rows}, 3px)`,
                }}
              >
                {Array.from({ length: cols * rows }).map((_, i) => {
                  const x = i % cols;
                  const y = Math.floor(i / cols);
                  // distance from center -> wave delay
                  const dx = x - (cols - 1) / 2;
                  const dy = y - (rows - 1) / 2;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  const delay = (dist / 12) * 1.2;
                  return (
                    <motion.span
                      key={i}
                      className="block w-[3px] h-[3px] rounded-full bg-foreground/60"
                      animate={{
                        opacity: [0.15, 0.95, 0.15],
                        scale: [0.8, 1.4, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: delay % 2,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Soft shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(115deg, transparent 30%, hsl(var(--primary) / 0.12) 50%, transparent 70%)',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {prompt && (
            <div className="px-3 py-2 text-xs text-muted-foreground line-clamp-2 border-t border-border/40">
              “{prompt}”
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
