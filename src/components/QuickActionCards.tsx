import { motion } from "framer-motion";
import { ShoppingCart, Search, TrendingUp, Newspaper, X } from "lucide-react";
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
    prompt: "Help me with shopping research. I want to find the best products and deals for my needs."
  },
  {
    id: "deep-search",
    icon: Search,
    title: "Deep Search",
    description: "In-depth research on any topic",
    prompt: "Perform a deep search and provide comprehensive information on a topic I'm interested in."
  },
  {
    id: "financial",
    icon: TrendingUp,
    title: "Financial Research",
    description: "Market analysis and financial insights",
    prompt: "Help me with financial research. Provide market analysis and investment insights."
  },
  {
    id: "news",
    icon: Newspaper,
    title: "Today News",
    description: "Get the latest news and updates",
    prompt: "Give me today's top news and important updates from around the world."
  }
];

export const QuickActionCards = ({ onAction, onSkip }: QuickActionCardsProps) => {
  return (
    <div className="relative w-full">
      {onSkip && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="absolute -top-8 right-0 text-muted-foreground hover:text-foreground gap-1 text-xs"
        >
          <X className="w-3 h-3" />
          Skip
        </Button>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-6 sm:mb-8">
      {actions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card className="p-3 sm:p-4 bg-card hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300 group">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-xs sm:text-sm mb-0.5 sm:mb-1">{action.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">{action.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(action.prompt)}
                className="shrink-0 text-xs h-6 sm:h-7 px-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Try it
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
      </div>
    </div>
  );
};
