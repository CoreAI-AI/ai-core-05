import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, TrendingUp, Lightbulb, Zap, Code, Search, BookOpen, Copy, Check, Brain, Palette, Globe, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface PromptCard {
  id: string;
  emoji: string;
  title: string;
  prompt: string;
  category: string;
  gradient: string;
}

const trendingPrompts: PromptCard[] = [
  {
    id: '1',
    emoji: '✍️',
    title: 'Professional Email Writer',
    prompt: 'Write a professional email to my manager requesting a meeting to discuss project timelines and resource allocation.',
    category: 'Writing',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: '2',
    emoji: '💻',
    title: 'Debug My Code',
    prompt: 'Help me debug this code and explain what went wrong step by step.',
    category: 'Code',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: '3',
    emoji: '🎨',
    title: 'UI Design Ideas',
    prompt: 'Suggest 5 modern UI design trends for a mobile app with dark theme. Include color palettes and layout ideas.',
    category: 'Design',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: '4',
    emoji: '📊',
    title: 'Data Analysis Helper',
    prompt: 'Analyze this data and provide insights with key trends, patterns, and actionable recommendations.',
    category: 'Analysis',
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  {
    id: '5',
    emoji: '📝',
    title: 'Study Notes Generator',
    prompt: 'Create comprehensive study notes on this topic with key concepts, definitions, examples, and practice questions.',
    category: 'Education',
    gradient: 'from-indigo-500/20 to-violet-500/20',
  },
  {
    id: '6',
    emoji: '🌐',
    title: 'Content Translator',
    prompt: 'Translate and localize this content while maintaining the tone, context, and cultural nuances.',
    category: 'Language',
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
];

const aiCapabilities = [
  { icon: Brain, label: 'Deep Research', desc: 'Multi-source analysis', color: 'text-blue-400' },
  { icon: Code, label: 'Code Assistant', desc: 'Write & debug code', color: 'text-green-400' },
  { icon: Palette, label: 'Image Creator', desc: 'AI image generation', color: 'text-purple-400' },
  { icon: Globe, label: 'Multilingual', desc: '50+ languages', color: 'text-cyan-400' },
  { icon: BookOpen, label: 'Document AI', desc: 'Summarize & analyze', color: 'text-orange-400' },
  { icon: Shield, label: 'Private & Secure', desc: 'Your data is safe', color: 'text-emerald-400' },
];

const dailyTips = [
  "💡 Use 'Explain like I'm 5' for simpler explanations",
  "💡 Ask follow-up questions to go deeper into any topic",
  "💡 Try 'Compare X vs Y' for detailed comparisons",
  "💡 Use 'Step by step' for structured instructions",
  "💡 Ask 'What are the pros and cons of...' for balanced analysis",
  "💡 Try 'Give me 10 ideas for...' to brainstorm creatively",
  "💡 Use 'Summarize this in 3 bullet points' for quick summaries",
];

const Explore = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const todayTip = dailyTips[new Date().getDay() % dailyTips.length];

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    toast.success('Prompt copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUsePrompt = (prompt: string) => {
    sessionStorage.setItem('explore_prompt', prompt);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="glass-navbar safe-area-top px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-9 w-9 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Explore AI</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
        <div className="px-4 pt-4 space-y-6">

          {/* Daily Tip Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Tip of the Day</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{todayTip}</p>
              </div>
            </div>
          </motion.div>

          {/* AI Capabilities Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">What CoreAI Can Do</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {aiCapabilities.map((cap, i) => (
                <motion.div
                  key={cap.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <cap.icon className={`w-5 h-5 ${cap.color}`} />
                  <span className="text-xs font-semibold text-foreground text-center leading-tight">{cap.label}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{cap.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trending Prompts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Trending Prompts</h2>
            </div>
            <div className="space-y-3">
              {trendingPrompts.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${card.gradient} border border-border/30 group`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg">{card.emoji}</span>
                        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">{card.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-1">{card.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{card.prompt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 rounded-lg text-xs gap-1.5 flex-1"
                      onClick={() => handleUsePrompt(card.prompt)}
                    >
                      <Sparkles className="w-3 h-3" />
                      Use Prompt
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg p-0"
                      onClick={() => handleCopyPrompt(card.prompt, card.id)}
                    >
                      {copiedId === card.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pro Tips Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Power User Tips</h2>
            </div>
            <div className="space-y-2">
              {[
                { tip: 'Be specific with your prompts for better results', icon: '🎯' },
                { tip: 'Use Deep Research mode for complex topics', icon: '🔬' },
                { tip: 'Try Image mode to generate visual content', icon: '🖼️' },
                { tip: 'Export chats as PDF for documentation', icon: '📄' },
                { tip: 'Pin important chats for quick access', icon: '📌' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs text-foreground/80">{item.tip}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;