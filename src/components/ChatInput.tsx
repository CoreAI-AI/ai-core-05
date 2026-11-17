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
  Check
} from "lucide-react";
import { toast } from "sonner";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { chatMessageSchema, validateFile, sanitizeInput } from "@/lib/validation";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import coreaiLogo from "@/assets/coreai-logo.png";

export type ModeType = 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework';

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

// 11 Modes with Full Intros & Dedicated Task Descriptions
const availableModes: { id: ModeType; label: string; intro: string; icon: any; color: string }[] = [
  { 
    id: 'normal', 
    label: 'Auto (Normal)', 
    intro: 'हर सवाल के लिए स्मार्ट व दोस्ताना AI — सामान्य बातचीत व सभी विषयों में मदद।', 
    icon: null, 
    color: 'text-primary' 
  },
  { 
    id: 'deep-search', 
    label: 'Deep Search', 
    intro: 'गहन रिसर्च, मल्टी-एंगल एनालिसिस व व्यवस्थित बुलेट पॉइंट्स रिपोर्ट।', 
    icon: Search, 
    color: 'text-blue-500' 
  },
  { 
    id: 'code', 
    label: 'Code Assistant', 
    intro: 'प्रोडक्शन-रेडी कोड, डिबगिंग, आर्किटेक्चर व क्लीन सिंटैक्स समाधान।', 
    icon: Code, 
    color: 'text-purple-500' 
  },
  { 
    id: 'study', 
    label: 'Study Notes', 
    intro: 'एकेडमिक समरी, फ्लैशकार्ड नोट्स, निमोनिक्स व रिवीज़न पॉइंट्स।', 
    icon: BookOpen, 
    color: 'text-emerald-500' 
  },
  { 
    id: 'homework', 
    label: 'Homework Helper', 
    intro: 'मैथ व साइंस के प्रश्नों का स्टेप-बाय-स्टेप हल + फॉर्मूला व कॉन्सेप्ट रीकैप।', 
    icon: GraduationCap, 
    color: 'text-amber-500' 
  },
  { 
    id: 'photo', 
    label: 'Image Studio', 
    intro: 'कस्टम एआई इमेजेस व आर्टिस्टिक विजुअल्स तुरंत तैयार करने का मोड।', 
    icon: ImageIcon, 
    color: 'text-cyan-500' 
  },
  { 
    id: 'creative', 
    label: 'Creative Writing', 
    intro: 'मनोरंजक कहानियाँ, कविताएँ, वीडियो स्क्रिप्ट्स, शायरी व विज्ञापन कॉपी।', 
    icon: Brain, 
    color: 'text-pink-500' 
  },
  { 
    id: 'analyze', 
    label: 'Analyze & Summarize', 
    intro: 'डेटा, रिपोर्ट्स व बड़े टेक्स्ट का मुख्य निचोड़, मेट्रिक्स व कमियां।', 
    icon: FileText, 
    color: 'text-indigo-500' 
  },
  { 
    id: 'recipe', 
    label: 'Recipe & Cooking', 
    intro: 'सटीक सामग्री माप, स्टेप-बाय-स्टेप कुकिंग विधि और शेफ सीक्रेट टिप्स।', 
    icon: Utensils, 
    color: 'text-orange-500' 
  },
  { 
    id: 'rich', 
    label: 'Rich Mode (Wealth)', 
    intro: 'अरबपति निवेशक माइंडसेट — एसेट्स, कैश-फ्लो, ROI व वेल्थ क्रिएशन रणनीति।', 
    icon: TrendingUp, 
    color: 'text-emerald-400' 
  },
  { 
    id: 'poor', 
    label: 'Poor Mode (Savings)', 
    intro: 'स्मार्ट बजटिंग, जीरो-वेस्ट सर्वाइवल हैक्स व अधिकतम पैसे बचाने की तरकीबें।', 
    icon: PiggyBank, 
    color: 'text-teal-400' 
  },
];

const typewriterPrompts = [
  "Message CoreAI...",
  "Ask anything or type a prompt...",
  "Upload up to 8 images to analyze...",
  "Generate code or debug an error...",
  "Summarize articles and documents...",
  "Brainstorm ideas for your next project...",
  "Switch modes from the menu below...",
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
  onTypingChange
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [currentMode, setCurrentMode] = useState<ModeType>('normal');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const { isRecording, isProcessing: isVoiceProcessing, startRecording, stopRecording } = useVoiceRecorder({
    onTranscriptionComplete: (text) => {
      setMessage((prev) => (prev ? `${prev} ${text}` : text));
      adjustHeight();
      textareaRef.current?.focus();
    },
  });

  // Typewriter effect
  useEffect(() => {
    if (isFocused || message) return;
    const currentFullText = typewriterPrompts[placeholderIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedPlaceholder.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayedPlaceholder(currentFullText.slice(0, displayedPlaceholder.length + 1));
        }, 40);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2400);
      }
    } else {
      if (displayedPlaceholder.length > 0) {
        timer = setTimeout(() => {
          setDisplayedPlaceholder(displayedPlaceholder.slice(0, -1));
        }, 20);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % typewriterPrompts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedPlaceholder, isDeleting, placeholderIndex, isFocused, message]);

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      adjustHeight();
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const nextHeight = Math.min(textarea.scrollHeight, 180);
    textarea.style.height = `${Math.max(nextHeight, 44)}px`;
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
    onTypingChange?.(e.target.value.length > 0);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = sanitizeInput(message).trim();
    if (!clean || disabled) return;

    try {
      chatMessageSchema.parse({ message: clean });
    } catch {
      toast.error("Message is too long or contains invalid characters");
      return;
    }

    onSendMessage(clean);
    setMessage("");
    onTypingChange?.(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Multiple files selection (up to 8 images)
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const fileList = Array.from(files);

    for (const file of fileList) {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (err: any) {
        toast.error(`"${file.name}": ${err.message || 'Validation failed'}`);
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

  const handleCameraCapture = async () => {
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
        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        try {
          validateFile(file);
          if (onFilesSelect) {
            onFilesSelect([file]);
          } else if (onFileSelect) {
            onFileSelect(file);
          }
          toast.success("Photo captured!");
        } catch (err: any) {
          toast.error(err.message || "Invalid camera photo");
        }
      }
    } catch (error) {
      toast.error("Camera capture cancelled");
    }
  };

  const handleSelectMode = (modeId: ModeType, modeLabel: string) => {
    setCurrentMode(modeId);
    onModeChange?.(modeId);
    toast.info(`Active Mode: ${modeLabel}`);
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
        ref={docInputRef}
        onChange={handleMultipleFilesChange}
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
      />

      {/* Editing Message Banner */}
      {editingMessage && (
        <div className="flex items-center justify-between mb-2 px-3 py-1.5 bg-muted/60 backdrop-blur-md rounded-xl text-xs border border-border/40">
          <span className="text-muted-foreground truncate">Editing message...</span>
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-muted-foreground hover:text-foreground ml-2 font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Floating Modern Pill Container */}
      <div 
        className={`relative rounded-3xl bg-background/95 backdrop-blur-xl border transition-all duration-200 shadow-lg ${
          isFocused 
            ? "border-primary/50 shadow-primary/5 ring-2 ring-primary/10" 
            : "border-border/60 hover:border-border/90 shadow-black/5"
        }`}
      >
        {/* Main Textarea */}
        <div className="pt-2 px-3 sm:px-4">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? "Ask CoreAI anything..." : (displayedPlaceholder || "Message CoreAI...")}
            disabled={disabled}
            rows={1}
            className="w-full resize-none border-0 bg-transparent p-0 text-sm sm:text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-none min-h-[44px] max-h-[180px] leading-relaxed"
          />
        </div>

        {/* Bottom Toolbar: Attachments, Modes & Actions */}
        <div className="flex items-center justify-between px-2.5 pb-2 pt-1 gap-1">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* Attachment Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                  title="Attach images, camera or files"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-2xl bg-popover border border-border/70 shadow-xl z-50">
                <DropdownMenuItem
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl cursor-pointer text-xs py-2 flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                  <span>Upload Images (Max 8)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCameraCapture}
                  className="rounded-xl cursor-pointer text-xs py-2 flex items-center gap-2"
                >
                  <Camera className="h-4 w-4 text-emerald-500" />
                  <span>Open Camera</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => docInputRef.current?.click()}
                  className="rounded-xl cursor-pointer text-xs py-2 flex items-center gap-2"
                >
                  <FileIcon className="h-4 w-4 text-amber-500" />
                  <span>Attach Document</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mode Selector Pill with Complete Intro & Descriptions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-xs rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1.5 border border-border/40 transition-colors"
                  title="Switch Specialized Mode"
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
                  <span className="truncate max-w-[95px] sm:max-w-[120px] font-medium">{activeModeConfig.label}</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-72 sm:w-80 p-2 rounded-2xl bg-popover/95 backdrop-blur-md border border-border/70 shadow-2xl z-50 max-h-80 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  CoreAI Specialized Modes (11)
                </div>
                {availableModes.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => handleSelectMode(m.id, m.label)}
                    className={`rounded-xl cursor-pointer py-2.5 px-2.5 flex items-start gap-2.5 transition-colors mb-0.5 ${
                      currentMode === m.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/70'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {m.id === 'normal' ? (
                        <img 
                          src={coreaiLogo} 
                          alt="CoreAI" 
                          className="h-4 w-4 object-contain rounded-full" 
                        />
                      ) : (
                        <m.icon className={`h-4 w-4 ${m.color}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-foreground truncate">{m.label}</span>
                        {currentMode === m.id && (
                          <span className="text-[10px] font-semibold text-primary shrink-0 bg-primary/15 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <Check className="h-2.5 w-2.5" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                        {m.intro}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Controls: Mic & Send */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled || isVoiceProcessing}
              className={`h-8 w-8 rounded-full transition-colors ${
                isRecording 
                  ? "bg-destructive/15 text-destructive hover:bg-destructive/25 animate-pulse" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
              title={isRecording ? "Stop voice recording" : "Voice input"}
            >
              {isVoiceProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            <Button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!message.trim() || disabled}
              size="icon"
              className={`h-8 w-8 rounded-full transition-all duration-200 ${
                message.trim() && !disabled
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  : "bg-muted text-muted-foreground/40 cursor-not-allowed"
              }`}
              title="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = "ChatInput";
export default ChatInput;
