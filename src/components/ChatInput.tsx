import { useState, useRef, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowUp,
  Image as ImageIcon, 
  File as FileIcon, 
  Camera, 
  Search, 
  GraduationCap, 
  Code, 
  Mic, 
  Plus, 
  Loader2,
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
import coreaiLogo from "@/assets/coreai-logo.png";

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
  { id: 'normal', label: 'Auto (Normal)', icon: null, color: 'text-primary' },
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

  // Auto-focus after splash
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
      const nextHeight = Math.min(Math.max(scrollH, 44), 160);
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
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-3">
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

      {/* Claude Signature Floating Box Container */}
      <div className="relative bg-card/90 dark:bg-[#1E1E1C]/90 border border-border/70 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 p-2 sm:p-2.5">
        
        {/* Top Textarea Area */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="How can CoreAI help you today?"
          disabled={disabled}
          rows={1}
          className="w-full min-h-[44px] max-h-[160px] resize-none border-0 bg-transparent px-2 pt-1 pb-2 text-sm sm:text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />

        {/* Bottom Ergonomic Action Bar */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-border/30 dark:border-white/5">
          {/* Left Actions: Attach + Mode Selector */}
          <div className="flex items-center gap-1">
            {/* Attachment Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 shrink-0 transition-colors"
                  title="Attach file or photo"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-2xl bg-popover border border-border/70 shadow-xl z-50">
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

            {/* CoreAI Mode Pill with Logo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-7 px-2.5 gap-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/40 transition-all"
                  title="Change CoreAI Mode"
                >
                  {activeModeConfig.id === 'normal' ? (
                    <img src={coreaiLogo} alt="CoreAI" className="h-3.5 w-3.5 rounded-full object-contain shrink-0" />
                  ) : (
                    <activeModeConfig.icon className={`h-3.5 w-3.5 ${activeModeConfig.color}`} />
                  )}
                  <span className="truncate max-w-[90px]">{activeModeConfig.label.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-[300px] overflow-y-auto p-1.5 rounded-2xl bg-popover border border-border/80 shadow-xl z-50">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  CoreAI Modes
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
                      {m.id === 'normal' ? (
                        <img src={coreaiLogo} alt="CoreAI" className="h-3.5 w-3.5 rounded-full object-contain shrink-0" />
                      ) : (
                        <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                      )}
                      <span>{m.label}</span>
                    </div>
                    {currentMode === m.id && <span className="text-[10px] text-primary font-semibold">Active</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Actions: Mic + Claude Squircle Send Button */}
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleVoiceRecording}
              disabled={disabled || transcribing}
              className={`h-8 w-8 rounded-full shrink-0 transition-all ${
                isRecording ? 'bg-destructive/20 text-destructive animate-pulse' : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {transcribing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            {/* Claude-style Rounded Squircle Send Button */}
            <Button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!message.trim() || disabled}
              className={`h-8 w-8 rounded-xl p-0 transition-all flex items-center justify-center shrink-0 ${
                message.trim() && !disabled
                  ? "bg-foreground text-background hover:opacity-90 shadow-xs scale-100"
                  : "bg-muted/60 text-muted-foreground/40 cursor-not-allowed scale-95"
              }`}
              title="Send message"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Powered by Tagline */}
      <div className="text-center mt-1.5">
        <p className="text-[10px] text-muted-foreground/80 tracking-tight">
          CoreAI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
