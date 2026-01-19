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
  title: "Shopping",
  description: "Best deals & products",
  prompt: "Help me with shopping research. I want to find the best products and deals for my needs.",
  gradient: "from-orange-500 to-pink-500"
}, {
  id: "deep-search",
  icon: Search,
  title: "Deep Search",
  description: "In-depth research",
  prompt: "Perform a deep search and provide comprehensive information on a topic I'm interested in.",
  gradient: "from-blue-500 to-cyan-500"
}, {
  id: "financial",
  icon: TrendingUp,
  title: "Financial",
  description: "Market insights",
  prompt: "Help me with financial research. Provide market analysis and investment insights.",
  gradient: "from-green-500 to-emerald-500"
}, {
  id: "news",
  icon: Newspaper,
  title: "Today News",
  description: "Latest updates",
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
    reset
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
  return <div className="w-full max-w-md mx-auto px-2">
      {/* Welcome Header - Centered like ChatGPT */}
      <motion.div initial={{
      opacity: 0,
      y: -10
    }} animate={{
      opacity: 1,
      y: 0
    }} className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
          How can I help you?
        </h1>
      </motion.div>

      {/* Quick Input with Mic and Send - Compact */}
      <motion.div initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.1
    }} className="mb-3">
        
      </motion.div>

      {/* Cancel Button - Compact */}
      {onSkip && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.15
    }} className="flex justify-center mb-2">
          
        </motion.div>}
      
      {/* Action Cards Grid - Desktop Only */}
      <div className="hidden sm:grid grid-cols-2 gap-2">
        {actions.map((action, index) => <motion.div key={action.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.1 + index * 0.03,
        duration: 0.25,
        ease: "easeOut"
      }}>
            <Card className="relative overflow-hidden p-2 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 transition-all duration-200 group cursor-pointer active:scale-[0.98]" onClick={() => onAction(action.prompt)}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${action.gradient} flex items-center justify-center shrink-0`}>
                  <action.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-xs group-hover:text-primary transition-colors truncate">
                    {action.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>)}
      </div>
    </div>;
};