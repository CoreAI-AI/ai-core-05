import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Model {
  id: string;
  name: string;
  provider: string;
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
      <DropdownMenuContent align="end" className="w-56">
        {availableModels.map((model) => (
          <DropdownMenuItem 
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className={selectedModel === model.id ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{model.name}</span>
              <span className="text-xs text-muted-foreground">{model.provider}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};