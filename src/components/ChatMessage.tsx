import { MarkdownRenderer } from './MarkdownRenderer';
import { MessageActions } from './MessageActions';
import { cn } from '@/lib/utils';
import coreaiLogo from '@/assets/coreai-logo.png';

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
      <div className="flex justify-end mb-6 group animate-fade-in">
        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
          {/* Actions on hover */}
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={true} 
            onEdit={onEdit}
            className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
          
          <div className="relative">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-md">
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap font-medium">{message}</p>
              {timestamp && (
                <p className="text-xs opacity-70 mt-2 font-normal">{timestamp}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* User avatar */}
        <div className="ml-3 flex items-end shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 gradient-bg rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
            U
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-6 group animate-fade-in">
      {/* AI avatar with premium styling */}
      <div className="mr-3 flex items-start shrink-0">
        <img src={coreaiLogo} alt="CoreAI" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-sm" />
      </div>
      
      <div className="flex-1 max-w-[85%] sm:max-w-[80%]">
        <div className="bg-card text-card-foreground rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-border/50">
          {/* Display images if present */}
          {images && images.length > 0 && (
            <div className="mb-4 space-y-3">
              {images.map((image: any, index: number) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md">
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
            <div className="flex items-center gap-3 py-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
                <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
                <div className="w-2 h-2 bg-primary rounded-full typing-dot" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Thinking...</span>
            </div>
          ) : message ? (
            <div className="text-sm leading-relaxed">
              <MarkdownRenderer content={message} />
            </div>
          ) : null}
          
          {timestamp && (
            <p className="text-xs text-muted-foreground mt-3">{timestamp}</p>
          )}
        </div>
        
        {/* Actions below message for AI */}
        {!isLoading && message && (
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={false} 
            onRegenerate={onRegenerate}
            className="mt-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        )}
      </div>
    </div>
  );
};
