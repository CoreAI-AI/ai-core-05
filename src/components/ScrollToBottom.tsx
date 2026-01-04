import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollToBottomProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export const ScrollToBottom = ({ scrollAreaRef, className }: ScrollToBottomProps) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowButton(!isNearBottom);
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [scrollAreaRef]);

  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 z-10", className)}
        >
          <Button
            onClick={scrollToBottom}
            size="sm"
            variant="secondary"
            className="rounded-full shadow-lg h-9 px-4 gap-2 bg-background/95 backdrop-blur-sm border border-border hover:bg-muted active:scale-95 transition-transform"
          >
            <ArrowDown className="h-4 w-4" />
            <span className="text-xs font-medium">Scroll to bottom</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
