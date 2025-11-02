import { useState } from "react";
import { Check, Cpu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVAILABLE_MODELS, Model } from "@/config/models";
import { useSettings } from "@/hooks/useSettings";

interface CoreAIModelSelectorProps {
  userId?: string;
}

export const CoreAIModelSelector = ({ userId }: CoreAIModelSelectorProps) => {
  const { settings, updateSettings } = useSettings(userId);
  const [selectedModel, setSelectedModel] = useState<Model | null>(
    AVAILABLE_MODELS.find(m => m.id === settings.activeModelId) || AVAILABLE_MODELS[0]
  );

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
    updateSettings({ activeModelId: model.id });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '💬';
    }
  };

  const getModelBadge = (model: Model) => {
    if (model.runtime?.requiresLocalWeights) {
      return <Badge variant="outline" className="text-xs">Open-Weight</Badge>;
    }
    if (model.type === 'speech-to-text') {
      return <Badge variant="outline" className="text-xs">Speech-to-Text</Badge>;
    }
    return null;
  };

  return (
    <div className="flex h-full w-full">
      {/* Left: Model List */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            AI Models
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Click to activate instantly
          </p>
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-2">
            {AVAILABLE_MODELS.map((model) => {
              const isActive = selectedModel?.id === model.id;
              const isActivated = settings.activeModelId === model.id;
              
              return (
                <Button
                  key={model.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-auto py-3 px-4 ${
                    isActivated ? "border-2 border-green-500" : ""
                  }`}
                  onClick={() => handleModelSelect(model)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="text-2xl">{getCategoryIcon(model.category)}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{model.name}</span>
                        {isActivated && (
                          <Badge className="bg-green-500 text-white text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Activated
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {model.provider}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Model Details */}
      <div className="flex-1 bg-background">
        {selectedModel ? (
          <ScrollArea className="h-full">
            <div className="p-8">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{getCategoryIcon(selectedModel.category)}</span>
                    <div>
                      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                        {selectedModel.name}
                        {settings.activeModelId === selectedModel.id && (
                          <Badge className="bg-green-500 text-white">
                            <Check className="w-4 h-4 mr-1" />
                            Activated
                          </Badge>
                        )}
                      </h1>
                      <p className="text-muted-foreground">{selectedModel.provider}</p>
                    </div>
                  </div>
                  {getModelBadge(selectedModel)}
                </div>

                {/* Description */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedModel.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Runtime Information */}
                {selectedModel.runtime && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-4">Runtime Information</h3>
                      <div className="space-y-3">
                        {selectedModel.runtime.requiresLocalWeights && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">Type</span>
                            <span className="text-sm font-medium text-foreground">Open-Weight Model</span>
                          </div>
                        )}
                        {selectedModel.runtime.recommendedMemoryGB && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-sm text-muted-foreground">Recommended RAM</span>
                            <span className="text-sm font-medium text-foreground">
                              {selectedModel.runtime.recommendedMemoryGB}GB
                            </span>
                          </div>
                        )}
                        {selectedModel.runtime.localPath && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">Local Path</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {selectedModel.runtime.localPath}
                            </code>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Capabilities */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-4">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{selectedModel.category || 'text'}</Badge>
                      {selectedModel.provider === 'OpenAI' && (
                        <>
                          <Badge variant="secondary">Chat</Badge>
                          <Badge variant="secondary">Completion</Badge>
                        </>
                      )}
                      {selectedModel.provider === 'Google' && (
                        <>
                          <Badge variant="secondary">Multimodal</Badge>
                          <Badge variant="secondary">Long Context</Badge>
                        </>
                      )}
                      {selectedModel.category === 'image' && (
                        <Badge variant="secondary">Text-to-Image</Badge>
                      )}
                      {selectedModel.category === 'audio' && (
                        <Badge variant="secondary">Speech Recognition</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Button */}
                <Button 
                  className="w-full"
                  size="lg"
                  onClick={() => handleModelSelect(selectedModel)}
                  disabled={settings.activeModelId === selectedModel.id}
                >
                  {settings.activeModelId === selectedModel.id ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Currently Activated
                    </>
                  ) : (
                    <>Activate {selectedModel.name}</>
                  )}
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a model to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};
