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
  const {
    isRecording,
    transcribing,
    startRecording,
    stopRecording,
    transcribe,
    reset
  } = useVoiceRecorder();

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(10);
      } catch (_) {}
    }
  };

  const handleQuickMode = (prompt: string, modeName: string) => {
    triggerHaptic();
    onSendMessage(prompt);
    toast.success(`${modeName} activated!`);
  };

  const MODE_META: Record<string, { name: string; intro: string; suggestions: string[] }> = {
    'normal': { name: 'Normal Chat', intro: 'Friendly all-purpose CoreAI chat. Kuch bhi poochho!', suggestions: ['Mujhe ek joke sunao', 'Aaj ka motivational quote', 'Explain quantum computing simply', 'Plan my day in 5 steps'] },
    'deep-search': { name: 'Deep Research', intro: 'In-depth research mode — sources, comparisons, deep analysis.', suggestions: ['Research latest AI trends 2026', 'Compare iPhone 17 vs Samsung S26', 'Detailed report on Indian startups', 'History of cryptocurrency'] },
    'study': { name: 'Study Tutor', intro: 'Aapka personal tutor — concepts simple bhasha mein.', suggestions: ['Explain photosynthesis', 'Solve: integral of x^2', 'Newton ke 3 laws batao', 'Help me revise for exam'] },
    'photo': { name: 'Image Generator', intro: 'Text se image banao — sirf describe karo!', suggestions: ['A cyberpunk city at night, neon lights', 'Cute cat astronaut in space', 'Indian wedding mandap, cinematic', 'Logo for AI startup, minimal'] },
    'code': { name: 'Code Assistant', intro: 'Coding partner — debug, build, explain.', suggestions: ['Write a React todo app', 'Explain async/await in JS', 'Fix this Python error', 'Build a REST API in Node'] },
    'creative': { name: 'Creative Writer', intro: 'Stories, poems, scripts — creativity unleashed.', suggestions: ['Write a short story about time travel', 'Hindi shayari on love', 'Instagram caption ideas', 'Script for 1-min reel'] },
    'analyze': { name: 'Data Analyst', intro: 'Data dijiye, insights milenge.', suggestions: ['Analyze monthly sales trends', 'Summarize this CSV', 'Find patterns in user data', 'Suggest KPIs for SaaS'] },
    'rich': { name: 'Rich Mode', intro: 'Wealth, luxury aur investment mindset.', suggestions: ['Best stocks to invest in 2026', 'How to build passive income', 'Luxury car comparison', 'Mindset of billionaires'] },
    'poor': { name: 'Poor Mode', intro: 'Saving, budgeting aur smart survival tips.', suggestions: ['Save ₹10,000 in a month', 'Cheap healthy meal ideas', 'Free tools for students', 'Side hustle without investment'] },
    'recipe': { name: 'Food Recipe', intro: 'Chef CoreAI — recipes step by step.', suggestions: ['Paneer butter masala recipe', '5-min breakfast ideas', 'Healthy weight-loss meals', 'Authentic biryani recipe'] },
    'homework': { name: 'Homework Helper', intro: 'Homework done right — step-by-step solutions.', suggestions: ['Solve my math homework', 'Essay on global warming', 'Science project ideas class 10', 'Hindi grammar help'] },
  };

  const handleModeSelect = (mode: 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework') => {
    triggerHaptic();
    setCurrentMode(mode);
    if (onModeChange) {
      onModeChange(mode);
    }
    const meta = MODE_META[mode];
    const seenKey = `coreai_mode_intro_${mode}`;
    if (!localStorage.getItem(seenKey)) {
      toast.success(`${meta.name} activated!`, { description: meta.intro, duration: 4500 });
      localStorage.setItem(seenKey, '1');
    } else {
      toast.success(`${meta.name} activated!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    triggerHaptic();

    try {
      const sanitized = sanitizeInput(message);
      chatMessageSchema.parse({ content: sanitized });
      onSendMessage(sanitized);
      setMessage("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Invalid message");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Invalid file");
        }
      }
    }
  };

  const openGallery = () => fileInputRef.current?.click();
  const openFileExplorer = () => anyFileInputRef.current?.click();

  const openCamera = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false,
        correctOrientation: true
      });
      if (image.dataUrl && onFileSelect) {
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const timestamp = Date.now();
        const fileObj = Object.assign(blob, {
          name: `camera-${timestamp}.jpg`,
          lastModified: timestamp
        }) as File;
        onFileSelect(fileObj);
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      toast.error('Camera access denied. Please allow camera permissions.');
    }
  };

  const handleVoiceRecording = async () => {
    triggerHaptic();
    if (isRecording) {
      stopRecording();
      const text = await transcribe();
      if (text && text.trim()) {
        try {
          const sanitized = sanitizeInput(text.trim());
          chatMessageSchema.parse({ content: sanitized });
          onSendMessage(sanitized);
          setMessage("");
          toast.success("Voice sent!");
        } catch (err) {
          setMessage(text);
          toast.error(err instanceof Error ? err.message : "Invalid message");
        }
      }
      reset();
    } else {
      await startRecording();
    }
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
    <div className="bg-transparent px-3 pb-3 sm:pb-4 pt-1 will-change-[transform,opacity]">
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
                className="shrink-0 text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-muted/60 hover:bg-muted text-foreground border border-border/40 hover:border-foreground/20 transition-all btn-press shadow-2xs"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="relative">
          {/* ChatGPT-style floating capsule pill container */}
          <div className="flex items-end gap-1.5 sm:gap-2 bg-card/95 backdrop-blur-2xl border border-border/60 hover:border-border rounded-[28px] sm:rounded-[32px] p-1.5 sm:p-2 shadow-lg shadow-black/5 dark:shadow-black/20 focus-within:border-foreground/25 focus-within:shadow-xl transition-all duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 shrink-0 btn-press transition-colors">
                  {getModeIcon()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-border shadow-xl">
                {isMobile && (
                  <>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 mb-1">Quick Modes</p>
                    <DropdownMenuItem onClick={() => handleQuickMode("Help me with shopping research. I want to find the best products and deals for my needs.", "Shopping Mode")} className="cursor-pointer rounded-xl">
                      <ShoppingCart className="w-4 h-4 mr-2 text-orange-500" />
                      Shopping Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuickMode("Help me with financial research. Provide market analysis and investment insights.", "Financial Mode")} className="cursor-pointer rounded-xl">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      Financial Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuickMode("Help me with beauty and skincare advice. Provide product recommendations and tips.", "Beauty Mode")} className="cursor-pointer rounded-xl">
                      <Sparkles className="w-4 h-4 mr-2 text-pink-500" />
                      Beauty Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuickMode("Give me today's top news and important updates from around the world.", "Today News")} className="cursor-pointer rounded-xl">
                      <Newspaper className="w-4 h-4 mr-2 text-purple-500" />
                      Today News
                    </DropdownMenuItem>
                    <div className="h-px bg-border my-2" />
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
                
                <div className="h-px bg-border my-2" />
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
                    <div className="h-px bg-border my-2" />
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
                
                <div className="h-px bg-border my-2" />
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
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-foreground text-background hover:opacity-90 disabled:opacity-30 disabled:bg-muted-foreground/20 btn-press transition-all shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
        
        <p className="text-center text-[11px] sm:text-xs text-muted-foreground/80 mt-2">
          CoreAI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';
