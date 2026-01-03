import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  images?: any[];
  isLoading?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  density?: 'comfortable' | 'compact';
}

const fontSizeClasses = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base'
};

const densityClasses = {
  comfortable: {
    wrapper: 'py-6',
    gap: 'gap-4',
    avatar: 'w-8 h-8',
    iconSize: 'w-4 h-4'
  },
  compact: {
    wrapper: 'py-3',
    gap: 'gap-3',
    avatar: 'w-6 h-6',
    iconSize: 'w-3 h-3'
  }
};

export const ChatMessage = ({ 
  message, 
  isUser, 
  timestamp, 
  images, 
  isLoading,
  fontSize = 'medium',
  density = 'comfortable'
}: ChatMessageProps) => {
  const fontClass = fontSizeClasses[fontSize];
  const densityConfig = densityClasses[density];

  // ChatGPT-style: full-width rows with subtle background alternation
  return (
    <div 
      className={cn(
        "w-full",
        densityConfig.wrapper,
        !isUser && "bg-muted/30"
      )}
    >
      <div className={cn(
        "max-w-3xl mx-auto flex",
        densityConfig.gap,
        "px-4"
      )}>
        {/* Avatar */}
        <div className="shrink-0 pt-0.5">
          <div 
            className={cn(
              densityConfig.avatar,
              "rounded-sm flex items-center justify-center",
              isUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-emerald-600 text-white"
            )}
          >
            {isUser ? (
              <User className={densityConfig.iconSize} />
            ) : (
              <Bot className={densityConfig.iconSize} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Sender label */}
          <p className="text-sm font-semibold text-foreground">
            {isUser ? 'You' : 'Assistant'}
          </p>

          {/* Images */}
          {images && images.length > 0 && (
            <div className="space-y-2">
              {images.map((image: any, index: number) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={image.image_url?.url || image.url}
                    alt={`Generated image ${index + 1}`}
                    className="max-w-full sm:max-w-md h-auto rounded-lg"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Message content or loading */}
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
              </div>
            </div>
          ) : message ? (
            <div className={cn(fontClass, "text-foreground leading-relaxed")}>
              {isUser ? (
                <p className="whitespace-pre-wrap break-words">{message}</p>
              ) : (
                <MarkdownRenderer content={message} />
              )}
            </div>
          ) : null}

          {/* Timestamp */}
          {timestamp && (
            <p className="text-xs text-muted-foreground/60 mt-1">
              {timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
