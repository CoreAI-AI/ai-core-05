import { useState, useEffect, useRef, useCallback } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { Auth } from "@/components/Auth";
import { Settings } from "@/components/Settings";
import { QuickActionCards } from "@/components/QuickActionCards";
import { QuickActionButtons } from "@/components/QuickActionButtons";
import { PinnedMessages } from "@/components/PinnedMessages";
import { ChatSearch } from "@/components/ChatSearch";
import { VirtualizedChatMessages } from "@/components/VirtualizedChatMessages";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { ScrollToBottom } from "@/components/ScrollToBottom";
import { SubscriptionPopup } from "@/components/SubscriptionPopup";
import { ManageSubscriptionDialog } from "@/components/ManageSubscriptionDialog";
import { UnlockPopup } from "@/components/UnlockPopup";
import { ReadAloudHeaderPlayer } from "@/components/ReadAloudHeaderPlayer";
import { useChats } from "@/hooks/useChats";
import { useMessages } from "@/hooks/useMessages";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useHaptics } from "@/hooks/useHaptics";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  PanelLeft, 
  Search, 
  Palette, 
  Clock, 
  Star, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import premiumLogo from "@/assets/premium-logo.png";
import { getFounderIdentityResponse, isFounderIdentityQuery } from "@/lib/brandIdentity";
import { isCacheable, getCached, tryLocalReply } from "@/lib/queryCache";
import { recordUsage } from "@/lib/usageMetrics";
import { detectSubscriptionIntent } from "@/lib/subscriptionIntent";
import { buildCompanionContext, followUpGreeting } from "@/lib/companionMemory";
import { MemoryControl } from "@/components/MemoryControl";
import { ResponseLengthControl, type ResponseLength } from "@/components/ResponseLengthControl";

type ModeType = 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework';

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const isOnline = useOnlineStatus();
  const usageLimits = useUsageLimits();

  const {
    currentChat,
    sidebarCollapsed,
    setSidebarCollapsed,
    favoriteChats,
    toggleFavorite,
    selectChat,
    startNewChat,
    isPremium,
    searchQuery,
    setSearchQuery,
  } = useChats();

  const {
    messages,
    addMessage,
    updateMessage,
    updateMessageLocal,
    isAITyping,
    setIsAITyping,
  } = useMessages(currentChat?.id);

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGenerationPrompt, setImageGenerationPrompt] = useState("");
  const [chatMode, setChatMode] = useState<ModeType>("normal");
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash");
  const [responseLength, setResponseLength] = useState<ResponseLength>("medium");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showManageSubscription, setShowManageSubscription] = useState(false);
  const [unlockPopup, setUnlockPopup] = useState<{ open: boolean; reason: 'daily' | 'feature'; modeLabel?: string }>({
    open: false,
    reason: 'daily'
  });
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string; index: number } | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [openTabs, setOpenTabs] = useState<any[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  const { containerRef: pullRef, pulling, refreshing, pullProgress } = usePullToRefresh({
    onRefresh: async () => {
      haptics.medium();
      if (currentChat) {
        selectChat(currentChat);
      }
    },
    enabled: messages.length > 0,
  });

  // Next-day follow-up
  useEffect(() => {
    const g = followUpGreeting();
    if (g && !sessionStorage.getItem("coreai_followup_shown")) {
      sessionStorage.setItem("coreai_followup_shown", "1");
      setTimeout(() => toast(g, { duration: 9000 }), 1500);
    }
  }, []);

  // Robust Auto-Scroll
  useEffect(() => {
    const container = scrollAreaRef.current;
    if (!container) return;

    if (!userScrolledUpRef.current) {
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  }, [messages, isAITyping, isLoading]);

  const handleContainerScroll = useCallback(() => {
    const container = scrollAreaRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distance = scrollHeight - scrollTop - clientHeight;
    const isUp = distance > 120;
    userScrolledUpRef.current = isUp;
    setHasNewMessage(isUp);
  }, []);

  const forceScrollToBottom = useCallback(() => {
    userScrolledUpRef.current = false;
    setHasNewMessage(false);
    const container = scrollAreaRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (currentChat && !openTabs.find(t => t.id === currentChat.id)) {
      setOpenTabs(prev => [...prev, currentChat].slice(-5));
    }
  }, [currentChat]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleEditMessage = (id: string, content: string, index: number) => {
    setEditingMessage({ id, content, index });
  };

  const handleRegenerateResponse = async (id: string, index: number) => {
    const userMsg = messages[index - 1];
    if (userMsg && userMsg.is_user) {
      await handleSendMessage(userMsg.content);
    }
  };

  const handleQuickAction = async (action: 'rewrite' | 'summarize' | 'translate' | 'improve' | 'regenerate') => {
    const lastAI = [...messages].reverse().find(m => !m.is_user);
    if (!lastAI) return;

    const prompts: Record<string, string> = {
      rewrite: `Please rewrite the following response in a clearer and more engaging way:\n\n"${lastAI.content}"`,
      summarize: `Please summarize the key takeaways of the following response in bullet points:\n\n"${lastAI.content}"`,
      translate: `Please translate the following response into natural Hindi:\n\n"${lastAI.content}"`,
      improve: `Please improve and expand on the following response with more practical details:\n\n"${lastAI.content}"`,
      regenerate: lastAI.content,
    };

    if (action === 'regenerate') {
      const idx = messages.findIndex(m => m.id === lastAI.id);
      await handleRegenerateResponse(lastAI.id, idx);
    } else {
      await handleSendMessage(prompts[action]);
    }
  };

  const scrollToMessage = (messageId: string) => {
    const el = document.getElementById(`message-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('bg-primary/10', 'rounded-xl');
      setTimeout(() => {
        el.classList.remove('bg-primary/10', 'rounded-xl');
      }, 2000);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() && !selectedFile) return;

    if (!isPremium && usageLimits.remaining <= 0) {
      setUnlockPopup({ open: true, reason: 'daily' });
      return;
    }

    let chatToUse = currentChat;
    if (!chatToUse) {
      chatToUse = await startNewChat(content.slice(0, 30));
    }
    if (!chatToUse) return;

    const messageImages: any[] = [];
    if (selectedFile && filePreview) {
      messageImages.push({
        url: filePreview,
        type: selectedFile.type,
        name: selectedFile.name,
      });
    }

    const userMessage = await addMessage(chatToUse.id, content, true, messageImages);
    if (!userMessage) return;

    // Reset user scroll so chat automatically follows new messages
    userScrolledUpRef.current = false;
    forceScrollToBottom();

    if (detectSubscriptionIntent(content)) {
      if (isPremium) {
        let savedPlanName = "Premium";
        try {
          const raw = localStorage.getItem("coreai_active_plan");
          if (raw) savedPlanName = JSON.parse(raw).name || savedPlanName;
        } catch {}
        await addMessage(chatToUse.id, `Aapka **CoreAI ${savedPlanName}** plan active hai! ⚡`, false);
      } else {
        await addMessage(
          chatToUse.id,
          `Plans dekhne ke liye yahan click karein: [View Plans](/plans)\n\nPromo code se instant upgrade ke liye: Settings > Plans.`,
          false
        );
      }
      return;
    }

    if (!selectedFile && isFounderIdentityQuery(content)) {
      const approved = getFounderIdentityResponse(content);
      if (approved) {
        await addMessage(chatToUse.id, approved, false);
        return;
      }
    }

    if (!selectedFile && chatMode === 'normal') {
      const local = tryLocalReply(content);
      if (local) {
        await addMessage(chatToUse.id, local, false);
        return;
      }
    }

    if (!selectedFile && isCacheable(content, chatMode)) {
      const cached = getCached(content, chatMode, selectedModel);
      if (cached) {
        await addMessage(chatToUse.id, cached, false);
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

      let fileTextToSend: string | undefined;
      let fileNameToSend: string | undefined;
      if (selectedFile && !selectedFile.type.startsWith('image/')) {
        try {
          const txt = await selectedFile.text();
          fileTextToSend = txt.slice(0, 12000);
          fileNameToSend = selectedFile.name;
        } catch (e) {
          console.warn('Failed to read file as text:', e);
        }
      }

      const recentMessages = messages.slice(-12);
      const conversationHistory = recentMessages.map(msg => {
        const historyItem: any = {
          role: msg.is_user ? 'user' : 'assistant',
          content: msg.content
        };
        if (msg.images && msg.images.length > 0) {
          historyItem.images = msg.images;
        }
        return historyItem;
      });

      const lower = content.toLowerCase();
      const genKeywords = [
        'generate image', 'create image', 'make an image', 'make image', 'draw', 'generate a photo', 'create a photo',
        'photo banao', 'photo bana do', 'photo bana de', 'image banao', 'tasveer banao', 'tasvir banao', 'chitra banao',
        'फोटो', 'चित्र', 'तस्वीर', 'बनाओ', 'बनाइए', 'बनाना'
      ];
      const hasMediaWord = ['image','photo','picture','tasveer','tasvir','chitra','फोटो','चित्र','तस्वीर'].some(w => lower.includes(w));
      const hasMakeWord = ['generate','create','make','banao','bana do','bana de','banaye','बनाओ','बनाइए','बनाना'].some(w => lower.includes(w));
      const wantsImageGeneration = chatMode === 'photo' || (genKeywords.some(k => lower.includes(k)) || (hasMediaWord && hasMakeWord));
      
      if (wantsImageGeneration) {
        setIsGeneratingImage(true);
        setImageGenerationPrompt(content);
      }

      const modelToUse = chatMode === 'photo' ? 'google/gemini-2.5-flash-image-preview' : selectedModel;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          message: content,
          model: modelToUse,
          mode: chatMode,
          companion: buildCompanionContext(content),
          image: filePreview,
          fileText: fileTextToSend,
          fileName: fileNameToSend,
          conversationHistory
        })
      });

      if (!response.ok) {
        if (response.status === 402) {
          toast.error("AI credits exhausted.");
          await updateMessage(aiMessage.id, "⚠️ AI credits are currently exhausted. Responses will resume shortly.");
          setIsLoading(false);
          setIsAITyping(false);
          setIsGeneratingImage(false);
          return;
        }
        if (response.status === 429) {
          toast.error("Too many requests. Please wait a moment.");
          await updateMessage(aiMessage.id, "⏳ Rate limit reached. Please wait a moment.");
          setIsLoading(false);
          setIsAITyping(false);
          setIsGeneratingImage(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response body");

      let accumulatedContent = "";
      let receivedImages: any[] = [];
      let buffer = "";
      let sawDone = false;
      setIsAITyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.length > 0 && buffer.startsWith('data: ')) {
            const data = buffer.slice(6);
            if (data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  updateMessageLocal(aiMessage.id, accumulatedContent);
                }
                if (parsed.images?.length > 0) {
                  receivedImages = parsed.images;
                  updateMessageLocal(aiMessage.id, accumulatedContent, parsed.images);
                }
              } catch {}
            }
          }
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') {
            sawDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              accumulatedContent += parsed.content;
              updateMessageLocal(aiMessage.id, accumulatedContent);
            }
            if (parsed.images?.length > 0) {
              receivedImages = parsed.images;
              updateMessageLocal(aiMessage.id, accumulatedContent, parsed.images);
            }
          } catch {}
        }
        if (sawDone) break;
      }

      await updateMessage(aiMessage.id, accumulatedContent, receivedImages);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to get response");
    } finally {
      setIsLoading(false);
      setIsAITyping(false);
      setIsGeneratingImage(false);
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <ChatSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSettings={() => setShowSettings(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Chat Canvas Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {showSettings ? (
            <div className="flex-1 overflow-y-auto">
              <Settings onClose={() => setShowSettings(false)} />
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="h-12 border-b border-border/40 px-3 sm:px-4 flex items-center justify-between shrink-0 bg-background/90 backdrop-blur-md z-20">
                <div className="flex items-center gap-2 min-w-0">
                  {sidebarCollapsed && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSidebarCollapsed(false)} 
                      className="h-8 w-8 p-0 shrink-0 inline-flex items-center justify-center rounded-xl bg-muted/60 hover:bg-muted text-foreground border border-border/40 transition-colors shadow-2xs"
                      title="Open sidebar"
                    >
                      <PanelLeft className="h-4 w-4" />
                    </motion.button>
                  )}
                  
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-sm sm:text-base font-bold text-foreground truncate tracking-tight">
                      {currentChat ? currentChat.title : "CoreAI"}
                    </h1>
                    {!currentChat && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        AI Ready
                      </span>
                    )}
                  </div>

                  {currentChat && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 shrink-0 rounded-full hover:bg-muted"
                      onClick={() => toggleFavorite(currentChat.id)}
                    >
                      <Star className={`h-3.5 w-3.5 ${favoriteChats.has(currentChat.id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                    </Button>
                  )}

                  {isPremium && (
                    <button
                      onClick={() => setShowManageSubscription(true)}
                      className="h-7 px-2.5 rounded-full flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-purple-500/15 border border-amber-500/30 hover:from-amber-500/25 transition-all shadow-2xs"
                      title="CoreAI Premium"
                    >
                      <img src={premiumLogo} alt="Premium" width={16} height={16} className="w-4 h-4" />
                      <span className="text-[10px] font-bold bg-gradient-to-r from-amber-400 to-purple-500 bg-clip-text text-transparent">PREMIUM</span>
                    </button>
                  )}
                </div>

                {/* Right Action Icons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="hidden sm:block">
                    <MemoryControl chatId={currentChat?.id} />
                  </div>
                  <div className="hidden sm:block">
                    <ResponseLengthControl value={responseLength} onChange={setResponseLength} />
                  </div>

                  {/* Search Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      if (messages.length > 0) {
                        setShowSearch(true);
                      } else {
                        setSidebarCollapsed(false);
                      }
                    }} 
                    className="h-8 w-8 sm:w-auto p-0 sm:px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-xl border border-border/30 transition-all shadow-2xs" 
                    title="Search" 
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-[11px] font-medium text-muted-foreground">Search</span>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate("/images")} 
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-xl border border-border/30 transition-all shadow-2xs" 
                    title="Image Styles"
                  >
                    <Palette className="h-4 w-4 text-cyan-400" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-xl border border-border/30 transition-all shadow-2xs"
                    title="Temporary Chat"
                    onClick={() => {
                      startNewChat();
                      setChatMode("normal");
                      toast.info("Temporary chat started — won't be saved to history");
                    }}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </header>

              {/* Global Read-Aloud Player */}
              <ReadAloudHeaderPlayer />

              {/* Pinned Messages */}
              <PinnedMessages 
                chatId={currentChat?.id}
                onUnpin={() => {}}
                onScrollTo={scrollToMessage}
              />

              {/* Chat Search Bar */}
              <ChatSearch
                messages={messages}
                onScrollToMessage={scrollToMessage}
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
              />

              {/* Scrollable Messages Canvas with Top-Start Alignment for Messages */}
              <div 
                className={`chat-messages-container ${messages.length === 0 ? "overflow-hidden h-full flex flex-col justify-center" : ""}`} 
                ref={(el) => {
                  (scrollAreaRef as any).current = el;
                  (pullRef as any).current = el;
                }}
                onScroll={handleContainerScroll}
              >
                <PullToRefreshIndicator pullProgress={pullProgress} refreshing={refreshing} pulling={pulling} />
                
                {messages.length > 0 && (
                  <ScrollToBottom 
                    scrollAreaRef={scrollAreaRef} 
                    hasNewMessage={hasNewMessage} 
                    onScrollToBottom={forceScrollToBottom} 
                  />
                )}
                
                {/* FIXED: When messages.length === 0, locked & centered; when messages.length > 0, starts cleanly from top! */}
                <div className={`p-2 sm:p-4 ${messages.length === 0 ? "h-full flex flex-col justify-center" : "pt-3 pb-8 min-h-full flex flex-col justify-start"}`}>
                  <div className={`max-w-2xl mx-auto w-full flex-1 flex flex-col ${messages.length === 0 ? "justify-center" : "justify-start"}`}>
                    {messages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-8">
                        <AnimatePresence mode="wait">
                          {showQuickActions ? (
                            <motion.div 
                              key="cards" 
                              className="w-full max-w-xl px-1 sm:px-2" 
                              initial={{ opacity: 0, y: 14 }} 
                              animate={{ opacity: 1, y: 0 }} 
                              exit={{ opacity: 0, scale: 0.96 }} 
                              transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                              <QuickActionCards onAction={handleSendMessage} onSkip={() => setShowQuickActions(false)} />
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="show-btn" 
                              initial={{ opacity: 0, scale: 0.9 }} 
                              animate={{ opacity: 1, scale: 1 }} 
                              exit={{ opacity: 0, scale: 0.9 }} 
                              transition={{ duration: 0.2 }}
                            >
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setShowQuickActions(true)} 
                                className="text-xs font-medium rounded-full border-border/40 hover:bg-muted/50"
                              >
                                Show quick actions
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <VirtualizedChatMessages 
                        messages={messages}
                        chatId={currentChat?.id}
                        isAITyping={isAITyping}
                        isGeneratingImage={isGeneratingImage}
                        imagePrompt={imageGenerationPrompt}
                        onEditMessage={handleEditMessage}
                        onRegenerateResponse={handleRegenerateResponse}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Input - Fixed at bottom */}
          {!showSettings && (
            <div className="chat-input-fixed glass-navbar border-t-0 glow-border">
              {/* Quick Action Buttons - Desktop only */}
              {messages.length > 0 && (
                <div className="hidden md:flex justify-center py-2">
                  <QuickActionButtons
                    onRewrite={() => handleQuickAction('rewrite')}
                    onSummarize={() => handleQuickAction('summarize')}
                    onTranslate={() => handleQuickAction('translate')}
                    onImprove={() => handleQuickAction('improve')}
                    onRegenerate={() => handleQuickAction('regenerate')}
                    disabled={isLoading}
                    hasMessage={messages.some(m => !m.is_user)}
                  />
                </div>
              )}
              
              {/* File Preview */}
              {selectedFile && (
                <div className="p-3 sm:p-4">
                  <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-muted rounded-xl">
                      {filePreview && <img src={filePreview} alt="Preview" className="w-14 h-14 object-cover rounded-lg" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{selectedFile.name}</p>
                        <p className="text-[11px] text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }} className="h-7 w-7 p-0 rounded-full">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="px-2 py-2 sm:py-3 sm:p-4">
                <div className="max-w-2xl mx-auto w-full">
                  {!isPremium && (
                    <p className="text-center text-[11px] text-muted-foreground pb-1" aria-live="polite">
                      ⚡ {usageLimits.remaining}/{usageLimits.DAILY_CHAT_LIMIT} free chats left today
                    </p>
                  )}
                  <ChatInput 
                    onSendMessage={handleSendMessage} 
                    disabled={isLoading} 
                    onFileSelect={handleFileSelect} 
                    onModeChange={setChatMode} 
                    editingMessage={editingMessage} 
                    onCancelEdit={() => setEditingMessage(null)} 
                    onTypingChange={setIsUserTyping} 
                    isPremium={isPremium} 
                    onModelChange={setSelectedModel} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Offline indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-72 z-50"
          >
            <div className="bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-4 py-3 rounded-lg shadow-lg">
              <p className="text-sm font-medium">You're offline</p>
              <p className="text-xs opacity-80">Messages will be sent when you're back online</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SubscriptionPopup
        open={showSubscriptionPopup}
        onOpenChange={setShowSubscriptionPopup}
      />

      <ManageSubscriptionDialog
        open={showManageSubscription}
        onOpenChange={setShowManageSubscription}
      />

      <UnlockPopup
        open={unlockPopup.open}
        onOpenChange={(o) => setUnlockPopup(s => ({ ...s, open: o }))}
        reason={unlockPopup.reason}
        modeLabel={unlockPopup.modeLabel}
        onUnlock={() => usageLimits.addBonusChats()}
        onUpgrade={() => {
          setUnlockPopup(s => ({ ...s, open: false }));
          setShowSubscriptionPopup(true);
        }}
      />
    </div>
  );
};

export default Index;
