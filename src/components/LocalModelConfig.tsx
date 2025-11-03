import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Server, Check, X } from "lucide-react";
import { toast } from "sonner";

interface LocalModelConfigProps {
  userId: string;
}

interface ModelConfig {
  id: string;
  name: string;
  enabled: boolean;
  endpoint: string;
  status: 'checking' | 'online' | 'offline' | 'unknown';
}

const DEFAULT_MODELS: ModelConfig[] = [
  { id: 'gpt-oss', name: 'GPT-OSS', enabled: false, endpoint: 'http://localhost:8000/generate', status: 'unknown' },
  { id: 'whisper-local', name: 'Whisper (Local)', enabled: false, endpoint: 'http://localhost:8001/transcribe', status: 'unknown' },
  { id: 'gemma-local', name: 'Gemma (Local)', enabled: false, endpoint: 'http://localhost:8002/generate', status: 'unknown' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', enabled: false, endpoint: 'http://localhost:8003/generate', status: 'unknown' },
  { id: 'sdxl-local', name: 'SDXL (Local)', enabled: false, endpoint: 'http://localhost:8004/generate', status: 'unknown' },
];

export const LocalModelConfig = ({ userId }: LocalModelConfigProps) => {
  const [models, setModels] = useState<ModelConfig[]>(DEFAULT_MODELS);

  useEffect(() => {
    const savedConfig = localStorage.getItem(`local_model_config_${userId}`);
    if (savedConfig) {
      setModels(JSON.parse(savedConfig));
    }
  }, [userId]);

  const saveConfig = () => {
    localStorage.setItem(`local_model_config_${userId}`, JSON.stringify(models));
    toast.success('Configuration saved');
  };

  const checkEndpoint = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    setModels(prev => prev.map(m => 
      m.id === modelId ? { ...m, status: 'checking' } : m
    ));

    try {
      const response = await fetch(model.endpoint, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      const status = response.ok ? 'online' : 'offline';
      setModels(prev => prev.map(m => 
        m.id === modelId ? { ...m, status } : m
      ));
    } catch (error) {
      setModels(prev => prev.map(m => 
        m.id === modelId ? { ...m, status: 'offline' } : m
      ));
    }
  };

  const updateModel = (modelId: string, updates: Partial<ModelConfig>) => {
    setModels(prev => prev.map(m => 
      m.id === modelId ? { ...m, ...updates } : m
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Local Model Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure endpoints for local AI models
          </p>
        </div>
        <Button onClick={saveConfig} size="sm">
          Save Configuration
        </Button>
      </div>

      <div className="grid gap-4">
        {models.map((model) => (
          <Card key={model.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{model.name}</h4>
                    <p className="text-xs text-muted-foreground">{model.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {model.status === 'online' && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      <Check className="w-3 h-3 mr-1" />
                      Online
                    </Badge>
                  )}
                  {model.status === 'offline' && (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                      <X className="w-3 h-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                  {model.status === 'checking' && (
                    <Badge variant="outline">Checking...</Badge>
                  )}
                  <Switch
                    checked={model.enabled}
                    onCheckedChange={(checked) => updateModel(model.id, { enabled: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${model.id}-endpoint`} className="text-xs">
                  Server Endpoint
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`${model.id}-endpoint`}
                    value={model.endpoint}
                    onChange={(e) => updateModel(model.id, { endpoint: e.target.value })}
                    placeholder="http://localhost:8000/generate"
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => checkEndpoint(model.id)}
                    disabled={model.status === 'checking'}
                  >
                    Test
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-xs text-muted-foreground space-y-2 border-t pt-4">
        <p><strong>Note:</strong> Local models require you to run inference servers on your machine or network.</p>
        <p>Make sure the endpoints are accessible and return valid responses.</p>
        <p>Disabled models won't appear in the model selector.</p>
      </div>
    </div>
  );
};