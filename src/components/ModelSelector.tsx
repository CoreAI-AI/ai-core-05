import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  availableModels: Model[];
}

export const ModelSelector = ({ selectedModel, onModelChange, availableModels }: ModelSelectorProps) => {
  const currentModel = availableModels.find(m => m.id === selectedModel) || availableModels[0];

  // If current model is not available, switch to first available
  if (currentModel && currentModel.id !== selectedModel) {
    onModelChange(currentModel.id);
  }

  // Group models by provider
  const googleModels = availableModels.filter(m => m.provider === 'Google');
  const openaiModels = availableModels.filter(m => m.provider === 'OpenAI');

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
      <DropdownMenuContent align="end" className="w-80">
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
                <div className="flex flex-col gap-1.5 py-1">
                  <span className="font-medium text-sm">{model.name}</span>
                  <span className="text-xs text-muted-foreground leading-relaxed whitespace-normal">
                    {model.description}
                  </span>
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
                <div className="flex flex-col gap-1.5 py-1">
                  <span className="font-medium text-sm">{model.name}</span>
                  <span className="text-xs text-muted-foreground leading-relaxed whitespace-normal">
                    {model.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};