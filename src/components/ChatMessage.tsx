import { MarkdownRenderer } from './MarkdownRenderer';
import { MessageActions } from './MessageActions';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  messageId?: string;
  isUser: boolean;
  timestamp?: string;
  images?: any[];
  isLoading?: boolean;
  onRegenerate?: () => void;
  onEdit?: () => void;
}

export const ChatMessage = ({ 
  message, 
  messageId,
  isUser, 
  timestamp, 
  images, 
  isLoading,
  onRegenerate,
  onEdit
}: ChatMessageProps) => {
  if (isUser) {
    return (
      <div className="flex justify-end mb-4 group">
        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
          {/* Actions on hover */}
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={true} 
            onEdit={onEdit}
            className="mb-2"
          />
          
          <div className="bg-chat-user-bg text-chat-user-fg rounded-2xl px-4 py-3 shadow-sm">
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message}</p>
            {timestamp && (
              <p className="text-xs opacity-70 mt-1.5">{timestamp}</p>
            )}
          </div>
        </div>
        
        {/* User avatar */}
        <div className="ml-2 flex items-end shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium shadow-sm">
            U
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-4 group">
      {/* AI avatar */}
      <div className="mr-2 sm:mr-3 flex items-start shrink-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium shadow-sm">
          AI
        </div>
      </div>
      
      <div className="flex-1 max-w-[85%] sm:max-w-[75%]">
        <div className="bg-chat-ai-bg text-chat-ai-fg rounded-2xl px-4 py-3 shadow-sm">
          {/* Display images if present */}
          {images && images.length > 0 && (
            <div className="mb-3 space-y-2">
              {images.map((image: any, index: number) => (
                <div key={index} className="rounded-xl overflow-hidden">
                  <img
                    src={image.image_url?.url || image.url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto max-w-md rounded-xl"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Display text content or loading indicator */}
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              </div>
              <span className="text-xs font-medium">Thinking...</span>
            </div>
          ) : message ? (
            <div className="text-sm">
              <MarkdownRenderer content={message} />
            </div>
          ) : null}
          
          {timestamp && (
            <p className="text-xs opacity-60 mt-2">{timestamp}</p>
          )}
        </div>
        
        {/* Actions below message for AI */}
        {!isLoading && message && (
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={false} 
            onRegenerate={onRegenerate}
            className="mt-1 ml-1"
          />
        )}
      </div>
    </div>
  );
};
