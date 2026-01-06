import { useState } from 'react';
import { Copy, Check, RotateCcw, Pencil, ThumbsUp, ThumbsDown, MoreHorizontal, Volume2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MessageActionsProps {
  message: string;
  isUser: boolean;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onReadAloud?: () => void;
  className?: string;
}

export const MessageActions = ({ 
  message, 
  isUser, 
  onRegenerate, 
  onEdit,
  onReadAloud,
  className 
}: MessageActionsProps) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);

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

  const handleGoodResponse = () => {
    setFeedback('good');
    toast.success('Thanks for your feedback!');
  };

  const handleBadResponse = () => {
    setFeedback('bad');
    toast.success('Thanks for your feedback!');
  };

  const handleReadAloud = () => {
    if (onReadAloud) {
      onReadAloud();
    } else {
      // Fallback to browser speech synthesis
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
      toast.success('Reading aloud...');
    }
  };

  const handleReport = () => {
    toast.success('Message reported. Thank you for helping us improve.');
  };

  return (
    <div className={cn(
      "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
      className
    )}>
      {/* Copy button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
        title="Copy message"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>

      {/* Good/Bad response buttons (AI messages only) */}
      {!isUser && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoodResponse}
            className={cn(
              "h-7 w-7 p-0 text-muted-foreground hover:text-foreground active:scale-95 transition-transform",
              feedback === 'good' && "text-green-500 hover:text-green-500"
            )}
            title="Good response"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBadResponse}
            className={cn(
              "h-7 w-7 p-0 text-muted-foreground hover:text-foreground active:scale-95 transition-transform",
              feedback === 'bad' && "text-red-500 hover:text-red-500"
            )}
            title="Bad response"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
        </>
      )}

      {/* Regenerate button (AI messages only) */}
      {!isUser && onRegenerate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRegenerate}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
          title="Regenerate response"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}

      {/* More options menu (AI messages only) */}
      {!isUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
              title="More options"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleReadAloud} className="gap-2 cursor-pointer">
              <Volume2 className="h-4 w-4" />
              Read aloud
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReport} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <Flag className="h-4 w-4" />
              Report message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Edit button (User messages only) */}
      {isUser && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
          title="Edit message"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};
