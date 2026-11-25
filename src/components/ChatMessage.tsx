import { useState, memo } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MessageActions } from './MessageActions';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';
import { FullScreenImageViewer } from './FullScreenImageViewer';
import { File as FileIcon } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  messageId?: string;
  isUser: boolean;
  timestamp?: string;
  images?: any[];
  isGeneratingImage?: boolean;
  onRegenerate?: () => void;
  onEdit?: () => void;
  question?: string;
}

export const ChatMessage = memo(({ 
  message, 
  messageId,
  isUser, 
  timestamp, 
  images, 
  isGeneratingImage,
  onRegenerate,
  onEdit,
  question
}: ChatMessageProps) => {
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoaded = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  // Lovable-style multi-image grid (1 image is clean, 2-10 images render in a responsive grid)
  const renderAttachments = () => {
    if (!images || images.length === 0) return null;
    
    return (
      <div className={cn(
        "mb-2.5 gap-2",
        images.length === 1 ? "block" : "grid grid-cols-2 sm:grid-cols-3"
      )}>
        {images.map((image: any, index: number) => {
          const imageUrl = image.image_url?.url || image.url;
          const isImage = image.type?.startsWith('image/') || imageUrl?.startsWith('data:image') || imageUrl?.includes('image');
          
          if (isImage && imageUrl) {
            const isLoaded = loadedImages[index];
            return (
              <motion.div 
                key={index} 
                className={cn(
                  "rounded-xl sm:rounded-2xl overflow-hidden shadow-xs cursor-pointer group/image relative bg-muted/40 border border-border/40",
                  images.length === 1 ? "min-h-[140px] max-w-xs" : "aspect-square"
                )}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => setFullScreenImage(imageUrl)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {!isLoaded && (
                  <div className="absolute inset-0 image-skeleton-shimmer rounded-xl" />
                )}
                <img
                  src={imageUrl}
                  alt={`Attachment ${index + 1}`}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    isLoaded ? "opacity-100" : "opacity-0"
                  )}
                  loading="lazy"
                  onLoad={() => handleImageLoaded(index)}
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-150 flex items-center justify-center">
                  <span className="text-white text-[11px] font-medium opacity-0 group-hover/image:opacity-100 transition-opacity duration-150 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    View
                  </span>
                </div>
              </motion.div>
            );
          } else {
            return (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/60 rounded-xl border border-border/40">
                <FileIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground truncate">
                  {image.name || 'Attached file'}
                </span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  // User Message (Right-aligned pill like Lovable)
  if (isUser) {
    return (
      <motion.div 
        className="flex justify-end mb-4 sm:mb-6 group will-change-transform"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-end gap-1.5 max-w-[88%] sm:max-w-[78%]">
          <MessageActions 
            message={message} 
            messageId={messageId}
            isUser={true} 
            onEdit={onEdit}
            className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          />
          
          <div className="relative min-w-0 flex-1">
            <motion.div 
              className="bg-muted/90 hover:bg-muted text-foreground rounded-2xl sm:rounded-3xl px-4 py-2 sm:px-5 sm:py-2.5 shadow-2xs border border-border/40 transition-colors font-sans text-sm sm:text-base leading-relaxed break-words whitespace-normal [overflow-wrap:anywhere]"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              {renderAttachments()}
              
              {message && (
                <p>{message}</p>
              )}
              
                            {timestamp && (
                <p className="text-xs text-muted-foreground/80 mt-1.5 text-right font-normal tracking-normal">{timestamp}</p>
              )}
            </motion.div>
          </div>
        </div>
        
        <FullScreenImageViewer
          isOpen={!!fullScreenImage}
          imageUrl={fullScreenImage || ''}
          onClose={() => setFullScreenImage(null)}
          prompt={message}
        />
      </motion.div>
    );
  }

  // Assistant Message (Left-corner aligned, covers full reading width, elegant typography)
  return (
    <motion.div 
      className="flex flex-col mb-6 sm:mb-8 group will-change-transform w-full"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="w-full min-w-0">
        <motion.div 
          className="text-foreground pt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {images && images.length > 0 && (
            <div className={cn(
              "mb-3 gap-2",
              images.length === 1 ? "block" : "grid grid-cols-2 sm:grid-cols-3"
            )}>
              {images.map((image: any, index: number) => {
                const imageUrl = image.image_url?.url || image.url;
                const isLoaded = loadedImages[index];
                return (
                  <motion.div 
                    key={index} 
                    className="rounded-2xl overflow-hidden shadow-xs cursor-pointer group/image relative min-h-[160px] bg-muted/40 border border-border/40"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    onClick={() => setFullScreenImage(imageUrl)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {!isLoaded && (
                      <div className="absolute inset-0 image-skeleton-shimmer rounded-2xl" />
                    )}
                    <img
                      src={imageUrl}
                      alt={`Generated image ${index + 1}`}
                      className={cn(
                        "w-full h-auto max-w-sm rounded-2xl transition-opacity duration-300",
                        isLoaded ? "opacity-100" : "opacity-0"
                      )}
                      loading="lazy"
                      onLoad={() => handleImageLoaded(index)}
                      onError={(e) => {
                        console.error('Error loading image:', e);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                      <span className="text-white text-xs font-medium opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                        View Full Screen
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          {message && (
            <div className="text-base sm:text-[17px] leading-[1.75] font-serif tracking-normal text-foreground/95 select-text">
              <MarkdownRenderer content={message} className="break-words [overflow-wrap:anywhere]" />
            </div>
          )}
          
                    {timestamp && (
            <p className="text-xs text-muted-foreground/80 mt-2 font-normal tracking-normal">{timestamp}</p>
          )}
        </motion.div>
        
        {/* Actions aligned directly beneath the response on the left */}
        {message && (
          <div className="mt-2.5 flex items-center">
            <MessageActions 
              message={message} 
              messageId={messageId}
              isUser={false} 
              onRegenerate={onRegenerate}
              question={question}
              className="opacity-90 group-hover:opacity-100 transition-opacity duration-150"
            />
          </div>
        )}
      </div>
      
      <FullScreenImageViewer
        isOpen={!!fullScreenImage}
        imageUrl={fullScreenImage || ''}
        onClose={() => setFullScreenImage(null)}
        prompt={message}
      />
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.message === nextProps.message &&
    prevProps.isGeneratingImage === nextProps.isGeneratingImage &&
    prevProps.images?.length === nextProps.images?.length &&
    prevProps.question === nextProps.question
  );
});

ChatMessage.displayName = 'ChatMessage';
export default ChatMessage;
