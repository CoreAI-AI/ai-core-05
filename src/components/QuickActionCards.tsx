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
  GraduationCap, 
  Utensils, 
  Briefcase, 
  Dumbbell, 
  RefreshCw,
  Calculator,
  Mail,
  Languages,
  Scale,
  Sparkles,
  Gamepad2,
  Heart,
  BookOpen,
  PiggyBank,
  Lightbulb,
  Plane,
  Zap
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
  onAction?: (prompt: string) => void;
  onCardClick?: (prompt: string) => void;
  onSkip?: () => void;
}

// 10 Animated Rotating Headlines
const headlinePhrases = [
  "What should we create today?",
  "How can I help you today?",
  "What's on your mind?",
  "What do you want to explore?",
  "What shall we discover today?",
  "Let's build something amazing.",
  "Ask anything, learn everything.",
  "What would you like to write?",
  "Ready to brainstorm together?",
  "What should we solve today?",
];

// 6 Dynamic Card Sets (Total 24 Distinct CoreAI Modes & Action Cards)
const cardSets = [
  // Set 1: Essential Insights
  [
    {
      id: "shopping",
      icon: ShoppingCart,
      title: "Shopping",
      description: "Best deals & products",
      badgeClasses: "bg-orange-500/12 text-orange-500 border-orange-500/20 dark:bg-orange-500/20",
      hoverBorder: "hover:border-orange-500/40 hover:shadow-orange-500/5",
      prompt: "Help me with smart shopping research. I want to find the best quality products, real user reviews, and top deals.",
    },
    {
      id: "deep-search",
      icon: Search,
      title: "Deep Search",
      description: "In-depth research",
      badgeClasses: "bg-blue-500/12 text-blue-500 border-blue-500/20 dark:bg-blue-500/20",
      hoverBorder: "hover:border-blue-500/40 hover:shadow-blue-500/5",
      prompt: "Perform a deep search on current breakthrough technologies and provide a structured, in-depth breakdown.",
    },
    {
      id: "financial",
      icon: TrendingUp,
      title: "Financial",
      description: "Market insights",
      badgeClasses: "bg-emerald-500/12 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
      prompt: "Provide practical financial management, savings, and investment principles for building long-term wealth.",
    },
    {
      id: "today-news",
      icon: Newspaper,
      title: "Today News",
      description: "Latest updates",
      badgeClasses: "bg-purple-500/12 text-purple-500 border-purple-500/20 dark:bg-purple-500/20",
      hoverBorder: "hover:border-purple-500/40 hover:shadow-purple-500/5",
      prompt: "What are today's top global news stories, major technology developments, and key market headlines?",
    },
  ],
  // Set 2: Developer & Creative
  [
    {
      id: "code-assistant",
      icon: Code,
      title: "Code Assistant",
      description: "Clean syntax & debug",
      badgeClasses: "bg-violet-500/12 text-violet-500 border-violet-500/20 dark:bg-violet-500/20",
      hoverBorder: "hover:border-violet-500/40 hover:shadow-violet-500/5",
      prompt: "Help me write clean, modular, and optimized code with best practices and clear explanations.",
    },
    {
      id: "homework-helper",
      icon: GraduationCap,
      title: "Homework Helper",
      description: "Step-by-step solver",
      badgeClasses: "bg-amber-500/12 text-amber-500 border-amber-500/20 dark:bg-amber-500/20",
      hoverBorder: "hover:border-amber-500/40 hover:shadow-amber-500/5",
      prompt: "Solve this academic problem step-by-step with clear formulas, working steps, and concept recap.",
    },
    {
      id: "image-studio",
      icon: ImageIcon,
      title: "Image Studio",
      description: "Visuals & art prompts",
      badgeClasses: "bg-cyan-500/12 text-cyan-500 border-cyan-500/20 dark:bg-cyan-500/20",
      hoverBorder: "hover:border-cyan-500/40 hover:shadow-cyan-500/5",
      prompt: "Generate a stunning, photorealistic concept art visual with cinematic lighting and 4K details.",
    },
    {
      id: "creative-writing",
      icon: Brain,
      title: "Creative Writing",
      description: "Stories, poems & scripts",
      badgeClasses: "bg-pink-500/12 text-pink-500 border-pink-500/20 dark:bg-pink-500/20",
      hoverBorder: "hover:border-pink-500/40 hover:shadow-pink-500/5",
      prompt: "Write an engaging, highly imaginative story with vivid character arcs and deep emotional tension.",
    },
  ],
  // Set 3: Productivity & Wealth Mindset
  [
    {
      id: "study-notes",
      icon: BookOpen,
      title: "Study Notes",
      description: "Key takeaways & revision",
      badgeClasses: "bg-teal-500/12 text-teal-500 border-teal-500/20 dark:bg-teal-500/20",
      hoverBorder: "hover:border-teal-500/40 hover:shadow-teal-500/5",
      prompt: "Generate concise, high-yield study notes with bullet points, mnemonics, and exam review questions.",
    },
    {
      id: "analyze-summary",
      icon: FileText,
      title: "Analyze & Summary",
      description: "Data & pattern insights",
      badgeClasses: "bg-indigo-500/12 text-indigo-500 border-indigo-500/20 dark:bg-indigo-500/20",
      hoverBorder: "hover:border-indigo-500/40 hover:shadow-indigo-500/5",
      prompt: "Analyze this text or data critically. Extract the key metrics, main findings, and actionable conclusions.",
    },
    {
      id: "rich-mode",
      icon: TrendingUp,
      title: "Rich Mode",
      description: "Wealth & investor mindset",
      badgeClasses: "bg-emerald-500/12 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
      prompt: "Advise me with an investor mindset on creating cash flow, acquiring assets, and building scalable wealth.",
    },
    {
      id: "poor-mode",
      icon: PiggyBank,
      title: "Poor Mode",
      description: "Savings & zero-waste hacks",
      badgeClasses: "bg-amber-600/12 text-amber-600 border-amber-600/20 dark:bg-amber-600/20",
      hoverBorder: "hover:border-amber-600/40 hover:shadow-amber-600/5",
      prompt: "Give me aggressive cost-cutting strategies, zero-waste budgeting hacks, and ways to live on minimum spend.",
    },
  ],
  // Set 4: Lifestyle, Health & Science
  [
    {
      id: "recipe-cooking",
      icon: Utensils,
      title: "Recipe & Cooking",
      description: "Dishes, ingredients & tips",
      badgeClasses: "bg-red-500/12 text-red-500 border-red-500/20 dark:bg-red-500/20",
      hoverBorder: "hover:border-red-500/40 hover:shadow-red-500/5",
      prompt: "Give me an authentic, delicious recipe with exact measurements, step-by-step method, and chef secret tips.",
    },
    {
      id: "career-coach",
      icon: Briefcase,
      title: "Career Coach",
      description: "Resume, interview & growth",
      badgeClasses: "bg-blue-600/12 text-blue-600 border-blue-600/20 dark:bg-blue-600/20",
      hoverBorder: "hover:border-blue-600/40 hover:shadow-blue-600/5",
      prompt: "Review my career direction, offer resume improvements, and guide me on cracking top interviews.",
    },
    {
      id: "fitness-health",
      icon: Dumbbell,
      title: "Fitness & Health",
      description: "Workouts, diet & wellness",
      badgeClasses: "bg-green-500/12 text-green-500 border-green-500/20 dark:bg-green-500/20",
      hoverBorder: "hover:border-green-500/40 hover:shadow-green-500/5",
      prompt: "Create a balanced workout routine and clean nutrition plan designed for sustainable fitness and high energy.",
    },
    {
      id: "science-tech",
      icon: Sparkles,
      title: "Science & Tech",
      description: "Quantum, AI & innovation",
      badgeClasses: "bg-fuchsia-500/12 text-fuchsia-500 border-fuchsia-500/20 dark:bg-fuchsia-500/20",
      hoverBorder: "hover:border-fuchsia-500/40 hover:shadow-fuchsia-500/5",
      prompt: "Explain the latest discoveries in artificial intelligence, astrophysics, and quantum computing simply.",
    },
  ],
  // Set 5: Skills, Law & Travel
  [
    {
      id: "language-tutor",
      icon: Languages,
      title: "Language Tutor",
      description: "Grammar, speech & vocab",
      badgeClasses: "bg-sky-500/12 text-sky-500 border-sky-500/20 dark:bg-sky-500/20",
      hoverBorder: "hover:border-sky-500/40 hover:shadow-sky-500/5",
      prompt: "Teach me useful conversational phrases, grammar rules, and pronunciation in my target language.",
    },
    {
      id: "legal-advisor",
      icon: Scale,
      title: "Legal Advisor",
      description: "Contracts, rights & clauses",
      badgeClasses: "bg-slate-500/12 text-slate-500 border-slate-500/20 dark:bg-slate-500/20",
      hoverBorder: "hover:border-slate-500/40 hover:shadow-slate-500/5",
      prompt: "Explain the key terms, obligations, and risk clauses commonly found in standard service agreements.",
    },
    {
      id: "travel-planner",
      icon: Plane,
      title: "Travel Planner",
      description: "Itineraries & budget guides",
      badgeClasses: "bg-yellow-500/12 text-yellow-500 border-yellow-500/20 dark:bg-yellow-500/20",
      hoverBorder: "hover:border-yellow-500/40 hover:shadow-yellow-500/5",
      prompt: "Plan a cost-effective, culturally rich 5-day travel itinerary with top places, local food, and hidden gems.",
    },
    {
      id: "life-habits",
      icon: Lightbulb,
      title: "Life & Habits",
      description: "Focus, routine & discipline",
      badgeClasses: "bg-rose-500/12 text-rose-500 border-rose-500/20 dark:bg-rose-500/20",
      hoverBorder: "hover:border-rose-500/40 hover:shadow-rose-500/5",
      prompt: "How can I build unstoppable daily focus, avoid burnout, and stick to positive habits consistently?",
    },
  ],
  // Set 6: Logic, Strategy & Gaming
  [
    {
      id: "math-logic",
      icon: Calculator,
      title: "Math & Logic",
      description: "Puzzles, calculus & proofs",
      badgeClasses: "bg-lime-500/12 text-lime-500 border-lime-500/20 dark:bg-lime-500/20",
      hoverBorder: "hover:border-lime-500/40 hover:shadow-lime-500/5",
      prompt: "Break down this complex mathematical or logical problem with step-by-step rigorous proof.",
    },
    {
      id: "gaming-lore",
      icon: Gamepad2,
      title: "Gaming & Lore",
      description: "Worldbuilding & meta guides",
      badgeClasses: "bg-purple-600/12 text-purple-600 border-purple-600/20 dark:bg-purple-600/20",
      hoverBorder: "hover:border-purple-600/40 hover:shadow-purple-600/5",
      prompt: "Give me deep lore analysis, optimal character builds, and strategic gameplay guides for modern titles.",
    },
    {
      id: "startup-pitch",
      icon: Compass,
      title: "Startup Pitch",
      description: "Decks, TAM & unit economics",
      badgeClasses: "bg-blue-500/12 text-blue-500 border-blue-500/20 dark:bg-blue-500/20",
      hoverBorder: "hover:border-blue-500/40 hover:shadow-blue-500/5",
      prompt: "Help me structure an investor pitch deck with value proposition, market sizing, and monetization model.",
    },
    {
      id: "book-summaries",
      icon: Heart,
      title: "Book Summaries",
      description: "Core principles & wisdom",
      badgeClasses: "bg-amber-500/12 text-amber-500 border-amber-500/20 dark:bg-amber-500/20",
      hoverBorder: "hover:border-amber-500/40 hover:shadow-amber-500/5",
      prompt: "Summarize the core mental models and actionable life lessons from the world's most influential non-fiction books.",
    },
  ],
];

export const QuickActionCards = ({ onAction, onCardClick }: QuickActionCardsProps) => {
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [selectedAction, setSelectedAction] = useState<{
    title: string;
    options: string[];
    placeholder?: string;
    icon?: any;
  } | null>(null);
  const [customInput, setCustomInput] = useState("");

  const triggerAction = (prompt: string) => {
    if (onCardClick) onCardClick(prompt);
    if (onAction) onAction(prompt);
  };

  // Rotate headline phrases every 2.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlinePhrases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Rotate 24 cards (6 sets of 4) every 1.5 seconds with hover pause
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSetIndex((prev) => (prev + 1) % cardSets.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePillClick = (actionType: string) => {
    switch (actionType) {
      case "image":
        setSelectedAction({
          title: "Create Image",
          icon: ImageIcon,
          options: [
            "A serene Japanese zen garden in autumn at twilight, 4K photorealistic",
            "Futuristic cyberpunk city street with neon lights in rain",
            "Cute animated red panda wearing a tiny backpack in bamboo forest",
            "Hyper-detailed portrait of an Indian warrior king, cinematic lighting",
          ],
          placeholder: "Describe the image you want CoreAI to generate...",
        });
        break;
      case "advice":
        setSelectedAction({
          title: "Get Advice",
          icon: MessageCircle,
          options: [
            "How do I manage time better and stop procrastinating?",
            "What habits help someone become financially independent?",
            "How can I prepare effectively for a high-stakes job interview?",
            "Tips for maintaining mental clarity during stressful workloads",
          ],
          placeholder: "What situation or decision do you need guidance on?",
        });
        break;
      case "summarize":
        setSelectedAction({
          title: "Summarize Text",
          icon: FileText,
          options: [
            "Summarize the key differences between AI models",
            "Explain quantum computing in 3 simple sentences",
            "Key takeaways of atomic habits and daily progress",
            "How does global monetary inflation work?",
          ],
          placeholder: "Paste or describe the text/topic you want summarized...",
        });
        break;
      default:
        break;
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    triggerAction(`${selectedAction?.title || "Request"}: ${customInput.trim()}`);
    setSelectedAction(null);
    setCustomInput("");
  };

  const currentCards = cardSets[activeSetIndex];

  return (
    <div 
      className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
          {/* Center Heading with smooth responsive text animation */}
      <div className="w-full text-center mb-4 sm:mb-5 min-h-[52px] sm:min-h-[44px] flex items-center justify-center px-3">
        <AnimatePresence mode="wait">
          <motion.h2
            key={headlineIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground font-sans max-w-xs sm:max-w-md mx-auto leading-snug"
          >
            {headlinePhrases[headlineIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* 4 Action Pills */}
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        <button
          type="button"
          onClick={() => handlePillClick("image")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-background border border-border/70 hover:border-foreground/30 hover:bg-muted/60 text-foreground transition-all shadow-xs"
        >
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Create image</span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("advice")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-background border border-border/70 hover:border-foreground/30 hover:bg-muted/60 text-foreground transition-all shadow-xs"
        >
          <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Get advice</span>
        </button>

        <button
          type="button"
          onClick={() => handlePillClick("summarize")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-background border border-border/70 hover:border-foreground/30 hover:bg-muted/60 text-foreground transition-all shadow-xs"
        >
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Summarize text</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-background border border-border/70 hover:border-foreground/30 hover:bg-muted/60 text-foreground transition-all shadow-xs"
            >
              <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span>More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-border">
            <DropdownMenuItem 
              onClick={() => triggerAction("Help me brainstorm creative project ideas and unique startup concepts.")}
              className="text-xs cursor-pointer"
            >
              Brainstorm Ideas
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => triggerAction("Write a polite, concise and professional email.")}
              className="text-xs cursor-pointer"
            >
              Draft Email
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => triggerAction("Create a healthy, easy daily routine plan.")}
              className="text-xs cursor-pointer"
            >
              Daily Routine
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => triggerAction("Explain this concept simply like I am 12 years old.")}
              className="text-xs cursor-pointer"
            >
              Explain Simply
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Pill Modal / Dropdown Dialog */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-full mb-4 p-3.5 rounded-2xl bg-card border border-border shadow-md"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/50">
              <span className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                {selectedAction.icon && <selectedAction.icon className="h-4 w-4 text-primary" />}
                {selectedAction.title}
              </span>
              <button
                type="button"
                onClick={() => setSelectedAction(null)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2.5">
              {selectedAction.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    triggerAction(opt);
                    setSelectedAction(null);
                  }}
                  className="text-left text-xs p-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground/90 transition-colors border border-border/40 hover:border-foreground/20 leading-relaxed"
                >
                  {opt}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={selectedAction.placeholder || "Type your request..."}
                className="h-8 text-xs bg-background rounded-xl border border-border/70"
              />
              <Button type="submit" size="sm" className="h-8 px-3 rounded-xl text-xs gap-1">
                <Send className="h-3 w-3" />
                <span>Go</span>
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2x2 Feature Cards Grid (Desktop & Mobile both show 2x2 grid, rotating 24 cards across 6 sets) */}
      <div className="w-full relative min-h-[148px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSetIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full"
          >
            {currentCards.map((card) => {
              const IconComp = card.icon;
              return (
                <Card
                  key={card.id}
                  onClick={() => triggerAction(card.prompt)}
                  className={`p-2.5 sm:p-3.5 rounded-2xl bg-card/80 hover:bg-card border border-border/60 ${card.hoverBorder} transition-all duration-200 cursor-pointer group shadow-xs hover:shadow-sm`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border ${card.badgeClasses} transition-transform duration-200 group-hover:scale-105`}>
                      <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors truncate">
                        {card.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate leading-snug">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Pagination Dots (6 Sets) + Manual Cycle Button */}
      <div className="flex items-center justify-center gap-1.5 mt-3 pt-1">
        {cardSets.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveSetIndex(idx)}
            className={`transition-all duration-200 rounded-full ${
              activeSetIndex === idx 
                ? "w-4 h-1.5 bg-foreground" 
                : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
            title={`Set ${idx + 1} of 6`}
          />
        ))}
        <button
          type="button"
          onClick={() => setActiveSetIndex((prev) => (prev + 1) % cardSets.length)}
          className="ml-1 p-1 text-muted-foreground/50 hover:text-foreground transition-colors rounded-full"
          title="Next cards (Total 24)"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default QuickActionCards;
