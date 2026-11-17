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
  FileCheck,
  Rocket,
  Scale,
  Music,
  Sparkles,
  Atom,
  Gamepad2,
  Heart,
  BarChart3
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

// 6 Dynamic Card Sets (Total 24 Distinct CoreAI Modes & Action Cards)
const cardSets = [
  // Set 1: Explore & News
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
      description: "In-depth web insights",
      badgeClasses: "bg-blue-500/12 text-blue-500 border-blue-500/20 dark:bg-blue-500/20",
      hoverBorder: "hover:border-blue-500/40 hover:shadow-blue-500/5",
      prompt: "Perform a deep search on current breakthrough technologies and provide a structured, in-depth breakdown.",
    },
    {
      id: "financial",
      icon: TrendingUp,
      title: "Financial",
      description: "Smart wealth & savings",
      badgeClasses: "bg-emerald-500/12 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
      prompt: "Provide practical financial management, savings, and investment principles for building long-term wealth.",
    },
    {
      id: "news",
      icon: Newspaper,
      title: "Today News",
      description: "Top global headlines",
      badgeClasses: "bg-purple-500/12 text-purple-500 border-purple-500/20 dark:bg-purple-500/20",
      hoverBorder: "hover:border-purple-500/40 hover:shadow-purple-500/5",
      prompt: "Summarize today's top major news headlines, world affairs, and tech updates in bullet points.",
    },
  ],

  // Set 2: Creative & Study Studio
  [
    {
      id: "photo",
      icon: ImageIcon,
      title: "Image Studio",
      description: "Generate 4K visual art",
      badgeClasses: "bg-cyan-500/12 text-cyan-500 border-cyan-500/20 dark:bg-cyan-500/20",
      hoverBorder: "hover:border-cyan-500/40 hover:shadow-cyan-500/5",
      prompt: "Generate an artistic, cinematic visual image with dramatic lighting and high-definition details.",
    },
    {
      id: "code",
      icon: Code,
      title: "Code Assistant",
      description: "Clean code & debug",
      badgeClasses: "bg-indigo-500/12 text-indigo-500 border-indigo-500/20 dark:bg-indigo-500/20",
      hoverBorder: "hover:border-indigo-500/40 hover:shadow-indigo-500/5",
      prompt: "Help me write clean, well-architected code with best practices, TypeScript types, and unit tests.",
    },
    {
      id: "study",
      icon: Brain,
      title: "Study Notes",
      description: "Smart tutor & notes",
      badgeClasses: "bg-pink-500/12 text-pink-500 border-pink-500/20 dark:bg-pink-500/20",
      hoverBorder: "hover:border-pink-500/40 hover:shadow-pink-500/5",
      prompt: "Act as an academic tutor. Explain a complex scientific or technical concept with simple analogies and notes.",
    },
    {
      id: "homework",
      icon: GraduationCap,
      title: "Homework Helper",
      description: "Step-by-step answers",
      badgeClasses: "bg-amber-500/12 text-amber-500 border-amber-500/20 dark:bg-amber-500/20",
      hoverBorder: "hover:border-amber-500/40 hover:shadow-amber-500/5",
      prompt: "Help me solve my homework problem step-by-step with formulas and clear concept explanation.",
    },
  ],

  // Set 3: Daily Life & Career
  [
    {
      id: "recipe",
      icon: Utensils,
      title: "Recipe & Cooking",
      description: "Delicious dishes & diet",
      badgeClasses: "bg-rose-500/12 text-rose-500 border-rose-500/20 dark:bg-rose-500/20",
      hoverBorder: "hover:border-rose-500/40 hover:shadow-rose-500/5",
      prompt: "Give me an authentic, healthy 30-minute recipe with ingredient measurements and chef secrets.",
    },
    {
      id: "career",
      icon: Briefcase,
      title: "Career & Resume",
      description: "Resume & interviews",
      badgeClasses: "bg-sky-500/12 text-sky-500 border-sky-500/20 dark:bg-sky-500/20",
      hoverBorder: "hover:border-sky-500/40 hover:shadow-sky-500/5",
      prompt: "Review my career goals and help me craft a high-impact resume summary and interview preparation plan.",
    },
    {
      id: "fitness",
      icon: Dumbbell,
      title: "Fitness & Health",
      description: "Workouts & nutrition",
      badgeClasses: "bg-teal-500/12 text-teal-500 border-teal-500/20 dark:bg-teal-500/20",
      hoverBorder: "hover:border-teal-500/40 hover:shadow-teal-500/5",
      prompt: "Create a personalized, sustainable weekly workout routine and healthy nutrition checklist.",
    },
    {
      id: "creative",
      icon: Sparkles,
      title: "Creative Story",
      description: "Fiction, poems & scripts",
      badgeClasses: "bg-violet-500/12 text-violet-500 border-violet-500/20 dark:bg-violet-500/20",
      hoverBorder: "hover:border-violet-500/40 hover:shadow-violet-500/5",
      prompt: "Write a captivating sci-fi short story with rich imagery, philosophical suspense, and emotional depth.",
    },
  ],

  // Set 4: Academic & Communication
  [
    {
      id: "math",
      icon: Calculator,
      title: "Math Solver",
      description: "Formulas & algebra",
      badgeClasses: "bg-blue-600/12 text-blue-600 border-blue-600/20 dark:bg-blue-400/20",
      hoverBorder: "hover:border-blue-600/40 hover:shadow-blue-600/5",
      prompt: "Explain and solve this mathematical equation step-by-step with underlying principles and formulas.",
    },
    {
      id: "email",
      icon: Mail,
      title: "Email Writer",
      description: "Polite & professional",
      badgeClasses: "bg-indigo-600/12 text-indigo-600 border-indigo-600/20 dark:bg-indigo-400/20",
      hoverBorder: "hover:border-indigo-600/40 hover:shadow-indigo-600/5",
      prompt: "Draft a polite, concise, and persuasive business email with a clear call to action.",
    },
    {
      id: "languages",
      icon: Languages,
      title: "Translator",
      description: "Multi-language bridge",
      badgeClasses: "bg-emerald-600/12 text-emerald-600 border-emerald-600/20 dark:bg-emerald-400/20",
      hoverBorder: "hover:border-emerald-600/40 hover:shadow-emerald-600/5",
      prompt: "Translate and localize text accurately into Hindi, English, and other languages with natural idioms.",
    },
    {
      id: "reviewer",
      icon: FileCheck,
      title: "Essay Reviewer",
      description: "Proofread & tone polish",
      badgeClasses: "bg-amber-600/12 text-amber-600 border-amber-600/20 dark:bg-amber-400/20",
      hoverBorder: "hover:border-amber-600/40 hover:shadow-amber-600/5",
      prompt: "Proofread and polish this text. Improve flow, vocabulary, grammar, and persuasive tone.",
    },
  ],

  // Set 5: Business & Innovation
  [
    {
      id: "startup",
      icon: Rocket,
      title: "Startup Pitch",
      description: "Ideas & pitch decks",
      badgeClasses: "bg-red-500/12 text-red-500 border-red-500/20 dark:bg-red-500/20",
      hoverBorder: "hover:border-red-500/40 hover:shadow-red-500/5",
      prompt: "Structure a high-converting startup pitch deck with problem, solution, market size, and business model.",
    },
    {
      id: "legal",
      icon: Scale,
      title: "Legal & Rights",
      description: "Contracts & guidelines",
      badgeClasses: "bg-slate-500/12 text-slate-500 border-slate-500/20 dark:bg-slate-500/20",
      hoverBorder: "hover:border-slate-500/40 hover:shadow-slate-500/5",
      prompt: "Explain standard legal contract terms, NDA basics, and intellectual property rights in plain language.",
    },
    {
      id: "music",
      icon: Music,
      title: "Music & Lyrics",
      description: "Songs, beats & rhymes",
      badgeClasses: "bg-fuchsia-500/12 text-fuchsia-500 border-fuchsia-500/20 dark:bg-fuchsia-500/20",
      hoverBorder: "hover:border-fuchsia-500/40 hover:shadow-fuchsia-500/5",
      prompt: "Write catchy, poetic song lyrics with verses, chorus, bridge, and a rhythmic beat suggestion.",
    },
    {
      id: "social",
      icon: Compass,
      title: "Social Media",
      description: "Viral hooks & captions",
      badgeClasses: "bg-cyan-600/12 text-cyan-600 border-cyan-600/20 dark:bg-cyan-400/20",
      hoverBorder: "hover:border-cyan-600/40 hover:shadow-cyan-600/5",
      prompt: "Create 5 viral social media post hooks and captions designed for high engagement and shares.",
    },
  ],

  // Set 6: Science, Logic & Wellbeing
  [
    {
      id: "science",
      icon: Atom,
      title: "Science Explainer",
      description: "Physics, bio & cosmos",
      badgeClasses: "bg-blue-500/12 text-blue-500 border-blue-500/20 dark:bg-blue-500/20",
      hoverBorder: "hover:border-blue-500/40 hover:shadow-blue-500/5",
      prompt: "Explain a fascinating astrophysics or quantum physics principle in an easy-to-understand breakdown.",
    },
    {
      id: "gaming",
      icon: Gamepad2,
      title: "Gaming & Lore",
      description: "Guides, tips & stories",
      badgeClasses: "bg-purple-600/12 text-purple-600 border-purple-600/20 dark:bg-purple-400/20",
      hoverBorder: "hover:border-purple-600/40 hover:shadow-purple-600/5",
      prompt: "Give me strategic gameplay tips, character builds, and lore analysis for modern open-world games.",
    },
    {
      id: "wellness",
      icon: Heart,
      title: "Mind Wellness",
      description: "Stress relief & focus",
      badgeClasses: "bg-rose-600/12 text-rose-600 border-rose-600/20 dark:bg-rose-400/20",
      hoverBorder: "hover:border-rose-600/40 hover:shadow-rose-600/5",
      prompt: "Guide me through a calming 5-minute mindfulness breathing exercise and positive mindset shift.",
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Data Analytics",
      description: "Metrics & trend charts",
      badgeClasses: "bg-emerald-600/12 text-emerald-600 border-emerald-600/20 dark:bg-emerald-400/20",
      hoverBorder: "hover:border-emerald-600/40 hover:shadow-emerald-600/5",
      prompt: "Explain how to interpret key business metrics, KPIs, and data visualizations to make smart decisions.",
    },
  ],
];

// Top 4 Action Pills
const topActionPills = [
  {
    id: "create-image",
    title: "Create image",
    icon: ImageIcon,
    options: [
      "Photorealistic portrait in golden hour lighting",
      "Futuristic cyberpunk city with neon reflections",
      "Minimalist vector logo for a modern tech startup",
      "Peaceful Himalayan mountain landscape at sunrise",
    ],
    placeholder: "Describe the image you want to generate...",
  },
  {
    id: "get-advice",
    title: "Get advice",
    icon: MessageCircle,
    options: [
      "How to build high focus and beat procrastination",
      "Career growth strategies for tech and design",
      "Smart budgeting and emergency fund rules",
      "Healthy daily routine for high physical energy",
    ],
    placeholder: "What topic do you need advice on?",
  },
  {
    id: "summarize-text",
    title: "Summarize text",
    icon: FileText,
    options: [
      "Summarize in 5 key executive bullet points",
      "Extract actionable next steps and decisions",
      "Explain this like I am 12 years old",
      "Highlight pros, cons, and potential risks",
    ],
    placeholder: "Paste or describe the text to summarize...",
  },
  {
    id: "code-assistant",
    title: "Code assistant",
    icon: Code,
    options: [
      "Write a clean React + TypeScript component",
      "Debug an API error or performance issue",
      "Write an optimized SQL query with indexes",
      "Explain this code snippet step-by-step",
    ],
    placeholder: "What programming problem are you solving?",
  },
];

const animatedGreetings = [
  "How can I help you today?",
  "What would you like to create?",
  "Ask me anything or explore modes",
  "Ready to research, code, or write",
  "Transform ideas into reality",
  "Fast, intelligent answers at ₹0 cost",
  "Brainstorm, analyze, or summarize",
  "Generate creative images with AI",
  "Solve complex problems in seconds",
  "Let's learn something new today",
];

export const QuickActionCards = ({ onAction, onCardClick, onSkip }: QuickActionCardsProps) => {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [selectedAction, setSelectedAction] = useState<{
    title: string;
    options: string[];
    placeholder?: string;
  } | null>(null);
  const [customInput, setCustomInput] = useState("");

  const triggerAction = (prompt: string) => {
    if (onCardClick) onCardClick(prompt);
    if (onAction) onAction(prompt);
  };

  // Rotate greeting heading
  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % animatedGreetings.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  // Rotate 24 card sets every 1.5 seconds (1500ms) with hover pause
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSetIndex((prev) => (prev + 1) % cardSets.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleActionClick = (action: { title: string; options: string[]; placeholder?: string }) => {
    setSelectedAction(action);
    setCustomInput("");
  };

  const handleOptionClick = (option: string) => {
    triggerAction(option);
    setSelectedAction(null);
    setCustomInput("");
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      triggerAction(`${selectedAction?.title}: ${customInput.trim()}`);
      setSelectedAction(null);
      setCustomInput("");
    }
  };

  const handleNextSet = () => {
    setActiveSetIndex((prev) => (prev + 1) % cardSets.length);
  };

  const currentCards = cardSets[activeSetIndex];

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto flex flex-col items-center justify-center">
      {/* Animated Rotating Headline */}
      <div className="text-center mb-4 sm:mb-6 min-h-[44px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={greetingIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground select-none"
          >
            {animatedGreetings[greetingIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Top Action Pills */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-5 flex-wrap">
        {topActionPills.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-border/70 bg-card/70 hover:bg-muted/80 text-foreground transition-all duration-200 hover:border-foreground/25 active:scale-95 shadow-xs"
            >
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{action.title}</span>
            </button>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border border-border/70 bg-card/70 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 active:scale-95 shadow-xs"
              title="More options"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl bg-popover border border-border/70 shadow-lg z-50">
            <DropdownMenuItem onClick={() => triggerAction("Brainstorm 10 creative startup ideas with high potential")} className="rounded-lg text-xs py-2 cursor-pointer">
              <Brain className="h-3.5 w-3.5 mr-2 text-pink-500" />
              Brainstorm Ideas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerAction("Provide a structured guide on how to learn anything fast")} className="rounded-lg text-xs py-2 cursor-pointer">
              <Compass className="h-3.5 w-3.5 mr-2 text-blue-500" />
              Learning Methods
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerAction("Summarize key concepts of modern machine learning")} className="rounded-lg text-xs py-2 cursor-pointer">
              <Code className="h-3.5 w-3.5 mr-2 text-purple-500" />
              AI Concepts
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
                <selectedAction.icon className="h-4 w-4 text-primary" />
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
                  onClick={() => handleOptionClick(opt)}
                  className="text-left text-xs p-2 rounded-xl bg-muted/50 hover:bg-muted text-foreground/90 transition-colors border border-border/40 hover:border-foreground/20 leading-relaxed"
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <Input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCustomSubmit();
                  }
                }}
                placeholder={selectedAction.placeholder || "Type your request..."}
                className="h-8 text-xs rounded-xl bg-background"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCustomSubmit}
                disabled={!customInput.trim()}
                className="h-8 px-2.5 rounded-xl shrink-0 text-xs"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 24 Dynamic Feature Cards (6 Sets of 4 Rotating every 1.5s) */}
      <div 
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSetIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full"
          >
            {currentCards.map((card) => (
              <motion.div
                key={card.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                <Card
                  onClick={() => triggerAction(card.prompt)}
                  className={`p-2.5 sm:p-3 h-full cursor-pointer bg-card/75 dark:bg-[#15171C]/80 backdrop-blur-sm border border-border/60 rounded-xl transition-all duration-200 text-left flex flex-col justify-between ${card.hoverBorder} shadow-2xs hover:shadow-sm`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`inline-flex items-center justify-center p-1.5 rounded-lg border text-xs shrink-0 ${card.badgeClasses}`}>
                      <card.icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight truncate">
                      {card.title}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 leading-snug">
                    {card.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* 6 Dots Indicator + Shuffle Control */}
        <div className="flex items-center justify-center gap-1 mt-2.5">
          {cardSets.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSetIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeSetIndex === idx 
                  ? "w-4 bg-foreground/60" 
                  : "w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/50"
              }`}
              title={`Switch to set ${idx + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={handleNextSet}
            className="p-1 text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors ml-1"
            title="Next feature cards"
          >
            <RefreshCw className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { QuickActionCards };
export default QuickActionCards;
