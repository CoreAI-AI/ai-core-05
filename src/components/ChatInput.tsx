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
  onFilesSelect?: (files: File[]) => void;
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

const typewriterPrompts = [
  "Message CoreAI...",
  "Ask anything or type a prompt...",
  "Upload images to analyze or compare...",
  "Generate code or debug an error...",
  "Summarize articles and documents...",
  "Brainstorm ideas for your next project...",
  "Switch modes from the menu below...",
  "Plan travel or healthy recipes...",
  "Study notes and exam preparation...",
  "Ask in Hindi, English, or any language..."
];

export const ChatInput = memo(({
  onSendMessage,
  disabled,
  onFileSelect,
  onFilesSelect,
  onModeChange,
  editingMessage,
  onCancelEdit,
  onTypingChange,
  isPremium,
  onModelChange,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [currentMode, setCurrentMode] = useState<ModeType>('normal');
  const [placeholderText, setPlaceholderText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const anyFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  useEffect(() => {
    onTypingChange?.(message.length > 0);
  }, [message, onTypingChange]);

  useEffect(() => {
    if (message.length > 0) return;

    const currentPrompt = typewriterPrompts[promptIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (placeholderText.length < currentPrompt.length) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentPrompt.slice(0, placeholderText.length + 1));
        }, 55);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (placeholderText.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentPrompt.slice(0, placeholderText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % typewriterPrompts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, promptIndex, message]);

  const { isRecording, isProcessing: isVoiceProcessing, startRecording, stopRecording } = useVoiceRecorder({
    onTranscriptionComplete: (text) => {
      setMessage((prev) => (prev ? `${prev} ${text}` : text));
      toast.success("Voice transcribed");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
      }
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const handleSubmit = () => {
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

  // Fixed Multiple files selection handler (up to 8 images)
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files;
    if (!rawFiles || rawFiles.length === 0) return;

    const fileList = Array.from(rawFiles);
    const validFiles: File[] = [];

    for (const file of fileList) {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (err: any) {
        toast.error(`${file.name}: ${err?.message || "Invalid file"}`);
      }
    }

    if (validFiles.length > 0) {
      if (onFilesSelect) {
        onFilesSelect(validFiles);
      } else if (onFileSelect) {
        onFileSelect(validFiles[0]);
      }
    }

    e.target.value = '';
  };

  const handleTakePhoto = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        if (onFilesSelect) {
          onFilesSelect([file]);
        } else if (onFileSelect) {
          onFileSelect(file);
        }
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
        onChange={handleMultipleFilesChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={anyFileInputRef}
        onChange={handleMultipleFilesChange}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />

      <div className="relative bg-card/95 dark:bg-[#1A1A18]/95 backdrop-blur-md border border-border/70 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm hover:scale-[1.008] hover:border-foreground/25 hover:shadow-md focus-within:scale-[1.008] focus-within:border-foreground/40 focus-within:ring-2 focus-within:ring-foreground/20 focus-within:ring-offset-2 focus-within:ring-offset-background focus-within:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] p-2 sm:p-2.5">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText || "Message CoreAI..."}
          disabled={disabled || isRecording || isVoiceProcessing}
          rows={1}
          className="w-full min-h-[44px] max-h-[180px] px-2.5 py-1.5 text-sm sm:text-[15px] bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none placeholder:text-muted-foreground/60 leading-relaxed font-normal"
        />

        <div className="flex items-center justify-between pt-1 mt-1 border-t border-border/40">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
                  title="Attach photos, camera, or files"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 p-1.5 rounded-2xl bg-popover border border-border/70 shadow-xl z-50">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="rounded-xl cursor-pointer text-xs py-2">
                  <ImageIcon className="h-4 w-4 mr-2.5 text-cyan-500" />
                  Photos (Up to 8 Images)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTakePhoto} className="rounded-xl cursor-pointer text-xs py-2">
                  <Camera className="h-4 w-4 mr-2.5 text-emerald-500" />
                  Take Camera Photo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => anyFileInputRef.current?.click()} className="rounded-xl cursor-pointer text-xs py-2">
                  <FileIcon className="h-4 w-4 mr-2.5 text-purple-500" />
                  Attach Document / File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 sm:h-7.5 px-2.5 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-medium flex items-center gap-1.5 transition-all duration-200"
                >
                  {activeModeConfig.id === 'normal' ? (
                    <img 
                      src={coreaiLogo} 
                      alt="CoreAI" 
                      className="h-3.5 w-3.5 object-contain rounded-full shrink-0" 
                    />
                  ) : activeModeConfig.icon ? (
                    <activeModeConfig.icon className={`h-3.5 w-3.5 ${activeModeConfig.color} shrink-0`} />
                  ) : null}
                  <span className="truncate max-w-[95px] sm:max-w-[120px]">{activeModeConfig.label}</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1.5 rounded-2xl bg-popover border border-border/70 shadow-xl z-50 max-h-72 overflow-y-auto">
                {availableModes.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => handleSelectMode(m.id, m.label)}
                    className={`rounded-xl cursor-pointer text-xs py-2 flex items-center justify-between ${
                      currentMode === m.id ? 'bg-muted font-medium' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {m.id === 'normal' ? (
                        <img 
                          src={coreaiLogo} 
                          alt="CoreAI" 
                          className="h-4 w-4 object-contain rounded-full shrink-0" 
                        />
                      ) : (
                        <m.icon className={`h-4 w-4 ${m.color}`} />
                      )}
                      <span>{m.label}</span>
                    </div>
                    {currentMode === m.id && (
                      <span className="text-[10px] text-primary">Active</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled || isVoiceProcessing}
              className={`h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full transition-all duration-200 ${
                isRecording 
                  ? "bg-red-500 text-white animate-pulse hover:bg-red-600" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
              title={isRecording ? "Stop voice" : "Voice input"}
            >
              {isVoiceProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={disabled || !message.trim()}
              size="icon"
              className={`h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full transition-all duration-200 shrink-0 ${
                message.trim() && !disabled
                  ? "bg-foreground text-background hover:opacity-90 shadow-xs"
                  : "bg-muted text-muted-foreground/40 cursor-not-allowed"
              }`}
              title="Send message"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
