import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock = ({ code, language, className }: CodeBlockProps) => {
  const [copyState, setCopyState] = useState<"idle" | "loading" | "success">("idle");

  const handleCopy = async () => {
    if (copyState !== "idle") return;
    setCopyState("loading");
    try {
      await Promise.all([
        navigator.clipboard.writeText(code),
        new Promise(r => setTimeout(r, 400))
      ]);
      setCopyState("success");
      toast.success('Code copied to clipboard! ✓');
      setTimeout(() => setCopyState("idle"), 1400);
    } catch (err) {
      setCopyState("idle");
      toast.error('Failed to copy');
    }
  };

  return (
    <div className={cn("relative group my-3", className)}>
      {/* Header with language and animated copy button */}
      <div className="flex items-center justify-between bg-muted/80 rounded-t-lg px-4 py-2 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          disabled={copyState !== "idle"}
          className={cn(
            "h-7 px-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
            copyState === "idle" && "text-muted-foreground hover:text-foreground hover:bg-muted/70 active:scale-95",
            copyState === "loading" && "bg-orange-500 text-white cursor-not-allowed scale-95",
            copyState === "success" && "bg-emerald-500 text-white cursor-default scale-100 shadow-xs"
          )}
        >
          {copyState === "idle" && (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy code</span>
            </>
          )}
          {copyState === "loading" && (
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.6, repeat: Infinity }}>
              Copying...
            </motion.span>
          )}
          {copyState === "success" && (
            <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Copied! ✓</span>
            </motion.span>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <div className="bg-muted/50 rounded-b-lg overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  );
};
