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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !disabled) {
      triggerHaptic();
      const sanitized = sanitizeInput(message.trim());
      const validation = chatMessageSchema.safeParse({ content: sanitized });
      if (!validation.success) {
        toast.error("Please enter a valid message");
        return;
      }
      onSendMessage(sanitized);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
      onFileSelect(file);
      toast.success(`Attached ${file.name}`);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath && onFileSelect) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onFileSelect(file);
        toast.success("Photo attached");
      }
    } catch (error) {
      toast.error("Could not capture photo");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
      {/* Hidden File Inputs */}
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
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />

      {/* Floating Composer Card with Gradient Send Button */}
      <div className="relative bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl sm:rounded-3xl shadow-md p-1.5 sm:p-2 transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-lg">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Plus Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:m-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 shrink-0"
                title="Add attachments or modes"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-2xl bg-popover border border-border/80 shadow-xl z-50">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="rounded-xl cursor-pointer text-xs sm:text-sm">
                <ImageIcon className="h-4 w-4 mr-2 text-cyan-500" />
                Upload Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => anyFileInputRef.current?.click()} className="rounded-xl cursor-pointer text-xs sm:text-sm">
                <FileIcon className="h-4 w-4 mr-2 text-amber-500" />
                Attach Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTakePhoto} className="rounded-xl cursor-pointer text-xs sm:text-sm">
                <Camera className="h-4 w-4 mr-2 text-emerald-500" />
                Take Photo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModeChange?.('deep-search')} className="rounded-xl cursor-pointer text-xs sm:text-sm">
                <Search className="h-4 w-4 mr-2 text-blue-500" />
                Deep Search
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModeChange?.('code')} className="rounded-xl cursor-pointer text-xs sm:text-sm">
                <Code className="h-4 w-4 mr-2 text-purple-500" />
                Code Assistant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text Area Input */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message CoreAI..."
            disabled={disabled}
            rows={1}
            className="flex-1 min-h-[36px] max-h-[140px] resize-none border-0 bg-transparent p-1.5 sm:p-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />

          {/* Microphone Voice Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleVoiceRecording}
            disabled={disabled || transcribing}
            className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0 transition-all ${
              isRecording ? 'bg-destructive/20 text-destructive animate-pulse' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            {transcribing ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          {/* Purple-Blue Gradient Send Button (Matching Screenshot) */}
          <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!message.trim() || disabled}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl sm:rounded-2xl p-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:opacity-90 text-white shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Powered by Tagline at Bottom */}
      <div className="text-center mt-2">
        <p className="text-[11px] text-muted-foreground tracking-tight">
          Powered by <span className="font-semibold text-foreground/80">CoreAI</span> • Fast, intelligent, reliable
        </p>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
