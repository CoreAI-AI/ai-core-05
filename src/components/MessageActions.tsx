import { useState } from 'react';
import { Copy, Check, RotateCcw, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MessageActionsProps {
  message: string;
  isUser: boolean;
  onRegenerate?: () => void;
  onEdit?: () => void;
  className?: string;
}

export const MessageActions = ({ 
  message, 
  isUser, 
  onRegenerate, 
  onEdit,
  className 
}: MessageActionsProps) => {
  const [copied, setCopied] = useState(false);

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
