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
  RefreshCw
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

// 3 Dynamic Card Sets (Total 12 Distinct CoreAI Cards)
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
      description: "In-depth research",
      badgeClasses: "bg-blue-500/12 text-blue-500 border-blue-500/20 dark:bg-blue-500/20",
      hoverBorder: "hover:border-blue-500/40 hover:shadow-blue-500/5",
      prompt: "Perform deep research on a topic and provide comprehensive information with structured key insights and sources.",
    },
    {
      id: "financial",
      icon: TrendingUp,
      title: "Financial",
      description: "Market insights",
      badgeClasses: "bg-emerald-500/12 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20",
      hoverBorder: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
      prompt: "Help me with financial research. Provide market analysis, current trends, and practical financial planning insights.",
    },
    {
      id: "news",
      icon: Newspaper,
      title: "Today News",
      description: "Latest updates",
      badgeClasses: "bg-purple-500/12 text-purple-500 border-purple-500/20 dark:bg-purple-500/20",
      hoverBorder: "hover:border-purple-500/40 hover:shadow-purple-500/5",
      prompt: "Give me today's top global news stories, important geopolitical updates, and exciting technology news.",
    },
  ],
  // Set 2: Create & Build
  [
    {
      id: "code-studio",
      icon: Code,
      title: "Code Studio",
      description: "Build & debug apps",
      badgeClasses: "bg-indigo-500/12 text-indigo-500 border-indigo-500/20 dark:bg-indigo-500/20",
      hoverBorder: "hover:border-indigo-500/40 hover:shadow-indigo-500/5",
      prompt: "Help me write, review, and debug clean and modern code. Let me explain what I want to build.",
    },
    {
      id: "creative-writing",
      icon: Brain,
      title: "Creative Writing",
      description: "Stories, blogs & essays",
      badgeClasses: "bg-pink-500/12 text-pink-500 border-pink-500/20 dark:bg-pink-500/20",
      hoverBorder: "hover:border-pink-500/40 hover:shadow-pink-500/5",
      prompt: "Help me draft engaging creative content: compelling stories, articles, social posts, or essays with strong hooks.",
    },
    {
      id: "study-helper",
      icon: GraduationCap,
      title: "Study Notes",
      description: "Homework & exam prep",
      badgeClasses: "bg-amber-500/12 text-amber-500 border-amber-500/20 dark:bg-amber-500/20",
      hoverBorder: "hover:border-amber-500/40 hover:shadow-amber-500/5",
      prompt: "Act as an expert tutor. Break down complex concepts into simple steps with exam-focused summaries and practice questions.",
    },
    {
      id: "image-studio",
      icon: ImageIcon,
      title: "Image Studio",
      description: "AI art & 3D renders",
      badgeClasses: "bg-cyan-500/12 text-cyan-500 border-cyan-500/20 dark:bg-cyan-500/20",
      hoverBorder: "hover:border-cyan-500/40 hover:shadow-cyan-500/5",
      prompt: "Help me generate stunning visual prompts and detailed image descriptions for logos, digital art, and illustrations.",
    },
  ],
  // Set 3: Life & Planning
  [
    {
      id: "travel-planner",
      icon: Compass,
      title: "Travel Planner",
      description: "Trips & dream itineraries",
      badgeClasses: "bg-sky-500/12 text-sky-500 border-sky-500/20 dark:bg-sky-500/20",
      hoverBorder: "hover:border-sky-500/40 hover:shadow-sky-500/5",
      prompt: "Plan a detailed day-by-day travel itinerary with budget tips, hidden gems, and local recommendations.",
    },
    {
      id: "chef-recipes",
      icon: Utensils,
      title: "Chef & Cooking",
      description: "Healthy quick recipes",
      badgeClasses: "bg-rose-500/12 text-rose-500 border-rose-500/20 dark:bg-rose-500/20",
      hoverBorder: "hover:border-rose-500/40 hover:shadow-rose-500/5",
      prompt: "Suggest healthy, delicious, and easy recipes with cooking instructions based on ingredients I have.",
    },
    {
      id: "career-skills",
      icon: Briefcase,
      title: "Career & Skills",
      description: "Resume & interview prep",
      badgeClasses: "bg-teal-500/12 text-teal-500 border-teal-500/20 dark:bg-teal-500/20",
      hoverBorder: "hover:border-teal-500/40 hover:shadow-teal-500/5",
      prompt: "Help me with career advice: review my resume bullet points, prepare for interviews, and suggest skills to master.",
    },
    {
      id: "fitness-health",
      icon: Dumbbell,
      title: "Fitness & Habit",
      description: "Workouts & daily routines",
      badgeClasses: "bg-lime-500/12 text-lime-600 dark:text-lime-400 border-lime-500/20 dark:bg-lime-500/20",
      hoverBorder: "hover:border-lime-500/40 hover:shadow-lime-500/5",
      prompt: "Design a practical weekly workout and healthy habit routine tailored to my schedule and fitness goals.",
    },
  ],
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
  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Rotate card sets every 5.5s (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSetIndex((prev) => (prev + 1) % cardSets.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

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

  const handleNextSet = () => {
    setActiveSetIndex((prev) => (prev + 1) % cardSets.length);
  };

  const currentCards = cardSets[activeSetIndex];

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

      {/* Action Pills */}
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

      {/* 4 Feature Cards (Auto-Rotating Sets of 4 with Staggered Transitions) */}
      <div 
        className="w-full relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSetIndex}
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="w-full grid grid-cols-2 gap-2 sm:gap-2.5"
          >
            {currentCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.2 }}
              >
                <Card
                  onClick={() => onAction(card.prompt)}
                  className={`p-2.5 sm:p-3 bg-card hover:bg-muted/30 border border-border/70 ${card.hoverBorder} rounded-2xl sm:rounded-3xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] shadow-xs group`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Rounded Squircle Badge */}
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border ${card.badgeClasses} group-hover:scale-105 transition-transform duration-200`}>
                      <card.icon className="w-4 h-4" />
                    </div>

                    {/* Title & Subtitle */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-xs sm:text-[13px] tracking-tight truncate">
                        {card.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground/80 truncate leading-tight font-normal">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Dots + Shuffle Button */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {cardSets.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSetIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
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

export default QuickActionCards;
