import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, TrendingUp, Newspaper, X, Mic, Send, Square } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

interface QuickActionCardsProps {
  onAction: (prompt: string) => void;
  onSkip?: () => void;
}

const actions = [{
  id: "shopping",
  icon: ShoppingCart,
  title: "Shopping Research",
  description: "Find the best deals and product comparisons",
  prompt: "Help me with shopping research. I want to find the best products and deals for my needs.",
  gradient: "from-orange-500 to-pink-500"
}, {
  id: "deep-search",
  icon: Search,
  title: "Deep Search",
  description: "In-depth research on any topic",
  prompt: "Perform a deep search and provide comprehensive information on a topic I'm interested in.",
  gradient: "from-blue-500 to-cyan-500"
}, {
  id: "financial",
  icon: TrendingUp,
  title: "Financial Research",
  description: "Market analysis and financial insights",
  prompt: "Help me with financial research. Provide market analysis and investment insights.",
  gradient: "from-green-500 to-emerald-500"
}, {
  id: "news",
  icon: Newspaper,
  title: "Today News",
  description: "Get the latest news and updates",
  prompt: "Give me today's top news and important updates from around the world.",
  gradient: "from-purple-500 to-violet-500"
}];

export const QuickActionCards = ({
  onAction,
  onSkip
}: QuickActionCardsProps) => {
  const [message, setMessage] = useState("");
  const {
    isRecording,
    transcribing,
    startRecording,
    stopRecording,
    transcribe,
    reset,
  } = useVoiceRecorder();

  const handleSend = () => {
    if (message.trim()) {
      onAction(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      stopRecording();
      const text = await transcribe();
      if (text) {
        setMessage(text);
        toast.success("Voice transcribed!");
      }
      reset();
    } else {
      await startRecording();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-5"
      >
        <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-xs">
          Start a conversation or choose from quick actions
        </p>
      </motion.div>

      {/* Quick Input with Mic and Send */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <div className="flex items-end gap-1.5 bg-card border border-border rounded-2xl p-1.5 shadow-sm focus-within:border-primary/50 focus-within:shadow-md transition-all duration-200">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[40px] max-h-24 resize-none bg-transparent border-0 shadow-none text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 py-2 px-3 flex-1"
            rows={1}
          />
          
          {/* Mic Button */}
          <Button 
            type="button" 
            size="icon"
            onClick={handleVoiceRecording}
            disabled={transcribing}
            variant="ghost"
            className={`h-9 w-9 rounded-xl btn-press shrink-0 ${
              isRecording 
                ? "text-destructive bg-destructive/10 hover:bg-destructive/20" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? (
              <Square className="w-4 h-4 animate-pulse" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>

          {/* Send Button */}
          <Button 
            type="button" 
            size="icon"
            onClick={handleSend}
            disabled={!message.trim()}
            className="h-9 w-9 rounded-xl gradient-bg text-white hover:opacity-90 btn-press shadow-md disabled:opacity-50 disabled:shadow-none shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Cancel Button */}
      {onSkip && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }} 
          className="flex justify-center mb-4"
        >
          <Button variant="ghost" size="sm" onClick={onSkip} className="gap-2 text-muted-foreground hover:text-foreground text-xs h-8">
            <X className="w-3.5 h-3.5" />
            Hide quick actions
          </Button>
        </motion.div>
      )}
      
      {/* Action Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action, index) => (
          <motion.div 
            key={action.id} 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 + index * 0.05, duration: 0.3, ease: "easeOut" }}
          >
            <Card 
              className="relative overflow-hidden p-3 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 transition-all duration-300 group cursor-pointer hover:shadow-md" 
              onClick={() => onAction(action.prompt)}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors duration-200 truncate">{action.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};