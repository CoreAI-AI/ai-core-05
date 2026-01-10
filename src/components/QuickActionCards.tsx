import { motion } from "framer-motion";
import { ShoppingCart, Search, TrendingUp, Newspaper, X, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionCardsProps {
  onAction: (prompt: string) => void;
  onSkip?: () => void;
}

const actions = [
  {
    id: "shopping",
    icon: ShoppingCart,
    title: "Shopping Research",
    description: "Find the best deals and product comparisons",
    prompt: "Help me with shopping research. I want to find the best products and deals for my needs.",
    gradient: "from-orange-500 to-pink-500"
  },
  {
    id: "deep-search",
    icon: Search,
    title: "Deep Search",
    description: "In-depth research on any topic",
    prompt: "Perform a deep search and provide comprehensive information on a topic I'm interested in.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: "financial",
    icon: TrendingUp,
    title: "Financial Research",
    description: "Market analysis and financial insights",
    prompt: "Help me with financial research. Provide market analysis and investment insights.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "news",
    icon: Newspaper,
    title: "Today News",
    description: "Get the latest news and updates",
    prompt: "Give me today's top news and important updates from around the world.",
    gradient: "from-purple-500 to-violet-500"
  }
];

export const QuickActionCards = ({ onAction, onSkip }: QuickActionCardsProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">CoreAI Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Start a conversation or choose from quick actions below
        </p>
      </motion.div>

      {/* Cancel Button */}
      {onSkip && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            Hide quick actions
          </Button>
        </motion.div>
      )}
      
      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: "easeOut" }}
          >
            <Card 
              className="relative overflow-hidden p-4 sm:p-5 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 transition-all duration-300 group cursor-pointer hover:shadow-lg"
              onClick={() => onAction(action.prompt)}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base mb-1 group-hover:text-primary transition-colors duration-200">{action.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
