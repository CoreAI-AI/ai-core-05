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
  Plus, 
  Loader2,
  Sparkles,
  Brain,
  FileText,
  ChevronDown,
  BookOpen,
  Utensils,
  TrendingUp,
  PiggyBank
} from "lucide-react";
import { toast } from "sonner";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { chatMessageSchema, validateFile, sanitizeInput } from "@/lib/validation";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

type ModeType = 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onFileSelect?: (file: File) => void;
  onModeChange?: (mode: ModeType) => void;
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

// All 11 CoreAI Modes
const availableModes: { id: ModeType; label: string; icon: any; color: string }[] = [
  { id: 'normal', label: 'Auto (Normal)', icon: Sparkles, color: 'text-primary' },
  { id: 'deep-search', label: 'Deep Search', icon: Search, color: 'text-blue-500' },
  { id: 'code', label: 'Code Assistant', icon: Code, color: 'text-purple-500' },
  { id: 'study', label: 'Study Notes', icon: BookOpen, color: 'text-emerald-500' },
  { id: 'homework', label: 'Homework Helper', icon: GraduationCap, color: 'text-amber-500' },
  { id: 'photo', label: 'Image Studio', icon: ImageIcon, color: 'text-cyan-500' },
  { id: 'creative', label: 'Creative Writing', icon: Brain, color: 'text-pink-500' },
  { id: 'analyze', label: 'Analyze & Summarize', icon: FileText, color: 'text-indigo-500' },
  { id: 'recipe', label: 'Recipe & Cooking', icon: Utensils, color: 'text-orange-500' },
  { id: 'rich', label: 'Rich Mode (Wealth)', icon: TrendingUp, color: 'text-emerald-400' },
  { id: 'poor', label: 'Poor Mode (Savings)', icon: PiggyBank, color: 'text-teal-400' },
];

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
  const [currentMode, setCurrentMode] = useState<ModeType>("normal");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const anyFileInputRef = useRef<HTMLInputElement>(null);

  // Logo animation / app open hone par direct chatbar focus hona (ChatGPT style)
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  // Smooth auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollH = textareaRef.current.scrollHeight;
      const nextHeight = Math.min(Math.max(scrollH, 38), 140);
      textareaRef.current.style.height = `${nextHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    onTypingChange?.(message.length > 0);
  }, [message, onTypingChange]);

  const { isRecording, transcribing, startRecording, stopRecording } = useVoiceRecorder();

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
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

  const handleSelectMode = (modeId: ModeType, modeLabel: string) => {
    setCurrentMode(modeId);
    onModeChange?.(modeId);
    toast.info(`Mode set to ${modeLabel}`);
  };

  const activeModeConfig = availableModes.find((m) => m.id === currentMode) || availableModes[0];

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-1.5 sm:px-3">
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

      {/* Medium Size Ergonomic Composer Box */}
      <div className="relative bg-card/95 border border-border/80 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm p-1.5 sm:p-2 transition-all duration-150 focus-within:border-primary/60 focus-within:shadow-md">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* + Attachment Menu (Medium Size) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 shrink-0 flex items-center justify-center transition-colors"
                title="Attach photo, camera, or file"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-2xl bg-popover border border-border/80 shadow-xl z-50">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="rounded-xl cursor-pointer text-xs py-2">
                <ImageIcon className="h-4 w-4 mr-2.5 text-cyan-500" />
                Photo (Gallery)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTakePhoto} className="rounded-xl cursor-pointer text-xs py-2">
                <Camera className="h-4 w-4 mr-2.5 text-emerald-500" />
                Camera (Take Photo)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => anyFileInputRef.current?.click()} className="rounded-xl cursor-pointer text-xs py-2">
                <FileIcon className="h-4 w-4 mr-2.5 text-amber-500" />
                File (Document)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Modes Pill (Medium Size, Comfortable Tap Target) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-9 px-2.5 sm:px-3 gap-1.5 rounded-full text-xs font-medium bg-muted/50 hover:bg-muted text-foreground/90 shrink-0 border border-border/60 transition-all"
                title="Select Mode"
              >
                <activeModeConfig.icon className={`h-3.5 w-3.5 ${activeModeConfig.color}`} />
                <span className="hidden xs:inline sm:inline max-w-[80px] sm:max-w-none truncate">{activeModeConfig.label.split(' ')[0]}</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 max-h-[320px] overflow-y-auto p-1.5 rounded-2xl bg-popover border border-border/80 shadow-xl z-50">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                All 11 Modes
              </div>
              {availableModes.map((m) => (
                <DropdownMenuItem
                  key={m.id}
                  onClick={() => handleSelectMode(m.id, m.label)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer text-xs ${
                    currentMode === m.id ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                    <span>{m.label}</span>
                  </div>
                  {currentMode === m.id && <span className="text-[10px] text-primary font-semibold">Active</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Textarea (Clear and Roomy) */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message CoreAI..."
            disabled={disabled}
            rows={1}
            className="flex-1 min-h-[38px] max-h-[140px] resize-none border-0 bg-transparent py-2 px-1 text-sm sm:text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />

          {/* Microphone (Medium Size) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleVoiceRecording}
            disabled={disabled || transcribing}
            className={`h-9 w-9 rounded-full shrink-0 transition-all ${
              isRecording ? 'bg-destructive/20 text-destructive animate-pulse' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            {transcribing ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Mic className="h-4.5 w-4.5" />
            )}
          </Button>

          {/* Send Button (Medium Size with CoreAI Gradient) */}
          <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!message.trim() || disabled}
            className="h-9 w-9 rounded-full p-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:opacity-90 text-white shrink-0 shadow-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:scale-95"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Powered by Tagline */}
      <div className="text-center mt-1">
        <p className="text-[10px] sm:text-[11px] text-muted-foreground tracking-tight">
          Powered by <span className="font-semibold text-foreground/80">CoreAI</span> • Fast, intelligent, reliable
        </p>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
