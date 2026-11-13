import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  TrendingUp, 
  Image as ImageIcon, 
  MessageCircle, 
  FileText, 
  MoreHorizontal, 
  Calendar, 
  PenLine, 
  Code2, 
  Sparkles, 
  Brain, 
  X, 
  Send,
  ArrowUpRight,
  Zap
} from "lucide-react";
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

const actions = [
  {
    id: "deep-search",
    icon: Search,
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    badge: "Fast AI",
    title: "Deep Search",
    description: "In-depth research and comprehensive web analysis",
    prompt: "Perform a deep search and provide comprehensive information on a topic I am interested in.",
  },
  {
    id: "code",
    icon: Code2,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    badge: "Developer",
    title: "Code Assistant",
    description: "Debug, refactor, explain, or write algorithms",
    prompt: "Help me write, debug, and optimize code with clear explanations and best practices.",
  },
  {
    id: "create-image",
    icon: ImageIcon,
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    badge: "Studio",
    title: "Image Studio",
    description: "Generate 4K photos, illustrations and festival art",
    prompt: "Create a stunning high-resolution creative image with cinematic lighting and fine details.",
  },
  {
    id: "financial",
    icon: TrendingUp,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    badge: "Analysis",
    title: "Financial & News",
    description: "Market insights, business strategy, and top news",
    prompt: "Give me the latest market insights, financial trends, and key business highlights.",
  },
];

const mainPills = [
  {
    id: "create-image",
    icon: ImageIcon,
    title: "Create Image",
    color: "text-purple-400 border-purple-500/30 hover:border-purple-500/60 bg-purple-500/10",
    placeholder: "Describe what image you want to create...",
    options: [
      "Generate a modern logo for my startup",
      "Create a cinematic portrait with golden hour lighting",
      "Design a futuristic cyberpunk city background",
      "Traditional Indian festival celebration illustration"
    ]
  },
  {
    id: "deep-search",
    icon: Search,
    title: "Deep Search",
    color: "text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-500/10",
    placeholder: "What topic do you want to explore deeply...",
    options: [
      "Latest advancements in Artificial Intelligence 2026",
      "Step-by-step roadmap to learn Full-Stack development",
      "Best productivity systems used by tech founders",
      "Global economic outlook and upcoming trends"
    ]
  },
  {
    id: "code-help",
    icon: Code2,
    title: "Code & Debug",
    color: "text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10",
    placeholder: "Paste code or ask a programming question...",
    options: [
      "Explain React useEffect and dependency best practices",
      "Write a Python script for automated web scraping",
      "Optimize this SQL query for high-traffic database",
      "Review my code and spot performance bottlenecks"
    ]
  },
  {
    id: "summarize",
    icon: FileText,
    title: "Summarize",
    color: "text-amber-400 border-amber-500/30 hover:border-amber-500/60 bg-amber-500/10",
    placeholder: "Paste text or article link to summarize...",
    options: [
      "Summarize long article in 5 key executive bullet points",
      "Condense complex research paper into simple takeaways",
      "Create structured meeting notes and action items",
      "Draft an elevator pitch from this product description"
    ]
  }
];

const moreActions = [
  {
    id: "get-advice",
    icon: MessageCircle,
    title: "Get Advice",
    placeholder: "What do you need guidance on...",
    options: [
      "Career growth and tech interview strategy",
      "Time management and daily productivity routine",
      "Constructive communication and team management",
      "Personal finance planning for beginners"
    ]
  },
  {
    id: "help-write",
    icon: PenLine,
    title: "Help Me Write",
    placeholder: "What would you like to write...",
    options: [
      "Draft a persuasive business cold email",
      "Write a high-converting landing page headline & copy",
      "Craft an impactful LinkedIn thought-leadership post",
      "Write a friendly follow-up message"
    ]
  },
  {
    id: "make-plan",
    icon: Calendar,
    title: "Make a Plan",
    placeholder: "What are you planning...",
    options: [
      "30-day fitness and clean nutrition plan",
      "Product launch checklist and timeline",
      "Weekly study schedule for competitive exams",
      "Weekend travel itinerary and packing list"
    ]
  },
  {
    id: "brainstorm",
    icon: Brain,
    title: "Brainstorm Ideas",
    placeholder: "What do you want to brainstorm...",
    options: [
      "10 micro-SaaS business ideas with low startup cost",
      "Viral YouTube video concepts for tech niche",
      "Creative brand names and slogans",
      "Engaging features to improve user retention"
    ]
  },
  {
    id: "surprise-me",
    icon: Sparkles,
    title: "Surprise Me",
    placeholder: "Ask for an interesting insight...",
    options: [
      "Share a mind-bending scientific paradox",
      "Tell me a fascinating untold historical story",
      "Give me a thought experiment about future AI",
      "Teach me one high-leverage mental model"
    ]
  }
];

export const QuickActionCards = ({ onAction }: QuickActionCardsProps) => {
  const [selectedAction, setSelectedAction] = useState<{
    title: string;
    options: string[];
    placeholder?: string;
  } | null>(null);
  const [customInput, setCustomInput] = useState("");

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
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
      {/* Bold Animated Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="text-center mb-6 sm:mb-8"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-3 shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 fill-primary" />
          <span>CoreAI Ultra-Fast Intelligence</span>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          What can I help you <span className="bg-gradient-to-r from-primary via-cyan-400 to-teal-300 bg-clip-text text-transparent">create today?</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium max-w-md mx-auto">
          Ask any question, generate code or images, or pick a quick starter below.
        </p>
      </motion.div>

      {/* Sub-Options Interactive Modal */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-5 p-4 sm:p-5 bg-card/95 backdrop-blur-md border border-border/80 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-400 to-purple-500" />
            
            <div className="flex items-center justify-between mb-3.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="font-bold text-foreground text-sm sm:text-base tracking-tight">
                  {selectedAction.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-muted"
                onClick={() => setSelectedAction(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {selectedAction.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-between text-left py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-2xl bg-muted/40 hover:bg-muted border border-border/50 hover:border-primary/40 text-foreground transition-all group"
                  onClick={() => handleOptionClick(option)}
                >
                  <span className="truncate pr-2">{option}</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </motion.button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="mt-3.5 pt-3 border-t border-border/50">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2">Or ask your custom question:</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={customInput}
                    placeholder={selectedAction.placeholder || "Type your request here..."}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                    className="flex-1 h-10 text-xs sm:text-sm w-full rounded-2xl bg-background/80 border-border/60 focus-visible:ring-primary shadow-2xs"
                  />
                </div>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-2xl shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
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

      {/* Bold Animated Quick Action Pill Buttons */}
      {!selectedAction && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.3 }}
          className="flex flex-wrap gap-2 justify-center mb-6"
        >
          {mainPills.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl border font-semibold text-xs sm:text-sm text-foreground transition-all shadow-xs backdrop-blur-xs ${action.color}`}
              onClick={() => handleActionClick(action)}
            >
              <action.icon className="h-3.5 w-3.5" />
              <span>{action.title}</span>
            </motion.button>
          ))}

          {/* More Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-border/60 bg-card/60 hover:bg-muted text-foreground text-xs sm:text-sm font-semibold transition-all shadow-xs backdrop-blur-xs"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                <span>More</span>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 p-1.5 bg-popover/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl z-50">
              {moreActions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-xl text-xs sm:text-sm font-medium hover:bg-muted"
                  onClick={() => handleActionClick(action)}
                >
                  <action.icon className="h-4 w-4 text-primary" />
                  <span>{action.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}

      {/* Bold 2x2 Feature Cards Grid (Desktop & Tablet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.12 + index * 0.04,
              duration: 0.25,
              ease: "easeOut"
            }}
          >
            <Card
              className="p-3 bg-card/70 hover:bg-card border border-border/60 hover:border-primary/50 rounded-2xl transition-all duration-200 group cursor-pointer shadow-xs hover:shadow-md active:scale-[0.99] relative overflow-hidden"
              onClick={() => onAction(action.prompt)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 border ${action.color} shadow-xs group-hover:scale-105 transition-transform`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-foreground text-xs sm:text-sm truncate group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
                      {action.badge}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground/80 transition-colors">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all shrink-0 self-center" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
