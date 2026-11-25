import { useState, useRef, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
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
import { allCoreAiFeatures } from "@/components/FeaturesModal";
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

// Unique color badges & descriptions for each CoreAI Feature
const featureCardStyles: Record<string, { bg: string; border: string; desc: string }> = {
  'doc-reader': { bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30', border: 'hover:border-blue-500/50 hover:bg-blue-500/10', desc: 'Summarize & Q&A' },
  'quiz-maker': { bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30', border: 'hover:border-purple-500/50 hover:bg-purple-500/10', desc: 'Flashcards & Test' },
  'mock-interview': { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', border: 'hover:border-amber-500/50 hover:bg-amber-500/10', desc: 'Practice Job Roles' },
  'startup-incubator': { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', border: 'hover:border-emerald-500/50 hover:bg-emerald-500/10', desc: 'SWOT & Roadmap' },
  'decision-matrix': { bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', border: 'hover:border-cyan-500/50 hover:bg-cyan-500/10', desc: 'Pros & Cons Matrix' },
  'prompt-vault': { bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', border: 'hover:border-indigo-500/50 hover:bg-indigo-500/10', desc: 'Optimize Prompts' },
  'mood-journal': { bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30', border: 'hover:border-rose-500/50 hover:bg-rose-500/10', desc: 'Mind & Empathy Space' },
  'language-partner': { bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30', border: 'hover:border-orange-500/50 hover:bg-orange-500/10', desc: 'Grammar & Vocab' },
  'voice-walkie': { bg: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30', border: 'hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10', desc: 'Spoken Voice Chat' },
  'debate-arena': { bg: 'bg-red-500/15 text-red-400 border-red-500/30', border: 'hover:border-red-500/50 hover:bg-red-500/10', desc: 'Pro vs Con Verdict' },
  'future-you': { bg: 'bg-teal-500/15 text-teal-400 border-teal-500/30', border: 'hover:border-teal-500/50 hover:bg-teal-500/10', desc: 'Time Capsule Chat' },
  'code-assistant': { bg: 'bg-lime-500/15 text-lime-400 border-lime-500/30', border: 'hover:border-lime-500/50 hover:bg-lime-500/10', desc: 'Write & Debug Code' },
};

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
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
            {/* Attachment Menu (+) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all cursor-pointer shrink-0"
                  title="Attach up to 8 images or files"
                >
                  <Plus className="h-5 w-5 stroke-[2]" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-1.5 rounded-2xl bg-popover border border-border/70 shadow-xl z-50">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="rounded-xl cursor-pointer text-sm py-2.5 transition-colors">
                  <ImageIcon className="h-4 w-4 mr-2.5 text-cyan-500" />
                  Photos (Up to 8 Images)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTakePhoto} className="rounded-xl cursor-pointer text-sm py-2.5 transition-colors">
                  <Camera className="h-4 w-4 mr-2.5 text-emerald-500" />
                  Camera (Take Photo)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => anyFileInputRef.current?.click()} className="rounded-xl cursor-pointer text-sm py-2.5 transition-colors">
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
                  className="h-9 px-2 sm:px-3.5 gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border/50 transition-all cursor-pointer shrink-0"
                  title="Change CoreAI Mode"
                >
                  {activeModeConfig.id === 'normal' ? (
                    <img src={coreaiLogo} alt="CoreAI" className="h-5 w-5 rounded-full object-contain shrink-0" />
                  ) : (
                    <activeModeConfig.icon className={`h-5 w-5 ${activeModeConfig.color}`} />
                  )}
                  <span className="truncate max-w-[80px] sm:max-w-[110px]">{activeModeConfig.label.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-64 p-1.5 rounded-2xl bg-popover border border-border/80 shadow-xl z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  CoreAI Modes ({availableModes.length})
                </div>
                {/* Scrollable Container with explicit touch-pan-y so all 11 modes can be smoothly scrolled */}
                <div className="max-h-[280px] overflow-y-auto overscroll-contain touch-pan-y pr-1 space-y-0.5">
                  {availableModes.map((m) => (
                    <DropdownMenuItem
                      key={m.id}
                      onClick={() => handleSelectMode(m.id, m.label)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-sm ${
                        currentMode === m.id ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {m.id === 'normal' ? (
                          <img src={coreaiLogo} alt="CoreAI" className="h-4 w-4 rounded-full object-contain shrink-0" />
                        ) : (
                          <m.icon className={`h-4 w-4 ${m.color}`} />
                        )}
                        <span>{m.label}</span>
                      </div>
                      {currentMode === m.id && <span className="text-xs text-primary font-semibold">Active</span>}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

{/* CoreAI Features Dropdown - Rich Colorful Mini-Cards */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
        <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-9 px-2 sm:px-3.5 gap-1 sm:gap-2 rounded-full text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border/50 hover:border-emerald-500/40 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.25)] transition-all cursor-pointer shrink-0"
      title="Open CoreAI Features"
    >
      <Sparkles className="h-4 w-4 text-emerald-400" />
      <span className="hidden sm:inline">Features</span>
      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
    </Button>

  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-[320px] sm:w-[420px] p-2.5 rounded-2xl bg-popover/95 backdrop-blur-xl border border-border/80 shadow-2xl z-50">
    <div className="flex items-center justify-between px-2 py-1 mb-1.5 border-b border-border/40 pb-1.5">
      <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        CoreAI Features
      </span>
      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
        {allCoreAiFeatures.length} Cards
      </span>
    </div>
    {/* Smooth Scrollable 2-Column Card Grid */}
    <div className="max-h-[310px] overflow-y-auto overscroll-contain touch-pan-y pr-1 space-y-1.5 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-1.5">
      {allCoreAiFeatures.map((f) => {
        const style = featureCardStyles[f.id] || {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          border: 'hover:border-emerald-500/50 hover:bg-emerald-500/10',
          desc: 'Specialized feature'
        };
        return (
          <DropdownMenuItem
            key={f.id}
            onClick={() => {
              onSendMessage(f.prompt);
              toast.success(`${f.label} activated!`);
            }}
            className={cn(
              "flex items-start gap-2 p-2 rounded-xl cursor-pointer transition-all border text-left",
              "bg-card/60 hover:bg-muted/80 text-foreground",
              style.border,
              "hover:-translate-y-0.5 active:translate-y-0"
            )}
          >
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 shadow-xs", style.bg)}>
              <f.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs text-foreground truncate">{f.label}</div>
              <div className="text-[9px] text-muted-foreground truncate">{style.desc}</div>
            </div>
          </DropdownMenuItem>
        );
      })}
    </div>
  </DropdownMenuContent>
</DropdownMenu>

          </div>

          {/* Right Actions: Mic + Send Button */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleVoiceRecording}
              disabled={disabled || transcribing}
              className={`h-9 w-9 rounded-full shrink-0 transition-all ${
                isRecording ? 'bg-destructive/20 text-destructive animate-pulse' : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {transcribing ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>

            <Button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!message.trim() || disabled}
              className={`h-9 w-9 rounded-full p-0 transition-all duration-150 flex items-center justify-center shrink-0 ${
                message.trim() && !disabled
                  ? "bg-foreground text-background hover:opacity-90 active:scale-90 shadow-2xs cursor-pointer"
                  : "bg-muted/50 text-muted-foreground/30 cursor-not-allowed"
              }`}
              title="Send message"
            >
              <ArrowUp className="h-5 w-5 stroke-[2.5]" />
            </Button>
          </div>
        </div>
      </div>

            {/* Powered by Tagline */}
            <div className="text-center mt-2">
        <p className="text-xs text-muted-foreground/85 tracking-normal">
          CoreAI can make mistakes. Verify important information.
        </p>
      </div>

      {/* Uploaded Design Matched Features Pop-up */}
      
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
