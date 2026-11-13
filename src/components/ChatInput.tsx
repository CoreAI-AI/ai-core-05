import { useState, useRef, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image, File, Camera, Search, GraduationCap, ImagePlus, Code, Lightbulb, BarChart3, Mic, Square, X, ShoppingCart, TrendingUp, Sparkles, Newspaper, Crown, Coins, Bot, Brain, Zap, ChefHat, BookOpen, Plus, Loader2 } from "lucide-react";
import coreaiLogo from "@/assets/coreai-logo.png";
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
  getRemaining?: (mode: string) => number;
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
    }
  }, [editingMessage]);

  useEffect(() => {
    const prefill = sessionStorage.getItem('explore_prompt');
    if (prefill) {
      setMessage(prefill);
      sessionStorage.removeItem('explore_prompt');
    }
  }, []);

  useEffect(() => {
    onTypingChange?.(message.trim().length > 0);
  }, [message, onTypingChange]);

  const [currentMode, setCurrentMode] = useState<'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework'>('normal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const anyFileInputRef = useRef<HTMLInputElement>(null);

  const MODE_META: Record<string, { label: string; icon: any; color: string; desc: string; suggestions?: string[] }> = {
    'normal': { label: 'Normal Chat', icon: Bot, color: 'text-primary', desc: 'Fast, intelligent conversational AI' },
    'deep-search': { label: 'Deep Research', icon: Search, color: 'text-blue-500', desc: 'Thorough research with verified sources', suggestions: ['Compare top EV cars in 2025', 'History of quantum computing', 'Latest space missions summary'] },
    'study': { label: 'Study Tutor', icon: GraduationCap, color: 'text-green-500', desc: 'Step-by-step explanations & quiz mode', suggestions: ['Explain photosynthesis simply', 'Solve quadratic equations step by step', 'Newton\'s laws of motion with examples'] },
    'code': { label: 'Code Assistant', icon: Code, color: 'text-orange-500', desc: 'Clean code, debugging & architecture', suggestions: ['Write a React debounce hook', 'Explain async/await in Python', 'REST vs GraphQL comparison'] },
    'creative': { label: 'Creative Writer', icon: Lightbulb, color: 'text-yellow-500', desc: 'Stories, poetry, scripts & brainstorming', suggestions: ['Write a sci-fi short story opening', 'Poem about monsoon in Mumbai', 'Catchy tagline for an AI app'] },
    'analyze': { label: 'Data Analyst', icon: BarChart3, color: 'text-cyan-500', desc: 'Data breakdown, trends & insights', suggestions: ['How to calculate customer churn rate', 'Explain p-value in simple terms', 'Pros & cons of A/B testing'] },
    'recipe': { label: 'Food Recipe', icon: ChefHat, color: 'text-red-500', desc: 'Quick recipes with ingredients you have', suggestions: ['15-minute healthy dinner', 'Authentic Butter Chicken recipe', 'Eggless chocolate mug cake'] },
    'homework': { label: 'Homework Helper', icon: BookOpen, color: 'text-emerald-500', desc: 'Clear conceptual answers for school & college', suggestions: ['Summarize French Revolution causes', 'Explain Ohm\'s law with formula', 'What is GDP and how is it measured?'] },
    'rich': { label: 'Rich Mode', icon: Crown, color: 'text-amber-500', desc: 'High-status, luxury & wealth-building perspective', suggestions: ['How billionaires allocate their wealth', 'Top luxury investment assets in 2025', 'Psychology of the ultra-wealthy'] },
    'poor': { label: 'Poor Mode', icon: Coins, color: 'text-gray-500', desc: 'Budget survival, extreme saving & street-smart tips', suggestions: ['How to eat healthy on ₹100/day', 'Extreme frugal living tips that actually work', 'Side hustles with zero initial investment'] },
    'photo': { label: 'Image Generator', icon: ImagePlus, color: 'text-purple-500', desc: 'Create AI images in any style', suggestions: ['Cyberpunk street in rain, 4k', 'Peaceful Himalayan temple at sunrise', 'Cute baby panda sipping tea, 3D render'] },
  };

  const handleVoiceSuccess = (transcript: string) => {
    setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
  };

  const { isRecording, transcribing, startRecording, stopRecording } = useVoiceRecorder({
    onSuccess: handleVoiceSuccess,
  });

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(8);
    }
  };

  const handleVoiceRecording = () => {
    triggerHaptic();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
      onFileSelect(file);
      toast.success(`Selected file: ${file.name}`);
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
        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        const validation = validateFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          return;
        }
        
        onFileSelect(file);
        toast.success("Photo captured!");
      }
    } catch (error: any) {
      if (!error.message?.includes('User cancelled')) {
        fileInputRef.current?.click();
      }
    }
  };

  const handleModeSelect = (mode: 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework') => {
    triggerHaptic();
    setCurrentMode(mode);
    onModeChange?.(mode);
    toast.success(`${MODE_META[mode].label} mode activated`);
  };

  const getModeIcon = () => {
    switch (currentMode) {
      case 'deep-search': return <Search className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      case 'study': return <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case 'photo': return <ImagePlus className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />;
      case 'code': return <Code className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />;
      case 'creative': return <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
      case 'analyze': return <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />;
      case 'rich': return <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />;
      case 'poor': return <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
      case 'recipe': return <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case 'homework': return <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />;
      default: return <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-foreground" strokeWidth={2.25} />;
    }
  };

  return (
    <div className="bg-transparent px-2 sm:px-4 pb-2 sm:pb-3 pt-1 will-change-[transform,opacity]">
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      <input ref={anyFileInputRef} type="file" onChange={handleFileChange} className="hidden" />
      
      <div className="max-w-3xl mx-auto w-full">
        {!message.trim() && !editingMessage && MODE_META[currentMode]?.suggestions && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none -mx-1 px-1">
            {MODE_META[currentMode].suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setMessage(s);
                }}
                className="shrink-0 text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-foreground border border-border/40 hover:border-foreground/20 transition-all btn-press shadow-2xs"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          {/* ChatGPT-style floating capsule pill container */}
          <div className="flex items-end gap-1.5 sm:gap-2 bg-card/95 backdrop-blur-2xl border border-border/50 hover:border-border/80 focus-within:border-foreground/30 rounded-[28px] sm:rounded-[32px] p-1.5 sm:p-2 shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 shrink-0 btn-press transition-colors">
                  {getModeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto rounded-2xl border border-border/50 shadow-xl p-1.5 backdrop-blur-xl">
                {currentMode !== 'normal' && (
                  <>
                    <DropdownMenuItem onClick={() => handleModeSelect('normal')} className="cursor-pointer rounded-xl font-medium text-primary">
                      <Bot className="w-4 h-4 mr-2" />
                      Back to Normal Chat
                    </DropdownMenuItem>
                    <div className="h-px bg-border/50 my-2" />
                  </>
                )}
                
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 mb-1">AI Modes</p>
                <DropdownMenuItem onClick={() => handleModeSelect('normal')} className="cursor-pointer rounded-xl">
                  <img src={coreaiLogo} alt="CoreAI" className="w-4 h-4 mr-2 rounded-full" />
                  Normal Chat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('deep-search')} className="cursor-pointer rounded-xl">
                  <Search className="w-4 h-4 mr-2 text-blue-500" />
                  Deep Research
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('study')} className="cursor-pointer rounded-xl">
                  <GraduationCap className="w-4 h-4 mr-2 text-green-500" />
                  Study Tutor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('code')} className="cursor-pointer rounded-xl">
                  <Code className="w-4 h-4 mr-2 text-orange-500" />
                  Code Assistant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('creative')} className="cursor-pointer rounded-xl">
                  <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                  Creative Writer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('analyze')} className="cursor-pointer rounded-xl">
                  <BarChart3 className="w-4 h-4 mr-2 text-cyan-500" />
                  Data Analyst
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('recipe')} className="cursor-pointer rounded-xl">
                  <ChefHat className="w-4 h-4 mr-2 text-red-500" />
                  Food Recipe
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('homework')} className="cursor-pointer rounded-xl">
                  <BookOpen className="w-4 h-4 mr-2 text-emerald-500" />
                  Homework Helper
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('photo')} className="cursor-pointer rounded-xl">
                  <ImagePlus className="w-4 h-4 mr-2 text-purple-500" />
                  Image Generator
                </DropdownMenuItem>
                
                <div className="h-px bg-border/50 my-2" />
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 mb-1">Mindset Modes</p>
                
                <DropdownMenuItem onClick={() => handleModeSelect('rich')} className="cursor-pointer rounded-xl">
                  <Crown className="w-4 h-4 mr-2 text-amber-500" />
                  Rich Mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleModeSelect('poor')} className="cursor-pointer rounded-xl">
                  <Coins className="w-4 h-4 mr-2 text-gray-500" />
                  Poor Mode
                </DropdownMenuItem>

                {isPremium && (
                  <>
                    <div className="h-px bg-border/50 my-2" />
                    <p className="text-[11px] font-semibold text-primary uppercase tracking-wider px-2 py-1 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Premium Models
                    </p>
                    <DropdownMenuItem onClick={() => { onModelChange?.('google/gemini-2.5-flash'); toast.success('Chat-Bot model activated!'); }} className="cursor-pointer rounded-xl">
                      <Bot className="w-4 h-4 mr-2 text-blue-400" />
                      Chat-Bot
                      <span className="ml-auto text-[10px] text-muted-foreground">Fast & Smart</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { onModelChange?.('google/gemini-2.5-pro'); toast.success('Core-AI model activated!'); }} className="cursor-pointer rounded-xl">
                      <Brain className="w-4 h-4 mr-2 text-purple-400" />
                      Core-AI
                      <span className="ml-auto text-[10px] text-muted-foreground">Advanced</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { onModelChange?.('openai/gpt-5'); toast.success('Chat-Pro model activated!'); }} className="cursor-pointer rounded-xl">
                      <Zap className="w-4 h-4 mr-2 text-amber-400" />
                      Chat-Pro
                      <span className="ml-auto text-[10px] text-muted-foreground">Ultra Power</span>
                    </DropdownMenuItem>
                  </>
                )}
                
                <div className="h-px bg-border/50 my-2" />
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 mb-1">Attach</p>
                
                <DropdownMenuItem onClick={openGallery} className="cursor-pointer rounded-xl">
                  <Image className="w-4 h-4 mr-2" />
                  Gallery
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openFileExplorer} className="cursor-pointer rounded-xl">
                  <File className="w-4 h-4 mr-2" />
                  File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openCamera} className="cursor-pointer rounded-xl" data-camera-upload>
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex-1 min-w-0 relative">
              {editingMessage && (
                <div className="flex items-center gap-2 text-xs text-primary mb-2 font-medium bg-primary/10 px-3 py-1.5 rounded-full">
                  <span>Editing message</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => {
                    onCancelEdit?.();
                    setMessage("");
                  }} className="h-5 w-5 p-0 text-primary hover:text-primary/80 rounded-full">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <Textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                onKeyDown={handleKeyDown} 
                placeholder={
                  editingMessage ? "Edit your message..." : 
                  currentMode === 'photo' ? "Describe the image you want to generate..." : 
                  currentMode === 'study' ? "Ask me to explain any topic..." : 
                  currentMode === 'deep-search' ? "Ask for in-depth research..." : 
                  currentMode === 'code' ? "Ask for coding help..." : 
                  currentMode === 'creative' ? "Let's create something amazing..." : 
                  currentMode === 'analyze' ? "Share data or info to analyze..." : 
                  currentMode === 'rich' ? "Ask about wealth, investments, luxury..." : 
                  currentMode === 'poor' ? "Ask about saving, budgeting, survival tips..." : 
                  disabled ? "AI is thinking..." : "Message CoreAI..."
                } 
                disabled={disabled} 
                className="min-h-[38px] sm:min-h-[42px] max-h-32 resize-none bg-transparent border-0 shadow-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 py-2 px-1 leading-relaxed" 
                rows={1} 
              />
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                onClick={handleVoiceRecording} 
                disabled={disabled || transcribing} 
                data-voice-input 
                title={isRecording ? "Stop and send" : transcribing ? "Transcribing..." : "Tap to speak"} 
                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full btn-press transition-colors ${isRecording ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}
              >
                {transcribing ? <Loader2 className="w-4 h-4 animate-spin" /> : isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

              {/* Minimalist High-Contrast Pill Send Button */}
              <Button 
                type="submit" 
                size="icon" 
                disabled={disabled || !message.trim()} 
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-foreground text-background hover:opacity-90 disabled:opacity-20 disabled:bg-muted-foreground/20 btn-press transition-all shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
        
        <p className="text-center text-[11px] sm:text-xs text-muted-foreground/80 mt-1.5">
          CoreAI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';
