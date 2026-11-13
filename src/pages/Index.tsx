import { useState, useEffect, useRef, useCallback } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { Auth } from "@/components/Auth";
import { Settings } from "@/components/Settings";
import { QuickActionCards } from "@/components/QuickActionCards";
import { ScrollToBottom } from "@/components/ScrollToBottom";
import { PageSkeleton } from "@/components/SkeletonLoader";
import { VirtualizedChatMessages } from "@/components/VirtualizedChatMessages";
import { SmartChatTabs } from "@/components/SmartChatTabs";
import { PinnedMessages } from "@/components/PinnedMessages";
import { QuickActionButtons } from "@/components/QuickActionButtons";
import { SubscriptionPopup } from "@/components/SubscriptionPopup";
import { ManageSubscriptionDialog } from "@/components/ManageSubscriptionDialog";
import { useSubscription } from "@/hooks/useSubscription";
import premiumLogo from "@/assets/coreai-premium-logo.png";
import { useDailyLimit } from "@/hooks/useDailyLimit";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UnlockPopup } from "@/components/UnlockPopup";
import { MemoryControl } from "@/components/MemoryControl";
import { ChatSearch } from "@/components/ChatSearch";
import { ResponseLengthControl } from "@/components/ResponseLengthControl";
import { useAuth } from "@/hooks/useAuth";
import { useChats, Chat } from "@/hooks/useChats";
import { useSettings } from "@/hooks/useSettings";
import { useOfflineDraft } from "@/hooks/useOfflineDraft";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, PanelLeft, Search, Star, Palette, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { exportChatAsText, exportChatAsPDF } from "@/lib/exportChat";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "@/components/PullToRefreshIndicator";
import { haptics } from "@/lib/haptics";
import { ReadAloudHeaderPlayer } from "@/components/ReadAloudHeaderPlayer";
import { tryLocalReply, detectSubscriptionIntent } from "@/lib/smallTalk";
import { getCached, setCached, isCacheable } from "@/lib/aiCache";
import { buildCompanionContext, followUpGreeting } from "@/lib/companionMemory";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, showAuth, signOut, setShowAuth } = useAuth();
  const { settings } = useSettings(user?.id);
  const {
    chats,
    currentChat,
    messages,
    createChat,
    addMessage,
    updateMessage,
    updateMessageLocal,
    deleteMessage,
    startNewChat,
    selectChat,
    deleteChat
  } = useChats(user?.id);
  const { isOnline } = useOfflineDraft();
  
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash");
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showManageSubscription, setShowManageSubscription] = useState(false);
  const { isPremium, activatePremium } = useSubscription();
  const { recordUsage } = useDailyLimit(user?.id, isPremium);
  const usageLimits = useUsageLimits(user?.id, isPremium);
  const [unlockPopup, setUnlockPopup] = useState<{ open: boolean; reason?: 'daily' | 'mode'; modeLabel?: string }>({ open: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze' | 'rich' | 'poor' | 'recipe' | 'homework'>('normal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 768);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGenerationPrompt, setImageGenerationPrompt] = useState<string>("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  
  const [openTabs, setOpenTabs] = useState<Chat[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [responseLength, setResponseLength] = useState<'short' | 'normal' | 'detailed'>('normal');
  const [favoriteChats, setFavoriteChats] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('favorite_chats');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [editingMessage, setEditingMessage] = useState<{
    id: string;
    content: string;
    index: number;
  } | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  // Pull to refresh
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

  // Robust Auto-Scroll: Keeps pinned to bottom while streaming unless user actively browses older messages
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
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && messages.length > 0) {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages.length]);

  useEffect(() => {
    if (currentChat && !openTabs.find(t => t.id === currentChat.id)) {
      setOpenTabs(prev => [...prev, currentChat].slice(-5));
    }
  }, [currentChat]);

  const handleCloseTab = (chatId: string) => {
    setOpenTabs(prev => prev.filter(t => t.id !== chatId));
    if (currentChat?.id === chatId && openTabs.length > 1) {
      const remainingTabs = openTabs.filter(t => t.id !== chatId);
      if (remainingTabs.length > 0) {
        selectChat(remainingTabs[remainingTabs.length - 1]);
      }
    }
  };

  const toggleFavorite = (chatId: string) => {
    setFavoriteChats(prev => {
      const next = new Set(prev);
      if (next.has(chatId)) {
        next.delete(chatId);
      } else {
        next.add(chatId);
      }
      localStorage.setItem('favorite_chats', JSON.stringify([...next]));
      return next;
    });
  };

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('bg-primary/10');
      setTimeout(() => element.classList.remove('bg-primary/10'), 2000);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (!currentChat || messages.length === 0) return;
    const lastAIMessage = [...messages].reverse().find(m => !m.is_user);
    if (!lastAIMessage) return;
    
    const actionPrompts: Record<string, string> = {
      rewrite: `Please rewrite the following response in a different way: "${lastAIMessage.content}"`,
      summarize: `Please summarize this response briefly: "${lastAIMessage.content}"`,
      translate: `Please translate this response to Hindi: "${lastAIMessage.content}"`,
      improve: `Please improve this response with more details: "${lastAIMessage.content}"`,
    };
    
    if (action === 'regenerate') {
      const aiMsgIndex = messages.findIndex(m => m.id === lastAIMessage.id);
      if (aiMsgIndex > 0) {
        handleRegenerateResponse(lastAIMessage.id, aiMsgIndex);
      }
    } else if (actionPrompts[action]) {
      handleSendMessage(actionPrompts[action]);
    }
  };

  if (authLoading) return <PageSkeleton />;
  if (showAuth || !user) return <Auth onAuthSuccess={() => setShowAuth(false)} />;

  const compressImage = (file: File, maxDim = 1280, quality = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
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

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      try {
        const compressed = await compressImage(file);
        setFilePreview(compressed);
        toast.success('Image ready');
      } catch (err) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    } else {
      setFilePreview(null);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleEditMessage = (messageId: string, content: string, index: number) => {
    setEditingMessage({ id: messageId, content, index });
  };

  const handleSendEditedMessage = async (content: string) => {
    if (!user || !editingMessage || !currentChat) return;
    const editIndex = editingMessage.index;
    const messagesToDelete = messages.slice(editIndex + 1);

    for (const msg of messagesToDelete) {
      await deleteMessage(msg.id);
    }
    await updateMessage(editingMessage.id, content);
    setEditingMessage(null);

    setIsLoading(true);
    setIsAITyping(true);
    try {
      const aiMessage = await addMessage(currentChat.id, "", false);
      if (!aiMessage) return;

      const { data: session } = await supabase.auth.getSession();
      const authToken = session?.session?.access_token;

      const updatedMessages = messages.slice(0, editIndex + 1).map(msg => msg.id === editingMessage.id ? { ...msg, content } : msg);
      const conversationHistory = updatedMessages.slice(-12).map(msg => ({
        role: msg.is_user ? 'user' : 'assistant',
        content: msg.id === editingMessage.id ? content : msg.content,
        ...(msg.images && msg.images.length > 0 ? { images: msg.images } : {})
      }));
      const modelToUse = chatMode === 'photo' ? 'google/gemini-2.5-flash-image-preview' : selectedModel;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({
          message: content,
          model: modelToUse,
          mode: chatMode,
          companion: buildCompanionContext(content),
          conversationHistory
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
      await updateMessage(aiMessage.id, accumulatedContent, receivedImages.length > 0 ? receivedImages : undefined);
    } catch (error) {
      console.error('Error regenerating AI response:', error);
      toast.error("Failed to regenerate response. Please try again.");
    } finally {
      setIsLoading(false);
      setIsAITyping(false);
    }
  };

  const handleRegenerateResponse = async (aiMessageId: string, aiMessageIndex: number) => {
    if (!user || !currentChat || isLoading) return;
    const userMessageIndex = aiMessageIndex - 1;
    if (userMessageIndex < 0) return;
    const userMessage = messages[userMessageIndex];
    if (!userMessage || !userMessage.is_user) return;
    setIsLoading(true);
    setIsAITyping(true);
    try {
      await updateMessage(aiMessageId, "");
      const { data: session } = await supabase.auth.getSession();
      const authToken = session?.session?.access_token;

      const conversationHistory = messages.slice(0, aiMessageIndex).slice(-12).map(msg => ({
        role: msg.is_user ? 'user' : 'assistant',
        content: msg.content,
        ...(msg.images && msg.images.length > 0 ? { images: msg.images } : {})
      }));
      const modelToUse = chatMode === 'photo' ? 'google/gemini-2.5-flash-image-preview' : selectedModel;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({
          message: userMessage.content,
          model: modelToUse,
          mode: chatMode,
          companion: buildCompanionContext(userMessage.content),
          conversationHistory
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
            if (parsed.content) {
              accumulatedContent += parsed.content;
              updateMessageLocal(aiMessageId, accumulatedContent);
            }
            if (parsed.images?.length > 0) {
              receivedImages = parsed.images;
              updateMessageLocal(aiMessageId, accumulatedContent, parsed.images);
            }
          } catch {}
        }
      }
      await updateMessage(aiMessageId, accumulatedContent, receivedImages.length > 0 ? receivedImages : undefined);
      toast.success("Response regenerated");
    } catch (error) {
      console.error('Error regenerating response:', error);
      toast.error("Failed to regenerate response");
    } finally {
      setIsLoading(false);
      setIsAITyping(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (editingMessage) {
      await handleSendEditedMessage(content);
      return;
    }
    if (!user) return;

    const gate = usageLimits.checkCanSend(chatMode);
    if (!gate.allowed) {
      const modeLabels: Record<string, string> = { chat: 'Chat', study: 'Study', image: 'Image', code: 'Code' };
      setUnlockPopup({
        open: true,
        reason: gate.reason,
        modeLabel: gate.limitMode ? modeLabels[gate.limitMode] : undefined,
      });
      return;
    }

    let chatToUse = currentChat;
    if (!chatToUse) {
      const chatTitle = content.length > 50 ? content.substring(0, 47) + "..." : content;
      chatToUse = await createChat(chatTitle);
      if (!chatToUse) return;
    }

    const messageImages = selectedFile && filePreview ? [{
      url: filePreview,
      type: selectedFile.type
    }] : undefined;

    const userMessage = await addMessage(chatToUse.id, content, true, messageImages);
    if (!userMessage) return;

    // Reset user scroll so chat automatically follows new messages
    userScrolledUpRef.current = false;
    forceScrollToBottom();

    if (detectSubscriptionIntent(content)) {
      if (isPremium) {
        let savedPlanName = "Premium";
        try {
          const savedPlan = localStorage.getItem("coreai_selected_plan");
          if (savedPlan) savedPlanName = JSON.parse(savedPlan)?.name || "Premium";
        } catch {}
        await addMessage(
          chatToUse.id,
          `👑 You already have the **CoreAI ${savedPlanName} plan**.\n\nYour plan includes:\n\n• Unlimited chats and image generation\n• Priority response speed\n• Ad-free Premium access`,
          false
        );
        setTimeout(() => setShowSubscriptionPopup(true), 400);
        return;
      }
      await addMessage(
        chatToUse.id,
        "CoreAI abhi sabke liye **100% free** hai — koi Premium plan ya subscription nahi hai. 🎉\n\nHar din aapko free chats milti hain, jo roz subah apne aap reset ho jaati hain. Bas chat karte rahiye! 🚀",
        false
      );
      return;
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
          'Authorization': `Bearer ${authToken || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
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
                  updateMessageLocal(aiMessage.id, accumulatedContent, images);
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
              setIsGeneratingImage(false);
              updateMessageLocal(aiMessage.id, accumulatedContent, parsed.images);
            }
          } catch {}
        }
        if (sawDone) break;
      }

      if (!accumulatedContent.trim() && receivedImages.length === 0) {
        throw new Error("No content received");
      }
      await updateMessage(aiMessage.id, accumulatedContent, receivedImages.length > 0 ? receivedImages : undefined);

      if (!selectedFile && receivedImages.length === 0 && isCacheable(content, chatMode)) {
        setCached(content, chatMode, selectedModel, accumulatedContent);
      }

      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
      setIsAITyping(false);
      setIsGeneratingImage(false);
      setImageGenerationPrompt("");
    }
  };

  const handleExportChat = async (chatId: string, format: 'text' | 'pdf') => {
    try {
      const chat = chats.find(c => c.id === chatId);
      if (!chat) {
        toast.error("Chat not found");
        return;
      }
      const { data: chatMessages, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
      if (error) throw error;
      if (!chatMessages || chatMessages.length === 0) {
        toast.error("No messages to export");
        return;
      }
      if (format === 'text') {
        exportChatAsText(chat.title, chatMessages);
        toast.success("Chat exported as text");
      } else {
        await exportChatAsPDF(chat.title, chatMessages);
        toast.success("Chat exported as PDF");
      }
    } catch (error) {
      console.error('Error exporting chat:', error);
      toast.error("Failed to export chat");
    }
  };

  return (
    <div className={`flex h-[100dvh] w-full bg-background overflow-hidden overscroll-none ${isPremium ? "premium-mode" : ""}`}>
      {/* Sidebar Drawer */}
      <AnimatePresence mode="wait">
        {!sidebarCollapsed && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden" 
              onClick={() => setSidebarCollapsed(true)} 
            />
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} 
              className="fixed md:static h-full w-[280px] z-50 md:z-auto shrink-0 bg-sidebar border-r border-sidebar-border/40 shadow-xl md:shadow-none"
            >
              <ChatSidebar 
                chats={chats} 
                currentChat={currentChat} 
                onSelectChat={chat => {
                  selectChat(chat);
                  if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarCollapsed(true);
                }} 
                onNewChat={() => {
                  startNewChat();
                  if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarCollapsed(true);
                }} 
                onSignOut={signOut} 
                onOpenSettings={() => {
                  setShowSettings(true);
                  if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarCollapsed(true);
                }} 
                onDeleteChat={deleteChat} 
                onExportChat={handleExportChat} 
                user={user} 
                onCollapse={() => setSidebarCollapsed(true)} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 chat-layout-mobile relative">
        <div className="flex flex-col h-full relative">
          {showSettings ? (
            <div className="flex flex-col h-full bg-background">
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <h2 className="text-lg font-bold tracking-tight text-foreground">Settings</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSettings(false)} 
                  className="h-8 w-8 p-0 rounded-full hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4 sm:p-6">
                <div className="max-w-3xl mx-auto">
                  <Settings user={user} />
                </div>
              </ScrollArea>
            </div>
          ) : (
            <>
              {/* Desktop Smart Tabs */}
              <div className="hidden md:block">
                <SmartChatTabs 
                  openChats={openTabs} 
                  activeChat={currentChat} 
                  onSelectTab={selectChat} 
                  onCloseTab={handleCloseTab} 
                  onNewTab={startNewChat} 
                />
              </div>

              {/* Bold Modern Header */}
              <header className="glass-navbar px-3 py-2.5 sm:px-4 sm:py-3 flex justify-between items-center shrink-0 gap-2 z-20 border-b border-border/40 backdrop-blur-md bg-background/80">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
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

                  {/* Bold Search Trigger */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowSearch(true)} 
                    className="h-8 px-2 sm:px-2.5 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-xl border border-border/30 transition-all shadow-2xs" 
                    title="Search chat" 
                    disabled={messages.length === 0}
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

              {/* Scrollable Messages Canvas with Auto-Scroll & Pull to Refresh */}
              <div 
                className="chat-messages-container" 
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
                
                <div className="p-2 sm:p-4 md:p-6 pb-6 min-h-full flex flex-col">
                  <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
                    {messages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10">
                        <AnimatePresence mode="wait">
                          {showQuickActions ? (
                            <motion.div 
                              key="cards" 
                              className="w-full max-w-xl px-2" 
                              initial={{ opacity: 0, y: 16 }} 
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

          {/* Input - Always fixed at bottom with sticky positioning */}
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
                <div className="p-4">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      {filePreview && <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                      }}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="px-2 py-3 sm:p-4">
                <div className="max-w-3xl mx-auto w-full">
                  {!isPremium && (
                    <p className="text-center text-xs text-muted-foreground pb-1" aria-live="polite">
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
                    getRemaining={getRemaining} 
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
        onUpgrade={() => {
          activatePremium();
          setShowSubscriptionPopup(false);
          toast.success("Premium activated! 🎉");
        }}
      />
      <ManageSubscriptionDialog
        open={showManageSubscription}
        onOpenChange={setShowManageSubscription}
        onUpgradeClick={() => setShowSubscriptionPopup(true)}
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
