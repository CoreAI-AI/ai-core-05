import { memo, useRef, useEffect, useState, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingWaveform } from './TypingWaveform';
import { ImageGenerationBubble } from './ImageGenerationBubble';
import { AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  is_user: boolean;
  created_at: string;
  images?: any[];
}

interface VirtualizedChatMessagesProps {
  messages: Message[];
  chatId?: string;
  isAITyping: boolean;
  isGeneratingImage?: boolean;
  imagePrompt?: string;
  onEditMessage?: (id: string, content: string, index: number) => void;
  onRegenerateResponse?: (id: string, index: number) => void;
}

const VIRTUALIZATION_THRESHOLD = 50;
const BUFFER_SIZE = 10;
const ESTIMATED_ROW_HEIGHT = 100;

const VirtualizedChatMessages = memo(({ 
  messages, 
  chatId,
  isAITyping,
  isGeneratingImage,
  imagePrompt,
  onEditMessage,
  onRegenerateResponse 
}: VirtualizedChatMessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const [containerHeight, setContainerHeight] = useState(600);
  const rowHeightsRef = useRef<Map<number, number>>(new Map());
  const lastScrollTop = useRef(0);

  const getTotalHeight = useCallback(() => {
    let total = 0;
    for (let i = 0; i < messages.length; i++) {
      total += rowHeightsRef.current.get(i) || ESTIMATED_ROW_HEIGHT;
    }
    return total;
  }, [messages.length]);

  const getOffsetForIndex = useCallback((index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += rowHeightsRef.current.get(i) || ESTIMATED_ROW_HEIGHT;
    }
    return offset;
  }, []);

  const updateVisibleRange = useCallback((scrollTop: number) => {
    let startIndex = 0;
    let offset = 0;
    
    for (let i = 0; i < messages.length; i++) {
      const height = rowHeightsRef.current.get(i) || ESTIMATED_ROW_HEIGHT;
      if (offset + height > scrollTop - BUFFER_SIZE * ESTIMATED_ROW_HEIGHT) {
        startIndex = i;
        break;
      }
      offset += height;
    }

    let endIndex = startIndex;
    for (let i = startIndex; i < messages.length; i++) {
      const height = rowHeightsRef.current.get(i) || ESTIMATED_ROW_HEIGHT;
      offset += height;
      endIndex = i;
      if (offset > scrollTop + containerHeight + BUFFER_SIZE * ESTIMATED_ROW_HEIGHT) {
        break;
      }
    }

    setVisibleRange({
      start: Math.max(0, startIndex - BUFFER_SIZE),
      end: Math.min(messages.length, endIndex + BUFFER_SIZE)
    });
  }, [messages.length, containerHeight]);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    
    if (Math.abs(scrollTop - lastScrollTop.current) > 50) {
      lastScrollTop.current = scrollTop;
      updateVisibleRange(scrollTop);
    }
  }, [updateVisibleRange]);

  const measureRow = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      const height = element.getBoundingClientRect().height;
      if (height > 0 && rowHeightsRef.current.get(index) !== height) {
        rowHeightsRef.current.set(index, height);
      }
    }
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Smooth jitter-free auto scroll to bottom
  useEffect(() => {
    if (containerRef.current && messages.length > 0) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [messages.length, messages[messages.length - 1]?.content]);

  useEffect(() => {
    if (messages.length > VIRTUALIZATION_THRESHOLD) {
      setVisibleRange({
        start: Math.max(0, messages.length - 30),
        end: messages.length
      });
    }
  }, [messages.length]);

  const findQuestion = (idx: number) => {
    for (let i = idx - 1; i >= 0; i--) if (messages[i].is_user) return messages[i].content;
    return undefined;
  };

  if (messages.length < VIRTUALIZATION_THRESHOLD) {
    return (
      <div className="space-y-1 pb-4">
        {messages.map((message, index) => (
          <div key={message.id} id={`message-${message.id}`} className="transition-colors duration-300">
            <ChatMessage
              message={message.content}
              messageId={message.id}
              isUser={message.is_user}
              timestamp={new Date(message.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
              images={message.images}
              question={!message.is_user ? findQuestion(index) : undefined}
              onEdit={message.is_user ? () => onEditMessage?.(message.id, message.content, index) : undefined}
              onRegenerate={!message.is_user ? () => onRegenerateResponse?.(message.id, index) : undefined}
            />
          </div>
        ))}
        <AnimatePresence>
          <TypingWaveform show={isAITyping} />
        </AnimatePresence>
        {isGeneratingImage && <ImageGenerationBubble prompt={imagePrompt} />}
      </div>
    );
  }

  const totalHeight = getTotalHeight();
  const visibleMessages = messages.slice(visibleRange.start, visibleRange.end);
  const topPadding = getOffsetForIndex(visibleRange.start);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent will-change-scroll"
      style={{ position: 'relative' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: topPadding, 
          left: 0, 
          right: 0,
          padding: '0 12px'
        }}>
          <div className="space-y-1 max-w-4xl mx-auto">
            {visibleMessages.map((message, i) => {
              const actualIndex = visibleRange.start + i;
              return (
                <div 
                  key={message.id}
                  ref={(el) => measureRow(actualIndex, el)}
                >
                  <ChatMessage
                    message={message.content}
                    messageId={message.id}
                    isUser={message.is_user}
                    timestamp={new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    images={message.images}
                    question={!message.is_user ? findQuestion(actualIndex) : undefined}
                    onEdit={message.is_user ? () => onEditMessage?.(message.id, message.content, actualIndex) : undefined}
                    onRegenerate={!message.is_user ? () => onRegenerateResponse?.(message.id, actualIndex) : undefined}
                  />
                </div>
              );
            })}
            
            <AnimatePresence>
              <TypingWaveform show={isAITyping} />
            </AnimatePresence>
            {isGeneratingImage && <ImageGenerationBubble prompt={imagePrompt} />}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualizedChatMessages.displayName = 'VirtualizedChatMessages';

export { VirtualizedChatMessages };
