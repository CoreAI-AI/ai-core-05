import { motion } from "framer-motion";
import { LucideIcon, Lock, Diamond } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PremiumModelCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  isLocked: boolean;
  onClick: () => void;
}

export const PremiumModelCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features,
  isLocked,
  onClick 
}: PremiumModelCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className="relative overflow-hidden p-6 cursor-pointer group bg-card hover:bg-card/80 border-border hover:border-primary/50 transition-all duration-300"
        onClick={onClick}
      >
        {/* Diamond icon for locked models */}
        {isLocked && (
          <div className="absolute top-4 right-4">
            <Diamond className="w-6 h-6 text-primary fill-primary/20" />
          </div>
        )}

        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Icon with lock overlay */}
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:core-glow transition-all duration-300 relative">
            <Icon className="w-8 h-8 text-primary" />
            {isLocked && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
            {isLocked && <span className="text-sm ml-2 text-muted-foreground">(Locked)</span>}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>

          {/* Features List */}
          <div className="space-y-1">
            {features.map((feature, index) => (
              <p key={index} className="text-xs text-muted-foreground">
                • {feature}
              </p>
            ))}
          </div>

          {isLocked && (
            <div className="mt-4 text-xs text-primary font-medium">
              Tap to unlock with subscription
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
