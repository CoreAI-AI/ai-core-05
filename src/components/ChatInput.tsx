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
  PiggyBank,
  Sparkles
} from "lucide-react";
import { FeaturesModal, CoreAIFeatureItem } from "@/components/FeaturesModal";
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
  currentMode?: ModeType;
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

const placeholderPrompts: string[] = [
  "How can CoreAI help you today?",
  "Ask anything or solve a complex problem...",
  "Write clean code in React, Python or C++...",
  "Summarize an article, PDF or long document...",
  "Draft a professional email, blog or essay...",
  "Plan your daily routine, workout or budget...",
  "Explain quantum physics in simple terms...",
  "Brainstorm unique ideas for your next project...",
  "Suggest healthy recipes with what you have...",
  "Translate or learn any language with ease..."
];

export const ChatInput = memo(({
  onSendMessage,
  disabled,
  onFileSelect,
  onFilesSelect,
  onModeChange,
  currentMode: propsCurrentMode,
  editingMessage,
  onCancelEdit,
  onTypingChange,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [currentMode, setCurrentMode] = useState<ModeType>("normal");
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  
  useEffect(() => {
    if (propsCurrentMode && propsCurrentMode !== currentMode) {
      setCurrentMode(propsCurrentMode);
    }
  }, [propsCurrentMode]);

  const [placeholderText, setPlaceholderText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const anyFileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (message.length > 0) return;

    const currentPhrase = placeholderPrompts[promptIndex % placeholderPrompts.length];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (placeholderText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setPlaceholderText(currentPhrase.slice(0, placeholderText.length + 1));
        }, 55);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (placeholderText.length > 0) {
        timer = setTimeout(() => {
          setPlaceholderText(currentPhrase.slice(0, placeholderText.length - 1));
        }, 28);
      } else {
        setIsDeleting(false);
        setPromptIndex((prev) => (prev + 1) % placeholderPrompts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, promptIndex, message.length]);

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
    if (typeof window !== "undefined" && "vibrate" in navigator) {
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
        toast.error(`${file.name}: ${err.message || "Invalid file"}`);
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
      {/* Hidden File Inputs — multiple enabled up to 8 */}
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

      {/* Smooth Glitch-Free Input Container */}
      <div className="relative bg-card/95 dark:bg-[#1A1A18]/95 backdrop-blur-md border border-border/70 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm hover:border-foreground/25 focus-within:border-foreground/35 dark:focus-within:border-white/25 focus-within:shadow-md transition-colors duration-200 p-2 sm:p-2.5">
        
        {/* Top Textarea with Animated Typewriter Placeholder */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText ? `${placeholderText}|` : "Ask CoreAI..."}
          disabled={disabled}
          rows={1}
          className="w-full min-h-[44px] max-h-[160px] resize-none border-0 bg-transparent px-2 pt-1 pb-2 text-sm sm:text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none transition-all duration-75"
        />

        {/* Bottom Ergonomic Action Bar — Only Single Clean Bar */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-border/30 dark:border-white/5">
          {/* Left Actions: + Menu & Modes Pill */}
          <div className="flex items-center gap-1.5">
            {/* Attachment Menu (+) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all cursor-pointer"
                  title="Attach up to 8 images or files"
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
                  Camera (Take Photo)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => anyFileInputRef.current?.click()} className="rounded-xl cursor-pointer text-xs py-2">
                  <FileIcon className="h-4 w-4 mr-2.5 text-amber-500" />
                  File (Document / PDF)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CoreAI Mode Pill with Logo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 gap-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all cursor-pointer"
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
              <DropdownMenuContent align="start" className="w-60 p-1.5 rounded-2xl bg-popover border border-border/80 shadow-xl z-50">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  CoreAI Modes ({availableModes.length})
                </div>
                {/* Scrollable Container with explicit touch-pan-y so all 11 modes can be smoothly scrolled */}
                <div className="max-h-[260px] overflow-y-auto overscroll-contain touch-pan-y pr-1 space-y-0.5">
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
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Features Button right next to Mode Pill */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowFeaturesModal(true)}
              className="h-7 px-2.5 gap-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border/50 hover:border-emerald-500/40 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
              title="Open CoreAI Features"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Features</span>
            </Button>
          </div>

          {/* Right Actions: Mic + Send Button */}
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

            <Button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!message.trim() || disabled}
              className={`h-8 w-8 rounded-full p-0 transition-all duration-150 flex items-center justify-center shrink-0 ${
                message.trim() && !disabled
                  ? "bg-foreground text-background hover:opacity-90 active:scale-90 shadow-2xs cursor-pointer"
                  : "bg-muted/50 text-muted-foreground/30 cursor-not-allowed"
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

      {/* Uploaded Design Matched Features Pop-up */}
      <FeaturesModal
        isOpen={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
        onSelectFeature={(feature: CoreAIFeatureItem) => {
          onSendMessage(feature.prompt);
          setShowFeaturesModal(false);
          toast.success(`${feature.label} activated!`);
        }}
      />
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
