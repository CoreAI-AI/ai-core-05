import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelector } from "@/components/ModelSelector";
import { Auth } from "@/components/Auth";
import { Settings } from "@/components/Settings";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { useSettings } from "@/hooks/useSettings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  const [showSettings, setShowSettings] = useState(false);

  // Get filtered models based on settings
  const allModels = [
    { id: "openai/gpt-5", name: "GPT-5", provider: "OpenAI" },
    { id: "openai/gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI" },
    { id: "openai/gpt-5-nano", name: "GPT-5 Nano", provider: "OpenAI" },
    { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google" },
    { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google" },
    { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "Google" },
    { id: "google/gemini-2.5-flash-image-preview", name: "Gemini 2.5 Flash Image", provider: "Google" },
  ];
  
  const availableModels = settings?.enabledModels?.length > 0 
    ? allModels.filter(model => settings.enabledModels.includes(model.id))
    : allModels; // Fallback to all models if settings not loaded

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

    // Add user message to database
    const userMessage = await addMessage(chatToUse.id, content, true);
    if (!userMessage) return;

    setIsLoading(true);

    try {
      // Create AI message placeholder
      const aiMessage = await addMessage(chatToUse.id, "", false);
      if (!aiMessage) return;

      const response = await fetch(`https://zevpgdoxlghrdaummzqb.supabase.co/functions/v1/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpldnBnZG94bGdocmRhdW1tenFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTEzNTksImV4cCI6MjA3NDIyNzM1OX0.Lk16L_LrSVtQ8Ga5ZV6Tl1dvdOM_5SnQaCKzjDjfrbI',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpldnBnZG94bGdocmRhdW1tenFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTEzNTksImV4cCI6MjA3NDIyNzM1OX0.Lk16L_LrSVtQ8Ga5ZV6Tl1dvdOM_5SnQaCKzjDjfrbI',
        },
        body: JSON.stringify({ 
          message: content,
          model: selectedModel 
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

    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
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
                  <ScrollArea className="h-full">
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
                          messages.map((message, index) => (
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
                          ))
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
            
            {/* Input - Always fixed at bottom for chat interface */}
            {!showSettings && (
              <div className="shrink-0 p-4 bg-background">
                <div className="max-w-4xl mx-auto">
                  <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
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