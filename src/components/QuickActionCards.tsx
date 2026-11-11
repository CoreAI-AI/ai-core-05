import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, TrendingUp, Newspaper, Image, MessageCircle, FileText, MoreHorizontal, Calendar, PenLine, Code, Sparkles, Brain, ImageIcon, X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
}, {
  id: "deep-search",
  icon: Search,
  title: "Deep Search",
  description: "In-depth research",
  prompt: "Perform a deep search and provide comprehensive information on a topic I'm interested in.",
}, {
  id: "financial",
  icon: TrendingUp,
  title: "Financial",
  description: "Market insights",
  prompt: "Help me with financial research. Provide market analysis and investment insights.",
}, {
  id: "news",
  icon: Newspaper,
  title: "Today News",
  description: "Latest updates",
  prompt: "Give me today's top news and important updates from around the world.",
}];

// Main quick actions
const mainActions = [
  {
    id: "create-image",
    icon: Image,
    title: "Create image",
    placeholder: "Describe what image you want...",
    options: [
      "Generate a logo for my brand",
      "Create an illustration for my blog",
      "Design a social media post",
      "Make an artistic portrait"
    ]
  },
  {
    id: "get-advice",
    icon: MessageCircle,
    title: "Get advice",
    placeholder: "What do you need advice on...",
    options: [
      "Career guidance",
      "Relationship advice",
      "Health & wellness tips",
      "Financial planning"
    ]
  },
  {
    id: "summarize",
    icon: FileText,
    title: "Summarize text",
    placeholder: "Paste or describe the text to summarize...",
    options: [
      "Summarize an article",
      "Create meeting notes",
      "Condense a research paper",
      "Simplify complex content"
    ]
  }
];

// More menu actions
const moreActions = [
  {
    id: "make-plan",
    icon: Calendar,
    title: "Make a plan",
    placeholder: "What do you want to plan...",
    options: [
      "Plan a vacation trip",
      "Create a workout schedule",
      "Organize a project timeline",
      "Plan a weekly meal prep"
    ]
  },
  {
    id: "help-write",
    icon: PenLine,
    title: "Help me write",
    placeholder: "What do you want to write...",
    options: [
      "Write an email",
      "Draft a cover letter",
      "Create social media content",
      "Write a blog post"
    ]
  },
  {
    id: "code",
    icon: Code,
    title: "Code",
    placeholder: "Describe your coding task...",
    options: [
      "Debug my code",
      "Explain a concept",
      "Write a function",
      "Review my code"
    ]
  },
  {
    id: "surprise-me",
    icon: Sparkles,
    title: "Surprise me",
    placeholder: "What kind of surprise...",
    options: [
      "Tell me a fun fact",
      "Share an interesting story",
      "Give me a random challenge",
      "Suggest something new to try"
    ]
  },
  {
    id: "brainstorm",
    icon: Brain,
    title: "Brainstorm",
    placeholder: "What topic to brainstorm...",
    options: [
      "Business ideas",
      "Creative project concepts",
      "Problem-solving strategies",
      "Content ideas"
    ]
  },
  {
    id: "analyze-image",
    icon: ImageIcon,
    title: "Analyze image",
    placeholder: "Describe what to analyze...",
    options: [
      "Describe what's in this image",
      "Extract text from image",
      "Identify objects or people",
      "Analyze image composition"
    ]
  }
];

export const QuickActionCards = ({
  onAction,
}: QuickActionCardsProps) => {
  const [selectedAction, setSelectedAction] = useState<{
    title: string;
    options: string[];
    placeholder?: string;
  } | null>(null);
  const [customInput, setCustomInput] = useState("");

  const handleActionClick = (action: { title: string; options: string[] }) => {
    setSelectedAction(action);
    setCustomInput("");
  };

  const handleOptionClick = (option: string) => {
    onAction(option);
    setSelectedAction(null);
    setCustomInput("");
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      onAction(`${selectedAction?.title}: ${customInput.trim()}`);
      setSelectedAction(null);
      setCustomInput("");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3">
      {/* Welcome Header - Minimalist & Centered */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          What can I help with?
        </h1>
      </motion.div>

      {/* Options Modal */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="mb-4 p-4 bg-card border border-border/80 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground text-sm">{selectedAction.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-muted"
                onClick={() => setSelectedAction(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {selectedAction.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 px-3 text-xs sm:text-sm rounded-xl border-border/60 hover:bg-muted/70"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            
            {/* Custom Input */}
            <div className="mt-3 pt-3 border-t border-border/60">
              <p className="text-[11px] text-muted-foreground mb-1.5">Or type your own:</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={selectedAction.placeholder}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs sm:text-sm pointer-events-none"
                      style={{ display: customInput ? 'none' : 'block' }}
                    >
                      {selectedAction.placeholder || "Type your request..."}
                    </motion.span>
                  </AnimatePresence>
                  <Input
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                    className="flex-1 h-9 text-xs sm:text-sm w-full rounded-xl"
                  />
                </div>
                <Button
                  size="icon"
                  className="h-9 w-9 rounded-xl shrink-0 bg-foreground text-background hover:opacity-90"
                  onClick={handleCustomSubmit}
                  disabled={!customInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Action Pill Buttons */}
      {!selectedAction && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-6"
        >
          {mainActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 rounded-full border-border/60 bg-card/60 hover:bg-muted/80 text-foreground text-xs sm:text-sm font-medium transition-all shadow-2xs hover:border-foreground/20 active:scale-[0.98]"
              onClick={() => handleActionClick(action)}
            >
              <action.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{action.title}</span>
            </Button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border-border/60 bg-card/60 hover:bg-muted/80 text-foreground text-xs sm:text-sm font-medium transition-all shadow-2xs hover:border-foreground/20 active:scale-[0.98]"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                <span>More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-52 p-1.5 bg-popover border border-border/80 rounded-2xl shadow-xl z-50">
              {moreActions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-xs sm:text-sm"
                  onClick={() => handleActionClick(action)}
                >
                  <action.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{action.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}

      {/* Action Cards Grid - Desktop Minimalist */}
      <div className="hidden sm:grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1 + index * 0.03,
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            <Card
              className="p-2.5 bg-card/50 hover:bg-muted/60 border border-border/50 hover:border-foreground/20 rounded-2xl transition-all duration-150 group cursor-pointer active:scale-[0.99] shadow-2xs"
              onClick={() => onAction(action.prompt)}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-muted/80 flex items-center justify-center shrink-0 border border-border/40">
                  <action.icon className="w-3.5 h-3.5 text-foreground/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-xs truncate">
                    {action.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
