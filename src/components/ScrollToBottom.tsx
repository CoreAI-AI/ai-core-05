import { useEffect, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollToBottomProps {
  scrollAreaRef?: React.RefObject<HTMLDivElement>;
  className?: string;
  hasNewMessage?: boolean;
  hasNewMessages?: boolean;
  visible?: boolean;
  onClick?: () => void;
  onScrollToBottom?: () => void;
}

export const ScrollToBottom = ({ 
  scrollAreaRef, 
  className, 
  hasNewMessage,
  hasNewMessages,
  visible,
  onClick,
  onScrollToBottom 
}: ScrollToBottomProps) => {
  const [showButton, setShowButton] = useState(false);
  const isMessageAlert = Boolean(hasNewMessage || hasNewMessages);

  useEffect(() => {
    const container = scrollAreaRef?.current;
    if (!container) {
      if (typeof visible === 'boolean') {
        setShowButton(visible);
      }
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollAreaRef, visible]);

  const scrollToBottom = useCallback(() => {
    if (onClick) {
      onClick();
      return;
    }
    const container = scrollAreaRef?.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
    onScrollToBottom?.();
  }, [scrollAreaRef, onClick, onScrollToBottom]);

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
            className={cn(
              "rounded-full shadow-lg h-9 px-4 gap-2 bg-background/95 backdrop-blur-sm border hover:bg-muted active:scale-95 transition-all",
              isMessageAlert 
                ? "border-primary bg-primary/10 hover:bg-primary/20" 
                : "border-border"
            )}
          >
            {isMessageAlert && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
              >
                <span className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
              </motion.span>
            )}
            <ArrowDown className={cn("h-4 w-4", isMessageAlert && "text-primary")} />
            <span className={cn("text-xs font-medium", isMessageAlert && "text-primary")}>
              {isMessageAlert ? "New message" : "Scroll to bottom"}
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
