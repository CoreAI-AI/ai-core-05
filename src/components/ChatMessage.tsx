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
        className="flex justify-end mb-3 group"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]">
          {/* Actions on hover */}
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={true} 
            onEdit={onEdit}
            className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
          
          <div className="relative min-w-0 flex-1">
            <motion.div 
              className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3 py-2 shadow-sm"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15, delay: 0.05 }}
            >
              <p className="text-sm leading-snug break-words whitespace-pre-wrap overflow-wrap-anywhere">{message}</p>
              {timestamp && (
                <p className="text-[10px] opacity-70 mt-1">{timestamp}</p>
              )}
            </motion.div>
          </div>
          
          {/* User avatar with logo */}
          <motion.div 
            className="flex items-end shrink-0"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <div className="w-7 h-7 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ring-1 ring-background">
              U
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex mb-3 group"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* AI avatar with CoreAI logo */}
      <motion.div 
        className="mr-2 flex items-start shrink-0"
        initial={{ scale: 0, rotate: 30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <img 
          src={coreaiLogo} 
          alt="CoreAI" 
          className="w-7 h-7 rounded-full shadow-sm ring-1 ring-background" 
        />
      </motion.div>
      
      <div className="flex-1 min-w-0 max-w-[85%] sm:max-w-[80%] lg:max-w-[70%]">
        <motion.div 
          className="bg-card text-card-foreground rounded-2xl rounded-tl-md px-3 py-2 shadow-sm border border-border/50"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.1 }}
        >
          {/* Display images if present */}
          {images && images.length > 0 && (
            <div className="mb-3 space-y-2">
              {images.map((image: any, index: number) => (
                <motion.div 
                  key={index} 
                  className="rounded-lg overflow-hidden shadow-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.15 + index * 0.05 }}
                >
                  <img
                    src={image.image_url?.url || image.url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto max-w-sm rounded-lg"
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
              className="text-sm leading-snug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              <MarkdownRenderer content={message} className="break-words [overflow-wrap:anywhere]" />
            </motion.div>
          )}
          
          {timestamp && (
            <p className="text-[10px] text-muted-foreground mt-2">{timestamp}</p>
          )}
        </motion.div>
        
        {/* Actions below message for AI */}
        {message && (
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={false} 
            onRegenerate={onRegenerate}
            className="mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          />
        )}
      </div>
    </motion.div>
  );
};
