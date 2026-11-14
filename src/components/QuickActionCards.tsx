import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Search, 
  TrendingUp, 
  Newspaper, 
  Image as ImageIcon, 
  MessageCircle, 
  FileText, 
  MoreHorizontal, 
  Code, 
  Sparkles, 
  Brain, 
  Compass,
  X, 
  Send 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// 4 Color Coded Grid Cards (Matching exact screenshot)
const featureCards = [
  {
    id: "shopping",
    icon: ShoppingCart,
    title: "Shopping",
    description: "Best deals & products",
    colorBg: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    prompt: "Help me with shopping research. I want to find the best products, reviews, and deals.",
  },
  {
    id: "deep-search",
    icon: Search,
    title: "Deep Search",
    description: "In-depth research",
    colorBg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    prompt: "Perform deep research on a topic and provide comprehensive information with key insights.",
  },
  {
    id: "financial",
    icon: TrendingUp,
    title: "Financial",
    description: "Market insights",
    colorBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    prompt: "Help me with financial research. Provide market analysis, trends, and beginner-friendly financial insights.",
  },
  {
    id: "news",
    icon: Newspaper,
    title: "Today News",
    description: "Latest updates",
    colorBg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    prompt: "Give me today's top global news stories and important technology updates.",
  },
];

// Top Pill Actions
const mainActionPills = [
  {
    id: "create-image",
    icon: ImageIcon,
    title: "Create image",
    placeholder: "Describe the image you want to generate...",
    options: [
      "Generate a modern logo for my brand",
      "Create a 3D futuristic illustration",
      "Design a social media poster",
      "Cinematic digital art portrait",
    ],
  },
  {
    id: "get-advice",
    icon: MessageCircle,
    title: "Get advice",
    placeholder: "What do you need advice on...",
    options: [
      "Career growth and skill advice",
      "Daily time management tips",
      "Startup and solo founder guidance",
      "Effective communication strategies",
    ],
  },
  {
    id: "summarize",
    icon: FileText,
    title: "Summarize text",
    placeholder: "Paste or describe text to summarize...",
    options: [
      "Summarize long article in 5 bullet points",
      "Create quick meeting notes",
      "Explain complex research simply",
      "Extract key actionable takeaways",
    ],
  },
];

// Dropdown More Actions
const moreActionItems = [
  {
    id: "code-helper",
    icon: Code,
    title: "Code Helper",
    placeholder: "What code do you want to write or debug...",
    options: [
      "Debug my React / JavaScript code",
      "Write a Python automation script",
      "Explain algorithm time complexity",
      "Build a modern Tailwind CSS card component",
    ],
  },
  {
    id: "brainstorm",
    icon: Brain,
    title: "Brainstorm",
    placeholder: "What do you want to brainstorm...",
    options: [
      "5 viral video content ideas",
      "Creative business names",
      "Unique mobile app concepts",
      "Marketing campaign strategies",
    ],
  },
  {
    id: "explore-ideas",
    icon: Compass,
    title: "Explore ideas",
    placeholder: "Topic to explore...",
    options: [
      "Explain Quantum Computing in plain Hindi/English",
      "Future of Artificial Intelligence in 2030",
      "Space exploration milestones",
      "Learn a new skill in 30 days",
    ],
  },
];

// Bottom Suggested Prompt Pills (Matching screenshot chips above input)
const suggestionChips = [
  "Mujhe ek joke sunao",
  "Aaj ka motivational quote",
  "Explain quantum computing simply",
  "Plan my day in 5 steps",
];

// Animated rotating greetings
const animatedGreetings = [
  "How can I help you?",
  "What would you like to explore?",
  "Ask me anything...",
  "What should we create today?",
  "Need help with study, code, or ideas?",
];

export const QuickActionCards = ({ onAction }: QuickActionCardsProps) => {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<{
    title: string;
    options: string[];
    placeholder?: string;
  } | null>(null);
  const [customInput, setCustomInput] = useState("");

  // Smooth rotating text animation every 3.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % animatedGreetings.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const handleActionClick = (action: { title: string; options: string[]; placeholder?: string }) => {
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
    <div className="w-full max-w-2xl mx-auto px-3 py-4 sm:py-6 flex flex-col items-center">
      {/* Animated Greeting Title */}
      <div className="text-center mb-6 h-12 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h1
            key={greetingIndex}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground"
          >
            {animatedGreetings[greetingIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Options Modal Dialog */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full mb-5 p-4 bg-card border border-border/80 rounded-2xl shadow-lg"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {selectedAction.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="justify-start text-left h-auto py-2.5 px-3 text-xs sm:text-sm rounded-xl border-border/60 hover:bg-muted/80 whitespace-normal"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            
            {/* Custom Input */}
            <div className="pt-2 border-t border-border/60 flex gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                placeholder={selectedAction.placeholder || "Type your prompt..."}
                className="flex-1 h-9 text-xs sm:text-sm rounded-xl"
              />
              <Button
                size="icon"
                className="h-9 w-9 rounded-xl shrink-0 bg-primary text-primary-foreground hover:opacity-90"
                onClick={handleCustomSubmit}
                disabled={!customInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pill Buttons: Create image, Get advice, Summarize text, More */}
      {!selectedAction && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 justify-center mb-6"
        >
          {mainActionPills.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 h-9 rounded-full border-border/70 bg-card hover:bg-muted text-foreground text-xs sm:text-sm font-medium transition-all shadow-xs hover:border-foreground/30 active:scale-[0.98]"
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
                className="flex items-center gap-1.5 px-3.5 py-2 h-9 rounded-full border-border/70 bg-card hover:bg-muted text-foreground text-xs sm:text-sm font-medium transition-all shadow-xs hover:border-foreground/30 active:scale-[0.98]"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                <span>More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-52 p-1.5 bg-popover border border-border/80 rounded-2xl shadow-xl z-50">
              {moreActionItems.map((action) => (
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

      {/* 4 Feature Cards (2x2 Grid with colorful icon containers) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {featureCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              onClick={() => onAction(card.prompt)}
              className="p-3.5 bg-card hover:bg-muted/50 border border-border/70 hover:border-foreground/20 rounded-2xl transition-all duration-150 cursor-pointer active:scale-[0.99] shadow-xs group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${card.colorBg} group-hover:scale-105 transition-transform`}>
                  <card.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate">
                    {card.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {card.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Suggestion Chips Above Input */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full flex items-center justify-center gap-2 overflow-x-auto py-1 no-scrollbar flex-wrap"
      >
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onAction(chip)}
            className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/60 text-muted-foreground transition-all duration-150 whitespace-nowrap active:scale-95 shadow-2xs"
          >
            {chip}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default QuickActionCards;
