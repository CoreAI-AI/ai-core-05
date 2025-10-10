import { ChevronDown, Sparkles, Image, Video, Mic } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AVAILABLE_MODELS, Model } from "@/config/models";
import { Badge } from "@/components/ui/badge";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  availableModels: Model[];
}

export const ModelSelector = ({ selectedModel, onModelChange, availableModels }: ModelSelectorProps) => {
  // Use available models from config, filtered by user's enabled models
  const models = AVAILABLE_MODELS.filter(m => availableModels.some(am => am.id === m.id));
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  // If current model is not available, switch to first available
  if (currentModel && currentModel.id !== selectedModel) {
    onModelChange(currentModel.id);
  }

  // Group models by provider
  const googleModels = models.filter(m => m.provider === 'Google');
  const openaiModels = models.filter(m => m.provider === 'OpenAI');

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'image': return <Image className="w-3 h-3" />;
      case 'video': return <Video className="w-3 h-3" />;
      case 'audio': return <Mic className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-foreground hover:bg-accent font-medium"
        >
          {currentModel?.name || "Select Model"}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        {googleModels.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
              Google Models
            </DropdownMenuLabel>
            {googleModels.map((model) => (
              <DropdownMenuItem 
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className={selectedModel === model.id ? "bg-accent" : ""}
              >
                <div className="flex items-start gap-2 flex-1">
                  <div className="mt-1">
                    {getCategoryIcon(model.category)}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      {model.category !== 'text' && (
                        <Badge variant="secondary" className="text-xs py-0 h-5">
                          {model.category}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        
        {openaiModels.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
              OpenAI Models
            </DropdownMenuLabel>
            {openaiModels.map((model) => (
              <DropdownMenuItem 
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className={selectedModel === model.id ? "bg-accent" : ""}
              >
                <div className="flex items-start gap-2 flex-1">
                  <div className="mt-1">
                    {getCategoryIcon(model.category)}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      {model.category !== 'text' && (
                        <Badge variant="secondary" className="text-xs py-0 h-5">
                          {model.category}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};