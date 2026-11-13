import { useState, useRef, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Image as ImageIcon, 
  File as FileIcon, 
  Camera, 
  Search, 
  GraduationCap, 
  Code, 
  Mic, 
  Square, 
  Plus, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { chatMessageSchema, validateFile, sanitizeInput } from "@/lib/validation";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onFileSelect?: (file: File) => void;
  onModeChange?: (mode: 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework') => void;
  editingMessage?: {
    id: string;
    content: string;
    index: number;
  } | null;
  onCancelEdit?: () => void;
  onTypingChange?: (isTyping: boolean) => void;
  isPremium?: boolean;
  onModelChange?: (model: string) => void;
}

export const ChatInput = memo(({
  onSendMessage,
  disabled,
  onFileSelect,
  onModeChange,
  editingMessage,
  onCancelEdit,
  onTypingChange,
  isPremium,
  onModelChange,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const anyFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [message]);

  useEffect(() => {
    onTypingChange?.(message.length > 0);
  }, [message, onTypingChange]);

  const { isRecording, transcribing, startRecording, stopRecording } = useVoiceRecorder();

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(8);
    }
  };

  const handleVoiceRecording = async () => {
    triggerHaptic();
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      triggerHaptic();
      const sanitized = sanitizeInput(message.trim());
      const validation = chatMessageSchema.safeParse({ content: sanitized });
      if (!validation.success) {
        toast.error("Message is too long or contains invalid characters");
        return;
      }
      onSendMessage(sanitized);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      try {
        validateFile(file);
        onFileSelect(file);
        toast.success(`Selected file: ${file.name}`);
      } catch (err: any) {
        toast.error(err.message || "Invalid file format");
      }
    }
  };

  const openGallery = () => {
    triggerHaptic();
    fileInputRef.current?.click();
  };

  const openFileExplorer = () => {
    triggerHaptic();
    anyFileInputRef.current?.click();
  };

  const openCamera = async () => {
    triggerHaptic();
    try {
      const image = await CapCamera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      if (image.webPath && onFileSelect) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new (window as any).File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        validateFile(file);
        onFileSelect(file);
        toast.success("Photo captured!");
      }
    } catch (error: any) {
      if (!error.message?.includes('User cancelled')) {
        fileInputRef.current?.click();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={anyFileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.txt,.csv"
        className="hidden"
      />

      <div className="relative flex items-end gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-muted/40 hover:bg-muted/60 focus-within:bg-background border border-border/60 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 rounded-3xl transition-all duration-200 shadow-sm">
        {/* Attachment menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 flex-shrink-0"
              disabled={disabled}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl p-1 shadow-lg">
            <DropdownMenuItem onClick={openGallery} className="gap-2.5 rounded-lg cursor-pointer text-xs">
              <ImageIcon className="h-4 w-4 text-cyan-500" />
              <span>Upload Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openCamera} className="gap-2.5 rounded-lg cursor-pointer text-xs">
              <Camera className="h-4 w-4 text-purple-500" />
              <span>Take Photo</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openFileExplorer} className="gap-2.5 rounded-lg cursor-pointer text-xs">
              <FileIcon className="h-4 w-4 text-blue-500" />
              <span>Attach Document</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onModeChange?.('deep-search')} className="gap-2.5 rounded-lg cursor-pointer text-xs">
              <Search className="h-4 w-4 text-emerald-500" />
              <span>Deep Research</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onModeChange?.('code')} className="gap-2.5 rounded-lg cursor-pointer text-xs">
              <Code className="h-4 w-4 text-orange-500" />
              <span>Code Mode</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onModeChange?.('study')} className="gap-2.5 rounded-lg cursor-pointer text-xs">
              <GraduationCap className="h-4 w-4 text-indigo-500" />
              <span>Study Mode</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Input text field */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask CoreAI anything..."
          disabled={disabled || transcribing}
          rows={1}
          className="flex-1 min-h-[38px] max-h-[160px] resize-none border-0 bg-transparent p-2 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 leading-relaxed"
        />

        {/* Voice recording button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleVoiceRecording}
          disabled={disabled || transcribing}
          className={`h-9 w-9 rounded-full transition-all flex-shrink-0 ${
            isRecording 
              ? "bg-destructive text-destructive-foreground animate-pulse" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
          }`}
        >
          {transcribing ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : isRecording ? (
            <Square className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        {/* Send or Edit Cancel button */}
        {editingMessage ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            className="text-xs h-9 px-3 rounded-full text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || disabled}
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:pointer-events-none transition-all flex-shrink-0 shadow-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
});

ChatInput.displayName = "ChatInput";
