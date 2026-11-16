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
  Brain, 
  Compass,
  X, 
  Send,
  Sparkles
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

// 4 Feature Cards with Dynamic Rotating Subtitles and Soft Pastel Themes
const featureCards = [
  {
    id: "shopping",
    icon: ShoppingCart,
    title: "Shopping",
    rotatingSubtitles: [
      "Best deals & products",
      "Find discount coupons & sales",
      "Compare gadget prices",
      "Curated shopping guides"
    ],
    // Clean pastel squircle badge matching image
    badgeClasses: "bg-orange-500/12 text-orange-500 border-orange-500/20 dark:bg-orange-500/20",
    hoverBorder: "hover:border-orange-500/40 hover:shadow-orange-500/5",
    prompt: "Help me with smart shopping research. I want to find the best quality products, real user reviews, and top deals.",
  },
  {
    id: "deep-search",
    icon: Search,
    title: "Deep Search",
    rotatingSubtitles: [
      "In-depth research",
      "Fact-checked citations",
      "Comprehensive topic analysis",
      "Uncover hidden insights"
    ],
    badgeClasses: "bg-blue-500/12 text-blue-500 border-blue-500/20 dark:bg-blue-500/20",
    hoverBorder: "hover:border-blue-500/40 hover:shadow-blue-500/5",
    prompt: "Perform deep research on a topic and provide comprehensive information with structured key insights and sources.",
  },
  {
    id: "financial",
    icon: TrendingUp,
    title: "Financial",
    rotatingSubtitles: [
      "Market insights",
      "Crypto & stock trends",
      "Smart budgeting & savings",
      "Beginner investment basics"
    ],
    badgeClasses: "bg-emerald-500/12 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
    prompt: "Help me with financial research. Provide market analysis, current trends, and practical financial planning insights.",
  },
  {
    id: "news",
    icon: Newspaper,
    title: "Today News",
    rotatingSubtitles: [
      "Latest updates",
      "Breaking global headlines",
      "Tech & AI breakthroughs",
      "Daily world briefing"
    ],
    badgeClasses: "bg-purple-500/12 text-purple-500 border-purple-500/20 dark:bg-purple-500/20",
    hoverBorder: "hover:border-purple-500/40 hover:shadow-purple-500/5",
    prompt: "Give me today's top global news stories, important geopolitical updates, and exciting technology news.",
  },
];

// Top Action Pills Row 1 & Row 2
const pillRow1 = [
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
];

const pillRow2 = [
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

// 10 Distinct Animated Greetings
const animatedGreetings = [
  "How can I help you today?",
  "What would you like to explore?",
  "Ask me anything...",
  "What should we create today?",
  "Need help with code, study, or ideas?",
  "Brainstorm your next big project",
  "Summarize, analyze, or research",
  "Generate creative images with AI",
  "Solve complex problems in seconds",
  "Let's learn something new today",
];

export const QuickActionCards = ({ onAction }: QuickActionCardsProps) => {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [subtitleCycle, setSubtitleCycle] = useState(0);
  const [selectedAction, setSelectedAction] = useState<{
    title: string;
    options: string[];
    placeholder?: string;
  } | null>(null);
  const [customInput, setCustomInput] = useState("");

  // Rotate greeting heading
  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % animatedGreetings.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  // Rotate card subtitles smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setSubtitleCycle((prev) => prev + 1);
    }, 3600);
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
    <div className="w-full max-w-lg sm:max-w-xl mx-auto px-2 sm:px-4 flex flex-col items-center justify-center select-none">
      {/* 10 Animated Greetings */}
      <div className="text-center mb-3 sm:mb-4 min-h-[50px] sm:min-h-[56px] flex items-center justify-center px-1">
        <AnimatePresence mode="wait">
          <motion.h1
            key={greetingIndex}
            initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground leading-snug"
          >
            {animatedGreetings[greetingIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Pill Modal Dialog */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full mb-3 p-3 bg-card border border-border/80 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-foreground text-xs sm:text-sm">{selectedAction.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-muted"
                onClick={() => setSelectedAction(null)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 mb-2">
              {selectedAction.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="justify-start text-left h-auto py-1.5 px-2.5 text-xs rounded-xl border-border/60 hover:bg-muted/80 whitespace-normal"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <div className="pt-2 border-t border-border/60 flex gap-2">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                placeholder={selectedAction.placeholder || "Type your prompt..."}
                className="flex-1 h-8 text-xs rounded-xl"
              />
              <Button
                size="icon"
                className="h-8 w-8 rounded-xl shrink-0 bg-primary text-primary-foreground hover:opacity-90"
                onClick={handleCustomSubmit}
                disabled={!customInput.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Pills with Staggered Entrance */}
      {!selectedAction && (
        <motion.div 
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4"
        >
          {/* Row 1: Create image, Get advice */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {pillRow1.map((action, idx) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-3.5 py-1 h-8 sm:h-8.5 rounded-full border-border/60 bg-card hover:bg-muted/70 hover:border-foreground/20 text-foreground text-xs font-medium shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                  onClick={() => handleActionClick(action)}
                >
                  <action.icon className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                  <span>{action.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Row 2: Summarize text, More */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {pillRow2.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="flex items-center gap-2 px-3.5 py-1 h-8 sm:h-8.5 rounded-full border-border/60 bg-card hover:bg-muted/70 hover:border-foreground/20 text-foreground text-xs font-medium shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                onClick={() => handleActionClick(action)}
              >
                <action.icon className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                <span>{action.title}</span>
              </Button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1.5 px-3 py-1 h-8 sm:h-8.5 rounded-full border-border/60 bg-card hover:bg-muted/70 hover:border-foreground/20 text-foreground text-xs font-medium shadow-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
                  <span>More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48 p-1.5 bg-popover border border-border/80 rounded-2xl shadow-xl z-50">
                {moreActionItems.map((action) => (
                  <DropdownMenuItem
                    key={action.id}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer rounded-xl text-xs hover:bg-muted font-medium"
                    onClick={() => handleActionClick(action)}
                  >
                    <action.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{action.title}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      )}

      {/* 4 Feature Cards: Clean 2x2 Grid with Rotating Subtitle Text */}
      <div className="w-full grid grid-cols-2 gap-2 sm:gap-2.5">
        {featureCards.map((card, index) => {
          const currentSubtitle = card.rotatingSubtitles[subtitleCycle % card.rotatingSubtitles.length];

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.05, duration: 0.28, ease: "easeOut" }}
            >
              <Card
                onClick={() => onAction(card.prompt)}
                className={`p-2.5 sm:p-3 bg-card hover:bg-muted/30 border border-border/70 ${card.hoverBorder} rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] shadow-xs group`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Clean rounded squircle icon container */}
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border ${card.badgeClasses} group-hover:scale-105 transition-transform duration-200`}>
                    <card.icon className="w-4 h-4" />
                  </div>

                  {/* Title & Dynamically Animated Subtitle */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-xs sm:text-[13px] tracking-tight truncate">
                      {card.title}
                    </h3>
                    
                    {/* Animated Rotating Subtitle Text */}
                    <div className="h-[16px] overflow-hidden relative">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentSubtitle}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="text-[10px] sm:text-[11px] text-muted-foreground/80 truncate leading-tight font-normal"
                        >
                          {currentSubtitle}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionCards;
