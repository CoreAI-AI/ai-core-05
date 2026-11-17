import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { QuickActionCards } from "@/components/QuickActionCards";
import { VirtualizedChatMessages } from "@/components/VirtualizedChatMessages";
import { ChatSearch } from "@/components/ChatSearch";
import { Settings } from "@/components/Settings";
import { useSubscription } from "@/hooks/useSubscription";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { toast } from "sonner";
import { X, PanelLeft, Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { tryLocalReply } from "@/lib/smallTalk";
import { buildCompanionContext as getCompanionMemoryContext } from "@/lib/companionMemory";

interface AttachedFileItem {
  id: string;
  file: File;
  preview: string | null;
  isImage: boolean;
}

const MODE_INSTRUCTIONS: Record<string, string> = {
  'deep-search': 'You are in Deep Search Mode. Provide deep, comprehensive research with multi-perspective analysis, logical breakdown, structured sections, bullet points, and high-level critical insights.',
  'code': 'You are in Code Assistant Mode. Provide clean, efficient, production-ready, well-formatted code blocks with syntax highlighting. Explain key reasoning concisely and note performance or security tips.',
  'study': 'You are in Study Notes Mode. Act as a world-class academic tutor. Break down complex topics into clear notes, key takeaways, mnemonics, real-world examples, and practice questions.',
  'homework': 'You are in Homework Helper Mode. Solve questions step-by-step with formulas, calculations, highlighted final answers, and a Concept Recap so the student truly understands.',
  'photo': 'You are in Image Studio Mode. You MUST generate high-quality visual images. Pay attention to artistic style, composition, lighting, and details.',
  'creative': 'You are in Creative Writing Mode. Write imaginative, engaging stories, poetry, scripts, or marketing copy with emotional depth, vivid metaphors, and captivating narrative flow.',
  'analyze': 'You are in Analyze & Summarize Mode. Critically analyze data and text, extract key takeaways, metrics, underlying patterns, pros/cons, and actionable conclusions.',
  'recipe': 'You are in Recipe & Cooking Mode. Provide: 1) Dish name & short intro, 2) Ingredients list with exact quantities, 3) Step-by-step numbered cooking method, 4) Prep time & servings, 5) Chef pro tips.',
  'rich': 'You are in Rich Mode (Wealth Mindset). Think like a billionaire investor and entrepreneur. Focus on assets, cash flow, ROI, scalable businesses, high-value opportunities, and prosperity.',
  'poor': 'You are in Poor Mode (Savings & Frugality). Focus on smart budgeting, maximum cost-cutting, zero-waste DIY solutions, and survival money hacks.'
};

const detectSubscriptionIntent = (text: string) => {
  const lower = text.toLowerCase();
  const keywords = [
    "premium", "pricing", "plans", "subscription", "upgrade",
    "pro plan", "team plan", "plus plan", "buy coreai", "cost of coreai",
    "how much does coreai cost", "is coreai free"
  ];
  return keywords.some(k => lower.includes(k));
};

// In-chat image generation trigger words (Hindi + English)
const isImageGenerationPrompt = (text: string) => {
  const lower = text.toLowerCase().trim();
  const directKeywords = [
    'generate image', 'create image', 'make an image', 'make image', 'draw', 'generate a photo',
    'create a photo', 'generate picture', 'create picture', 'photo banao', 'photo bana do',
    'photo bana de', 'image banao', 'image bana do', 'tasveer banao', 'tasvir banao', 'chitra banao',
    'tasveer bana do', 'iska image banao', 'iski photo banao', 'iski image banao', 'iska photo banao',
    'ispe image banao', 'is story ka image banao', 'chitra banaiye', 'photo generate karo', 'image generate karo',
    'draw a', 'paint a', 'sketch a', 'render a'
  ];
  if (directKeywords.some(k => lower.includes(k))) return true;

  const mediaWords = ['image', 'photo', 'picture', 'tasveer', 'tasvir', 'chitra', 'wallpaper', 'illustration', 'sketch', 'drawing', 'फोटो', 'चित्र', 'तस्वीर'];
  const actionWords = ['banao', 'bana do', 'bana de', 'banaye', 'banayein', 'generate', 'create', 'draw', 'paint', 'sketch', 'nikalo', 'karo', 'बनाओ', 'बनाइए', 'बनाना'];

  return mediaWords.some(m => lower.includes(m)) && actionWords.some(a => lower.includes(a));
};

const Index = () => {
  const { user } = useAuth();
  const { chats, currentChat, messages, createChat, selectChat, deleteChat, addMessage, updateMessage, updateMessageLocal } = useChats(user?.id);
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash");
  const { isPremium } = useSubscription();
  const { recordUsage } = useDailyLimit(user?.id, isPremium);
  const usageLimits = useUsageLimits(user?.id, isPremium);
  const [, setUnlockPopup] = useState<{ open: boolean; reason?: 'daily' | 'mode'; modeLabel?: string }>({ open: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Up to 8 attached files / images
  const [attachedFiles, setAttachedFiles] = useState<AttachedFileItem[]>([]);
  const [chatMode, setChatMode] = useState<'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework'>('normal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 768);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [, setIsUserTyping] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string; index: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (!userScrolledUpRef.current) {
      scrollToBottom('smooth');
    }
  }, [messages.length, isAITyping, isGeneratingImage, scrollToBottom]);

  const compressImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelect = async (files: File[]) => {
    if (attachedFiles.length + files.length > 8) {
      toast.error("Maximum 8 images/files can be attached at once.");
      return;
    }

    const newItems: AttachedFileItem[] = [];
    for (const file of files) {
      if (attachedFiles.length + newItems.length >= 8) break;
      const isImg = file.type.startsWith('image/');
      let preview: string | null = null;
      if (isImg) {
        try {
          preview = await compressImage(file);
        } catch {
          preview = await new Promise<string>((res) => {
            const r = new FileReader();
            r.onloadend = () => res(r.result as string);
            r.readAsDataURL(file);
          });
        }
      }
      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview,
        isImage: isImg
      });
    }

    setAttachedFiles(prev => [...prev, ...newItems].slice(0, 8));
    toast.success(`${newItems.length} file(s) attached (max 8)`);
  };

  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const buildCompanionContext = (incomingMessage: string) => {
    const parts: string[] = [];
    try {
      const memoryContext = getCompanionMemoryContext(incomingMessage);
      if (memoryContext) parts.push(memoryContext);
    } catch {
      // safe fallback
    }
    if (chatMode !== 'normal' && MODE_INSTRUCTIONS[chatMode]) {
      parts.push(`MODE INSTRUCTION: ${MODE_INSTRUCTIONS[chatMode]}`);
    }
    return parts.join(" | ");
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() && attachedFiles.length === 0) return;

    const gate = usageLimits.checkCanSend(chatMode);
    if (!gate.allowed) {
      const modeLabels: Record<string, string> = { chat: 'Chat', study: 'Study', photo: 'Image', code: 'Code' };
      setUnlockPopup({ open: true, reason: gate.reason, modeLabel: modeLabels[chatMode] || chatMode });
      return;
    }

    let chatToUse = currentChat;
    if (!chatToUse) {
      const chatTitle = content.length > 50 ? content.substring(0, 47) + "..." : content;
      chatToUse = await createChat(chatTitle);
      if (!chatToUse) return;
    }

    const messageImages = attachedFiles
      .filter(f => f.isImage && f.preview)
      .map(f => ({ url: f.preview as string, type: f.file.type, name: f.file.name }));

    const userMessage = await addMessage(chatToUse.id, content, true, messageImages.length > 0 ? messageImages : undefined);
    if (!userMessage) return;

    userScrolledUpRef.current = false;
    scrollToBottom('auto');

    if (detectSubscriptionIntent(content)) {
      await addMessage(chatToUse.id, `CoreAI is 100% free with 20 chats every day. Lifetime zero cost for you! ⚡`, false);
      return;
    }

    if (attachedFiles.length === 0 && chatMode === 'normal') {
      const local = tryLocalReply(content);
      if (local) {
        await addMessage(chatToUse.id, local, false);
        return;
      }
    }

    recordUsage(chatMode);
    usageLimits.recordSend(chatMode);
    setIsLoading(true);
    setIsAITyping(true);

    try {
      const aiMessage = await addMessage(chatToUse.id, "", false);
      if (!aiMessage) return;

      const { data: session } = await supabase.auth.getSession();
      const authToken = session?.session?.access_token;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      let fileTextToSend: string | undefined;
      let fileNameToSend: string | undefined;
      const firstDoc = attachedFiles.find(f => !f.isImage);
      if (firstDoc) {
        try {
          fileTextToSend = (await firstDoc.file.text()).slice(0, 12000);
          fileNameToSend = firstDoc.file.name;
        } catch {}
      }

      const isImgGen = chatMode === 'photo' || isImageGenerationPrompt(content);
      let promptToSend = content;

      if (isImgGen) {
        setIsGeneratingImage(true);
        const isReferential = /\b(iska|iski|isko|is|inme|ye|yeh|this|that|it|same|story)\b/i.test(content);
        if (isReferential) {
          const lastAiMsg = [...messages].reverse().find(m => !m.is_user && m.content);
          if (lastAiMsg) {
            promptToSend = `Create a high quality visual image representing this: ${lastAiMsg.content.slice(0, 300)}. Request: ${content}`;
          }
        }
      }

      const recentMessages = messages.slice(-12);
      const conversationHistory = recentMessages.map(msg => ({
        role: msg.is_user ? 'user' : 'assistant',
        content: msg.content,
        ...(msg.images?.length ? { images: msg.images } : {})
      }));

      const modelToUse = isImgGen ? 'google/gemini-2.5-flash-image-preview' : selectedModel;
      const modeToUse = isImgGen ? 'photo' : chatMode;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
          'Authorization': `Bearer ${authToken || anonKey}`
        },
        body: JSON.stringify({
          message: promptToSend,
          model: modelToUse,
          mode: modeToUse,
          companion: buildCompanionContext(content),
          image: messageImages[0]?.url,
          images: messageImages.map(img => img.url),
          fileText: fileTextToSend,
          fileName: fileNameToSend,
          conversationHistory
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Rate limit reached. Please wait a moment.");
          await updateMessage(aiMessage.id, "⏳ Rate limit reached. Please try again in a moment.");
        } else {
          toast.error("Failed to get AI response.");
        }
        setIsLoading(false);
        setIsAITyping(false);
        setIsGeneratingImage(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let accumulatedContent = "";
      let receivedImages: any[] = [];
      let buffer = "";
      setIsAITyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.images && Array.isArray(parsed.images)) {
              receivedImages.push(...parsed.images);
            }
            if (parsed.content) {
              accumulatedContent += parsed.content;
              if (!isImgGen) {
                updateMessageLocal(aiMessage.id, accumulatedContent);
              }
            }
          } catch {}
        }
      }

      if (isImgGen) {
        const finalTxt = accumulatedContent.trim() || (receivedImages.length > 0 ? "✨ Here is your generated image:" : "I could not generate the image. Please try a different prompt.");
        await updateMessage(aiMessage.id, finalTxt, receivedImages.length > 0 ? receivedImages : undefined);
        setIsGeneratingImage(false);
      } else {
        await updateMessage(aiMessage.id, accumulatedContent, receivedImages.length > 0 ? receivedImages : undefined);
      }

      setAttachedFiles([]);
    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
      setIsAITyping(false);
      setIsGeneratingImage(false);
    }
  };

  const handleQuickAction = (actionOrPrompt: string) => {
    switch (actionOrPrompt) {
      case 'shopping':
        handleSendMessage("Help me find the best products, reviews, and deals for what I want to buy.");
        break;
      case 'deep-search':
        setChatMode('deep-search');
        handleSendMessage("Perform a comprehensive deep search on the latest advancements in AI and technology.");
        break;
      case 'financial':
        setChatMode('rich');
        handleSendMessage("Give me a smart financial breakdown, investment ideas, and wealth-building tips.");
        break;
      case 'news':
        handleSendMessage("What are the top major news headlines and world updates today?");
        break;
      default:
        // Automatically send prompt from any of the 24 cards
        handleSendMessage(actionOrPrompt);
        break;
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden overscroll-none select-none">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChat={currentChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        onNewChat={() => createChat("New Chat")}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-background relative overflow-hidden">
        {/* Sleek Header */}
        <header className="px-3 py-2.5 sm:px-4 flex items-center justify-between shrink-0 gap-2 border-b border-border/30 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 min-w-0">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="h-8 w-8 rounded-lg hover:bg-muted/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                title="Open Sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
            <h1 className="text-sm font-semibold truncate text-foreground">
              {currentChat?.title || "CoreAI"}
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="h-8 px-2.5 rounded-lg hover:bg-muted/70 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              title="Search Chat"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              onClick={() => createChat("New Chat")}
              className="h-8 px-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-xs font-medium text-primary flex items-center gap-1.5 transition-colors"
              title="New Chat"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </header>

        {searchOpen && (
          <ChatSearch
            messages={messages}
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        )}

        {/* Message Container */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-2 sm:px-4 py-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-4">
              <QuickActionCards onCardClick={handleQuickAction} onAction={handleQuickAction} />
            </div>
          ) : (
            <div className="max-w-3xl xl:max-w-4xl mx-auto w-full pb-4">
              <VirtualizedChatMessages
                messages={messages}
                isGeneratingImage={isGeneratingImage}
              />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Multi-Image Preview Strip (Up to 8 Images) */}
        {attachedFiles.length > 0 && (
          <div className="px-3 py-1.5 bg-muted/40 border-t border-border/50 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pb-1">
              <span>Attached Images & Files ({attachedFiles.length}/8)</span>
              <button 
                onClick={() => setAttachedFiles([])}
                className="hover:text-destructive transition-colors text-[10px]"
              >
                Clear all
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {attachedFiles.map((item) => (
                <div key={item.id} className="relative group shrink-0">
                  {item.isImage && item.preview ? (
                    <img 
                      src={item.preview} 
                      alt="Thumbnail" 
                      className="w-12 h-12 rounded-xl object-cover border border-border/80 shadow-xs" 
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-muted border border-border/80 flex items-center justify-center text-[9px] text-muted-foreground px-1 text-center truncate">
                      {item.file.name.slice(0, 8)}
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachedFile(item.id)}
                    className="absolute -top-1 -right-1 bg-background/90 text-foreground border border-border/70 rounded-full h-4 w-4 flex items-center justify-center shadow-xs hover:bg-destructive hover:text-white transition-colors"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Floating Composer */}
        <div className="p-2 sm:p-3 bg-gradient-to-t from-background via-background/90 to-transparent">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            onFilesSelect={handleFilesSelect}
            onModeChange={setChatMode}
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
            onTypingChange={setIsUserTyping}
            isPremium={isPremium}
            onModelChange={setSelectedModel}
          />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <Settings user={user} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
