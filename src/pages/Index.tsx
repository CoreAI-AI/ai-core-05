import { useState, useEffect, useRef } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelector } from "@/components/ModelSelector";
import { Auth } from "@/components/Auth";
import { Settings } from "@/components/Settings";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { useSettings } from "@/hooks/useSettings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, loading: authLoading, showAuth, signOut, setShowAuth } = useAuth();
  const { settings } = useSettings(user?.id);
  const { 
    chats, 
    currentChat, 
    messages, 
    createChat, 
    addMessage, 
    updateMessage, 
    startNewChat, 
    selectChat,
    deleteChat
  } = useChats(user?.id);
  
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash");
  const [isLoading, setIsLoading] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze'>('normal');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get filtered models based on settings
  const allModels = [
    { 
      id: "openai/gpt-5", 
      name: "GPT-5", 
      provider: "OpenAI",
      description: "Most powerful OpenAI model with excellent reasoning and multimodal capabilities"
    },
    { 
      id: "openai/gpt-5-mini", 
      name: "GPT-5 Mini", 
      provider: "OpenAI",
      description: "Faster and cost-efficient with strong reasoning capabilities"
    },
    { 
      id: "openai/gpt-5-nano", 
      name: "GPT-5 Nano", 
      provider: "OpenAI",
      description: "Fastest and cheapest for simple tasks and high-volume workloads"
    },
    { 
      id: "google/gemini-2.5-pro", 
      name: "Gemini 2.5 Pro", 
      provider: "Google",
      description: "Top-tier Gemini with best image-text, big context, and complex reasoning"
    },
    { 
      id: "google/gemini-2.5-flash", 
      name: "Gemini 2.5 Flash", 
      provider: "Google",
      description: "Balanced performance with good multimodal and reasoning at lower cost"
    },
    { 
      id: "google/gemini-2.5-flash-lite", 
      name: "Gemini 2.5 Flash Lite", 
      provider: "Google",
      description: "Fastest Gemini for classification and summarization tasks"
    },
    { 
      id: "google/gemini-2.5-flash-image-preview", 
      name: "Nano Banana", 
      provider: "Google",
      description: "Image generation model that creates visuals from text prompts"
    },
  ];
  
  const availableModels = settings?.enabledModels?.length > 0 
    ? allModels.filter(model => settings.enabledModels.includes(model.id))
    : allModels; // Fallback to all models if settings not loaded

  // Auto-scroll to bottom when messages or typing indicator changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTop = viewport.scrollHeight;
        });
      }
    }
  }, [messages, isAITyping]);

  // If loading, show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // Show auth page only if user has logged out or there's an auth error
  if (showAuth) {
    return <Auth onAuthSuccess={() => setShowAuth(false)} />;
  }

  // If no user but not showing auth, we're in the process of auto-logging in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Setting up demo account...</div>
        </div>
      </div>
    );
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    
    toast.success(`File selected: ${file.name}`);
  };

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    let chatToUse = currentChat;
    
    // Create a new chat if none exists
    if (!chatToUse) {
      const chatTitle = content.length > 50 
        ? content.substring(0, 47) + "..." 
        : content;
      
      chatToUse = await createChat(chatTitle);
      if (!chatToUse) return;
    }

    // Prepare images array if file is selected
    const messageImages = selectedFile && filePreview ? [{ url: filePreview, type: selectedFile.type }] : undefined;

    // Add user message to database with images
    const userMessage = await addMessage(chatToUse.id, content, true, messageImages);
    if (!userMessage) return;

    setIsLoading(true);
    setIsAITyping(true);

    try {
      // Create AI message placeholder
      const aiMessage = await addMessage(chatToUse.id, "", false);
      if (!aiMessage) return;

      const { data: session } = await supabase.auth.getSession();
      const authToken = session?.session?.access_token;

      // Prepare text content for non-image files
      let fileTextToSend: string | undefined;
      let fileNameToSend: string | undefined;
      if (selectedFile && !selectedFile.type.startsWith('image/')) {
        try {
          const txt = await selectedFile.text();
          fileTextToSend = txt.slice(0, 12000); // limit to avoid huge payloads
          fileNameToSend = selectedFile.name;
        } catch (e) {
          console.warn('Failed to read file as text:', e);
        }
      }
      
      // Limit conversation history to last 20 messages for better performance
      const recentMessages = messages.slice(-20);
      
      const conversationHistory = recentMessages.map(msg => {
        const historyItem: any = {
          role: msg.is_user ? 'user' : 'assistant',
          content: msg.content
        };
        
        // Include images from previous messages
        if (msg.images && msg.images.length > 0) {
          historyItem.images = msg.images;
        }
        
        return historyItem;
      });
      
      // Use image generation model if in photo mode
      const modelToUse = chatMode === 'photo' ? 'google/gemini-2.5-flash-image-preview' : selectedModel;
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ 
          message: content,
          model: modelToUse,
          mode: chatMode,
          image: filePreview,
          fileText: fileTextToSend,
          fileName: fileNameToSend,
          conversationHistory: conversationHistory,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";
      let receivedImages: any[] = [];
      let buffer = "";
      let sawDone = false;
      
      // Hide typing indicator once streaming starts
      setIsAITyping(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // process any remaining buffered line
          if (buffer.length > 0) {
            const line = buffer;
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data !== '[DONE]') {
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.content;
                  const images = parsed.images;
                  if (content) {
                    accumulatedContent += content;
                    await updateMessage(aiMessage.id, accumulatedContent);
                  }
                  if (images && images.length > 0) {
                    receivedImages = images;
                    await updateMessage(aiMessage.id, accumulatedContent, images);
                  }
                } catch {}
              }
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ""; // keep last partial line

        for (const line of lines) {
          if (!line.trim()) continue; // Skip empty lines
          if (!line.startsWith('data: ')) continue;
          
          const data = line.slice(6);
          if (data === '[DONE]') {
            sawDone = true;
            break;
          }
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.content;
            const images = parsed.images;
            
            if (content) {
              accumulatedContent += content;
              await updateMessage(aiMessage.id, accumulatedContent);
            }
            if (images && images.length > 0) {
              receivedImages = images;
              await updateMessage(aiMessage.id, accumulatedContent, images);
            }
          } catch (error) {
            // Log parsing errors for debugging but continue processing
            console.log(`Failed to parse streaming data: ${data.substring(0, 50)}...`);
          }
        }
        if (sawDone) break;
      }

      if (!accumulatedContent.trim() && receivedImages.length === 0) {
        throw new Error("No content or images received from AI");
      }

      if (receivedImages.length > 0) {
        await updateMessage(aiMessage.id, accumulatedContent, receivedImages);
      }

      // Clear selected file after sending
      setSelectedFile(null);
      setFilePreview(null);

    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
      setIsAITyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel defaultSize={22} minSize={14} maxSize={40}>
          <ChatSidebar 
            chats={chats}
            currentChat={currentChat}
            onSelectChat={selectChat}
            onNewChat={startNewChat}
            onSignOut={signOut}
            onOpenSettings={() => setShowSettings(true)}
            onDeleteChat={deleteChat}
            user={user}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex flex-col h-full relative">
            {showSettings ? (
              // Settings Panel
              <div className="flex flex-col h-full">
                {/* Settings Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Settings</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Settings Content */}
                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-4xl mx-auto">
                    <Settings user={user} />
                  </div>
                </ScrollArea>
              </div>
            ) : (
              // Main Chat Interface
              <>
                {/* Header */}
                <div className="border-b border-border p-4 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-4">
                    <h1 className="text-lg font-medium text-foreground">
                      {currentChat ? currentChat.title : "New conversation"}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <ModelSelector 
                      selectedModel={selectedModel}
                      onModelChange={setSelectedModel}
                      availableModels={availableModels}
                    />
                  </div>
                </div>
                
                {/* Messages - scrollable area with fixed height */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-6 pb-4">
                      <div className="max-w-4xl mx-auto">
                        {messages.length === 0 ? (
                          <div className="flex items-center justify-center min-h-[60vh] text-center">
                            <div className="text-foreground">
                              <h2 className="text-2xl font-semibold mb-2">Start a new conversation</h2>
                              <p>Type a message below to begin chatting with AI</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {messages.map((message, index) => (
                              <ChatMessage
                                key={message.id}
                                message={message.content}
                                isUser={message.is_user}
                                timestamp={new Date(message.created_at).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                                images={message.images}
                                isLoading={!message.is_user && !message.content && isLoading && index === messages.length - 1}
                              />
                            ))}
                            <TypingIndicator show={isAITyping} />
                          </>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
            
            {/* Input - Always fixed at bottom for chat interface */}
            {!showSettings && (
              <div className="shrink-0 bg-background">
                {/* File Preview */}
                {selectedFile && (
                  <div className="border-t border-border p-4">
                    <div className="max-w-4xl mx-auto">
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        {filePreview && (
                          <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <div className="max-w-4xl mx-auto">
                    <ChatInput 
                      onSendMessage={handleSendMessage} 
                      disabled={isLoading}
                      onFileSelect={handleFileSelect}
                      onModeChange={setChatMode}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;