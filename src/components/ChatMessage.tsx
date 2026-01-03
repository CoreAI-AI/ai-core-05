import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  images?: any[];
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isUser, timestamp, images, isLoading }: ChatMessageProps) => {
  if (isUser) {
    return (
      <div className="flex justify-end mb-3 sm:mb-4">
        <div className="max-w-[85%] sm:max-w-[70%] bg-chat-user-bg text-chat-user-fg rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
          <p className="text-sm leading-relaxed break-words">{message}</p>
          {timestamp && (
            <p className="text-xs opacity-70 mt-1">{timestamp}</p>
          )}
        </div>
        <div className="ml-2 flex items-end shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-medium">
            U
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-3 sm:mb-4">
      <div className="mr-2 sm:mr-3 flex items-start shrink-0">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
          AI
        </div>
      </div>
      <div className="max-w-[85%] sm:max-w-[70%] bg-chat-ai-bg text-chat-ai-fg rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
        {/* Display images if present */}
        {images && images.length > 0 && (
          <div className="mb-3 space-y-2">
            {images.map((image: any, index: number) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img
                  src={image.image_url?.url || image.url}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-auto max-w-sm rounded-lg"
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
          <div className="flex items-center space-x-1 text-muted-foreground">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce-high [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce-high [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce-high"></div>
            </div>
            <span className="text-xs">AI is thinking...</span>
          </div>
        ) : message ? (
          <div className="text-sm">
            <MarkdownRenderer content={message} />
          </div>
        ) : null}
        
        {timestamp && (
          <p className="text-xs opacity-70 mt-2">{timestamp}</p>
        )}
      </div>
    </div>
  );
};