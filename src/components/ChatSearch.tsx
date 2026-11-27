import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message } from "@/hooks/useChats";

interface ChatSearchProps {
  messages: Message[];
  onScrollToMessage: (messageId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSearch = ({
  messages,
  onScrollToMessage,
  isOpen,
  onClose,
}: ChatSearchProps) => {
  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return messages.filter(msg => 
      msg.content.toLowerCase().includes(lowerQuery)
    );
  }, [query, messages]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setCurrentIndex(0);
    if (value.trim()) {
      const lower = value.toLowerCase();
      const firstMatch = messages.find(m => m.content.toLowerCase().includes(lower));
      if (firstMatch) {
        onScrollToMessage(firstMatch.id);
      }
    }
  }, [messages, onScrollToMessage]);

  const navigateResult = (direction: 'up' | 'down') => {
    if (results.length === 0) return;
    
    let newIndex = direction === 'up' 
      ? currentIndex - 1 
      : currentIndex + 1;
    
    if (newIndex < 0) newIndex = results.length - 1;
    if (newIndex >= results.length) newIndex = 0;
    
    setCurrentIndex(newIndex);
    onScrollToMessage(results[newIndex].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        navigateResult('up');
      } else {
        navigateResult('down');
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="absolute top-2 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-xl z-30 bg-background/95 backdrop-blur-md rounded-2xl border border-border/80 shadow-lg p-2"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search in chat..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-24 h-9.5 rounded-xl bg-muted/40 border-border/50 text-sm focus-visible:ring-1"
              autoFocus
            />
            {query.trim() && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-md">
                {results.length > 0 ? `${currentIndex + 1} of ${results.length}` : 'No matches'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-muted active:scale-90 transition-all duration-150"
              onClick={() => navigateResult('up')}
              disabled={results.length === 0}
              title="Previous (Shift+Enter)"
            >
              <ChevronUp className="w-4 h-4 transition-transform active:-translate-y-0.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-muted active:scale-90 transition-all duration-150"
              onClick={() => navigateResult('down')}
              disabled={results.length === 0}
              title="Next (Enter)"
            >
              <ChevronDown className="w-4 h-4 transition-transform active:translate-y-0.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-muted hover:rotate-90 active:scale-90 transition-all duration-200 ml-1"
              onClick={onClose}
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
