import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useTTSPlayer } from "@/hooks/useTTSPlayer";
import { Button } from "@/components/ui/button";

export const ReadAloudHeaderPlayer = () => {
  const { isActive, isPaused, title, progress, toggle, stop } = useTTSPlayer();

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="tts-bar"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="w-full bg-primary/5 border-b border-primary/20 backdrop-blur-md z-30"
          role="region"
          aria-label="Read aloud player"
        >
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3">
            {/* Pulsing speaker icon */}
            <div className="relative flex-shrink-0">
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/40"
                animate={
                  isPaused
                    ? { scale: 1, opacity: 0.3 }
                    : { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }
                }
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Volume2 className="h-4 w-4" />
              </div>
            </div>

            {/* Title + progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {isPaused ? "Paused — " : "Reading — "}
                  <span className="text-muted-foreground">{title}</span>
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground tabular-nums shrink-0">
                  {progress}%
                </span>
              </div>
              <div className="h-1 sm:h-1.5 w-full rounded-full bg-primary/15 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "linear" }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggle}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full hover:bg-primary/10"
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={stop}
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Stop"
              >
                <Square className="h-4 w-4 fill-current" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
