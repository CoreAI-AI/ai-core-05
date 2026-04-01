import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface StyleCardProps {
  name: string;
  imageUrl: string;
  prompt?: string;
  onClick: () => void;
  showTryNow?: boolean;
}

const StyleCard = ({ name, imageUrl, prompt, onClick, showTryNow = true }: StyleCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/30"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Try Now button on hover */}
        {showTryNow && (
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button 
              size="sm" 
              className="w-full h-8 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground gap-1 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Sparkles className="w-3 h-3" />
              Try Now
            </Button>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-sm font-semibold text-foreground truncate">{name}</p>
        {prompt && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{prompt}</p>
        )}
      </div>
    </Card>
  );
};

export default StyleCard;
