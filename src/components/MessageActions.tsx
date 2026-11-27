import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  Volume2, 
  MoreHorizontal,
  Pin,
  Share2,
  Flag,
  Pencil
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ShareResultCard } from "@/components/ShareResultCard";
import { useTTSPlayer } from "@/hooks/useTTSPlayer";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  message: string;
  isUser: boolean;
  messageId?: string;
  chatId?: string;
  userPrompt?: string;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onPin?: () => void;
  isPinned?: boolean;
}

export const MessageActions = ({
  message,
  isUser,
  messageId,
  chatId,
  userPrompt,
  onRegenerate,
  onEdit,
  onPin,
  isPinned
}: MessageActionsProps) => {
  const [copyState, setCopyState] = useState<"idle" | "loading" | "success">("idle");
  const [shareOpen, setShareOpen] = useState(false);
  const [feedback, setFeedback] = useState<'good' | 'bad' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const { isPlaying, currentMessageId, play, stop } = useTTSPlayer();
  const isThisPlaying = isPlaying && currentMessageId === messageId;

  const handleRegenerateClick = () => {
    if (!onRegenerate || isSpinning) return;
    setIsSpinning(true);
    onRegenerate();
    setTimeout(() => setIsSpinning(false), 800);
  };

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
    if (copyState !== "idle") return;
    setCopyState("loading");
    try {
      await Promise.all([
        navigator.clipboard.writeText(message),
        new Promise(r => setTimeout(r, 400))
      ]);
      setCopyState("success");
      toast.success('Message copied to clipboard! ✓');
      setTimeout(() => setCopyState("idle"), 1400);
    } catch (err) {
      setCopyState("idle");
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
            message_id: messageId,
            user_id: user.id,
            feedback_type: type
          });
        setFeedback(type);
        toast.success(type === 'good' ? 'Thanks for feedback! 👍' : 'Feedback recorded');
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReadAloud = () => {
    if (isThisPlaying) {
      stop();
    } else {
      play(message, messageId);
    }
  };

  const handlePin = async () => {
    if (!messageId || !chatId) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to pin messages');
        return;
      }

      if (isPinned) {
        await supabase
          .from('pinned_messages')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id);
        toast.success('Message unpinned');
      } else {
        await supabase
          .from('pinned_messages')
          .insert({
            message_id: messageId,
            chat_id: chatId,
            user_id: user.id
          });
        toast.success('Message pinned');
      }
      onPin?.();
    } catch (error) {
      toast.error('Failed to update pin');
    }
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const handleReport = () => {
    toast.info('Thank you for reporting. We will review this response.');
  };

  return (
    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
      {/* 3-Stage Animated Copy Button */}
      <button
        onClick={handleCopy}
        disabled={copyState !== "idle"}
        className={cn(
          "h-7 px-2 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-all duration-200 cursor-pointer select-none",
          copyState === "idle" && "text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95",
          copyState === "loading" && "text-primary bg-primary/10 scale-95",
          copyState === "success" && "text-emerald-500 bg-emerald-500/10 scale-105 shadow-xs"
        )}
        title={copyState === "success" ? "Copied!" : "Copy response"}
      >
        {copyState === "idle" && (
          <>
            <Copy className="h-3.5 w-3.5 transition-transform" />
            <span className="hidden sm:inline">Copy</span>
          </>
        )}
        {copyState === "loading" && (
          <>
            <span className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="hidden sm:inline">Copying...</span>
          </>
        )}
        {copyState === "success" && (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
            <span className="font-semibold text-emerald-500">Copied! ✓</span>
          </>
        )}
      </button>

      {/* Feedback Buttons */}
      {!isUser && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback('good')}
            disabled={isSubmitting}
            className={cn(
              "h-7 w-7 p-0 rounded-full active:scale-95 transition-all",
              feedback === 'good' 
                ? 'text-primary bg-primary/10 hover:bg-primary/20' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
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
              "h-7 w-7 p-0 rounded-full active:scale-95 transition-all",
              feedback === 'bad' 
                ? 'text-destructive bg-destructive/10 hover:bg-destructive/20' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
            )}
            title="Bad response"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
        </>
      )}

      {/* Regenerate Button with 360 Spin */}
      {!isUser && onRegenerate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRegenerateClick}
          className="h-7 w-7 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-90 transition-all"
          title="Regenerate response"
        >
          <RotateCcw className={cn("h-3.5 w-3.5 transition-transform duration-700 ease-out", isSpinning && "rotate-[360deg] text-primary")} />
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
              {isThisPlaying ? (
                <span className="flex items-center gap-0.5 text-emerald-500">
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-3.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              {isThisPlaying ? 'Stop reading' : 'Read aloud'}
            </DropdownMenuItem>
            {chatId && messageId && (
              <DropdownMenuItem onClick={handlePin} className="gap-2.5 cursor-pointer rounded-xl text-xs sm:text-sm">
                <Pin className="h-4 w-4" />
                {isPinned ? 'Unpin message' : 'Pin message'}
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

      {/* Share Dialog */}
      {!isUser && (
        <ShareResultCard
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          prompt={userPrompt || ""}
          response={message}
        />
      )}
    </div>
  );
};
