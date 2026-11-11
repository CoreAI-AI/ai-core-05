import { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Pencil, ThumbsUp, ThumbsDown, MoreHorizontal, Volume2, Flag, Pin, Share2, Image as ImageIcon } from 'lucide-react';
import { ShareResultCard } from './ShareResultCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { pinMessage } from './PinnedMessages';
import { useTTSPlayer } from '@/hooks/useTTSPlayer';

interface MessageActionsProps {
  message: string;
  messageId?: string;
  chatId?: string;
  isUser: boolean;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onReadAloud?: () => void;
  className?: string;
  question?: string;
}

export const MessageActions = ({ 
  message, 
  messageId,
  chatId,
  isUser, 
  onRegenerate, 
  onEdit,
  onReadAloud,
  className,
  question 
}: MessageActionsProps) => {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadFeedback = async () => {
      if (!messageId || isUser) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('message_feedback')
        .select('feedback_type')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setFeedback(data.feedback_type as 'good' | 'bad');
      }
    };

    loadFeedback();
  }, [messageId, isUser]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success('Message copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleFeedback = async (type: 'good' | 'bad') => {
    if (!messageId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to give feedback');
        return;
      }

      if (feedback === type) {
        await supabase
          .from('message_feedback')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id);
        setFeedback(null);
        toast.success('Feedback removed');
      } else {
        await supabase
          .from('message_feedback')
          .upsert({
            user_id: user.id,
            message_id: messageId,
            feedback_type: type
          }, {
            onConflict: 'user_id,message_id'
          });
        setFeedback(type);
        toast.success('Thanks for your feedback!');
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      toast.error('Failed to save feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tts = useTTSPlayer();
  const isThisPlaying = tts.isActive && tts.text === message;

  const handleReadAloud = () => {
    if (isThisPlaying) {
      tts.stop();
      return;
    }
    if (onReadAloud) {
      onReadAloud();
      return;
    }
    tts.play(message, { title: message.slice(0, 60) + (message.length > 60 ? "…" : "") });
    toast.success('Reading aloud...');
  };

  const handleReport = () => {
    toast.success('Message reported. Thank you for helping us improve.');
  };

  const handlePin = () => {
    if (!chatId || !messageId) {
      toast.error('Cannot pin this message');
      return;
    }
    
    const pinned = pinMessage(chatId, messageId, message);
    if (pinned) {
      toast.success('Message pinned!');
    } else {
      toast.info('Message already pinned');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          text: message,
        });
      } else {
        await navigator.clipboard.writeText(message);
        toast.success('Message copied to clipboard');
      }
    } catch (err) {
      // User cancelled
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pt-1 text-muted-foreground",
      className
    )}>
      {/* Minimalist Ghost Copy Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all"
        title="Copy message"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>

      {/* Share Result Pill Badge */}
      {!isUser && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShareOpen(true)}
          className="h-7 px-2.5 gap-1.5 text-xs rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40 active:scale-95 transition-all"
          title="Share result card"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Card</span>
        </Button>
      )}
      {!isUser && (
        <ShareResultCard open={shareOpen} onOpenChange={setShareOpen} answer={message} question={question} />
      )}

      {/* Good/Bad Feedback Buttons */}
      {!isUser && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback('good')}
            disabled={isSubmitting}
            className={cn(
              "h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all",
              feedback === 'good' && "text-green-500 hover:text-green-500"
            )}
            title="Good response"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback('bad')}
            disabled={isSubmitting}
            className={cn(
              "h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all",
              feedback === 'bad' && "text-red-500 hover:text-red-500"
            )}
            title="Bad response"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
        </>
      )}

      {/* Regenerate Button */}
      {!isUser && onRegenerate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRegenerate}
          className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all"
          title="Regenerate response"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* More Options Menu */}
      {!isUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all"
              title="More options"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-2xl border border-border shadow-xl p-1.5">
            <DropdownMenuItem onClick={handleReadAloud} className="gap-2.5 cursor-pointer rounded-xl text-xs sm:text-sm">
              <Volume2 className="h-4 w-4" />
              Read aloud
            </DropdownMenuItem>
            {chatId && messageId && (
              <DropdownMenuItem onClick={handlePin} className="gap-2.5 cursor-pointer rounded-xl text-xs sm:text-sm">
                <Pin className="h-4 w-4" />
                Pin message
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleShare} className="gap-2.5 cursor-pointer rounded-xl text-xs sm:text-sm">
              <Share2 className="h-4 w-4" />
              Share text
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem onClick={handleReport} className="gap-2.5 cursor-pointer rounded-xl text-xs sm:text-sm text-destructive focus:text-destructive">
              <Flag className="h-4 w-4" />
              Report message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Edit Button (User Message Only) */}
      {isUser && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95 transition-all"
          title="Edit message"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};
