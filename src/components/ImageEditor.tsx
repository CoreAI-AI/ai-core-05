import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, Download, RotateCcw, FlipHorizontal, FlipVertical, 
  Contrast, Sun, Palette, Sparkles, Loader2, X
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  prompt: string;
}

export const ImageEditor = ({ open, onOpenChange, imageUrl, prompt }: ImageEditorProps) => {
  const [editedImage, setEditedImage] = useState(imageUrl);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  
  // Filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setEditedImage(imageUrl);
  };

  const handleAIEdit = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter an editing instruction");
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('image-edit', {
        body: { 
          imageUrl: editedImage,
          editPrompt: aiPrompt
        }
      });

      if (error) throw error;
      
      if (data?.editedImageUrl) {
        setEditedImage(data.editedImageUrl);
        toast.success("Image edited successfully!");
        setAiPrompt("");
      }
    } catch (error) {
      console.error("AI Edit error:", error);
      toast.error("Failed to edit image with AI");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(editedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-${prompt.slice(0, 20)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  const getImageStyle = () => ({
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
    transition: "all 0.3s ease"
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            Image Editor
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
            {isProcessing && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            <img 
              src={editedImage} 
              alt={prompt}
              style={getImageStyle()}
              className="max-w-full max-h-[400px] object-contain"
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <Tabs defaultValue="filters" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="ai">AI Edit</TabsTrigger>
              </TabsList>

              <TabsContent value="filters" className="space-y-4 mt-4">
                {/* Brightness */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Brightness: {brightness}%
                  </Label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(v) => setBrightness(v[0])}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Contrast className="w-4 h-4" />
                    Contrast: {contrast}%
                  </Label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(v) => setContrast(v[0])}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Saturation: {saturation}%
                  </Label>
                  <Slider
                    value={[saturation]}
                    onValueChange={(v) => setSaturation(v[0])}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                {/* Transform Controls */}
                <div className="flex flex-wrap gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setRotation(r => (r - 90) % 360)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Rotate Left
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setRotation(r => (r + 90) % 360)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1 scale-x-[-1]" />
                    Rotate Right
                  </Button>
                  <Button 
                    variant={flipH ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFlipH(!flipH)}
                  >
                    <FlipHorizontal className="w-4 h-4 mr-1" />
                    Flip H
                  </Button>
                  <Button 
                    variant={flipV ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFlipV(!flipV)}
                  >
                    <FlipVertical className="w-4 h-4 mr-1" />
                    Flip V
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Editing Instruction
                  </Label>
                  <Input
                    placeholder="e.g., Make it look like sunset, Add snow effect..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe how you want to edit this image using AI
                  </p>
                </div>
                <Button 
                  onClick={handleAIEdit} 
                  disabled={isProcessing || !aiPrompt.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Apply AI Edit
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
