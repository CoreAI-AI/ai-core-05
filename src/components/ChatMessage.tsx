import { MarkdownRenderer } from './MarkdownRenderer';
import { MessageActions } from './MessageActions';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface ChatMessageProps {
  message: string;
  messageId?: string;
  isUser: boolean;
  timestamp?: string;
  images?: any[];
  onRegenerate?: () => void;
  onEdit?: () => void;
}

export const ChatMessage = ({ 
  message, 
  messageId,
  isUser, 
  timestamp, 
  images, 
  onRegenerate,
  onEdit
}: ChatMessageProps) => {
  if (isUser) {
    return (
      <motion.div 
        className="flex justify-end mb-6 group"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-end gap-2 max-w-[95%] sm:max-w-[90%] lg:max-w-[85%]">
          {/* Actions on hover */}
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={true} 
            onEdit={onEdit}
            className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
          
          <div className="relative min-w-0 flex-1">
            <motion.div 
              className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere">{message}</p>
              {timestamp && (
                <p className="text-xs opacity-70 mt-2">{timestamp}</p>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* User avatar with logo */}
        <motion.div 
          className="ml-3 flex items-end shrink-0"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="w-9 h-9 gradient-bg rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-background">
            U
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex mb-6 group"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* AI avatar with CoreAI logo */}
      <motion.div 
        className="mr-3 flex items-start shrink-0"
        initial={{ scale: 0, rotate: 45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <img 
          src={coreaiLogo} 
          alt="CoreAI" 
          className="w-9 h-9 rounded-full shadow-md ring-2 ring-background" 
        />
      </motion.div>
      
      <div className="flex-1 min-w-0 max-w-[95%] sm:max-w-[92%] lg:max-w-[88%]">
        <motion.div 
          className="bg-card text-card-foreground rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-border/50"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.15 }}
        >
          {/* Display images if present */}
          {images && images.length > 0 && (
            <div className="mb-4 space-y-3">
              {images.map((image: any, index: number) => (
                <motion.div 
                  key={index} 
                  className="rounded-xl overflow-hidden shadow-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
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
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Display text content */}
          {message && (
            <motion.div 
              className="text-sm leading-relaxed overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <MarkdownRenderer content={message} className="break-words [overflow-wrap:anywhere]" />
            </motion.div>
          )}
          
          {timestamp && (
            <p className="text-xs text-muted-foreground mt-3">{timestamp}</p>
          )}
        </motion.div>
        
        {/* Actions below message for AI */}
        {message && (
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={false} 
            onRegenerate={onRegenerate}
            className="mt-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        )}
      </div>
    </motion.div>
  );
};
