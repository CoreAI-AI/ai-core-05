import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Image, File, Camera, Search, GraduationCap, ImagePlus, Code, Lightbulb, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { chatMessageSchema, validateFile, sanitizeInput } from "@/lib/validation";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onFileSelect?: (file: File) => void;
  onModeChange?: (mode: 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze') => void;
}

export const ChatInput = ({ onSendMessage, disabled, onFileSelect, onModeChange }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [currentMode, setCurrentMode] = useState<'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze'>('normal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const anyFileInputRef = useRef<HTMLInputElement>(null);

  const handleModeSelect = (mode: 'normal' | 'deep-search' | 'study' | 'photo' | 'code' | 'creative' | 'analyze') => {
    setCurrentMode(mode);
    if (onModeChange) {
      onModeChange(mode);
    }
    const modeNames = {
      'normal': 'Normal Chat',
      'deep-search': 'Deep Research',
      'study': 'Study Tutor',
      'photo': 'Image Generator',
      'code': 'Code Assistant',
      'creative': 'Creative Writer',
      'analyze': 'Data Analyst'
    };
    toast.success(`${modeNames[mode]} activated!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    // Validate and sanitize message
    try {
      const sanitized = sanitizeInput(message);
      chatMessageSchema.parse({ content: sanitized });
      onSendMessage(sanitized);
      setMessage("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Invalid message");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      try {
        validateFile(file);
        onFileSelect(file);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Invalid file");
        }
      }
    }
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const openCamera = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false,
        correctOrientation: true
      });

      if (image.dataUrl && onFileSelect) {
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const timestamp = Date.now();
        const fileObj = Object.assign(blob, {
          name: `camera-${timestamp}.jpg`,
          lastModified: timestamp,
        }) as File;
        onFileSelect(fileObj);
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      toast.error('Camera access denied. Please allow camera permissions.');
    }
  };

  const openFileExplorer = () => {
    anyFileInputRef.current?.click();
  };

  const getModeIcon = () => {
    switch (currentMode) {
      case 'deep-search':
        return <Search className="h-4 w-4 text-blue-500" />;
      case 'study':
        return <GraduationCap className="h-4 w-4 text-green-500" />;
      case 'photo':
        return <ImagePlus className="h-4 w-4 text-purple-500" />;
      case 'code':
        return <Code className="h-4 w-4 text-orange-500" />;
      case 'creative':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'analyze':
        return <BarChart3 className="h-4 w-4 text-cyan-500" />;
      default:
        return <Paperclip className="h-4 w-4" />;
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={anyFileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button" 
              size="icon" 
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              {getModeIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem onClick={() => handleModeSelect('normal')} className="cursor-pointer">
              <Paperclip className="w-4 h-4 mr-2" />
              💬 Normal Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeSelect('deep-search')} className="cursor-pointer">
              <Search className="w-4 h-4 mr-2 text-blue-500" />
              🔍 Deep Research
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeSelect('study')} className="cursor-pointer">
              <GraduationCap className="w-4 h-4 mr-2 text-green-500" />
              📚 Study Tutor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeSelect('code')} className="cursor-pointer">
              <Code className="w-4 h-4 mr-2 text-orange-500" />
              💻 Code Assistant
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeSelect('creative')} className="cursor-pointer">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
              ✨ Creative Writer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeSelect('analyze')} className="cursor-pointer">
              <BarChart3 className="w-4 h-4 mr-2 text-cyan-500" />
              📊 Data Analyst
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModeSelect('photo')} className="cursor-pointer">
              <ImagePlus className="w-4 h-4 mr-2 text-purple-500" />
              🎨 Image Generator
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openGallery} className="cursor-pointer">
              <Image className="w-4 h-4 mr-2" />
              📷 Gallery
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openFileExplorer} className="cursor-pointer">
              <File className="w-4 h-4 mr-2" />
              📎 File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openCamera} className="cursor-pointer">
              <Camera className="w-4 h-4 mr-2" />
              📸 Camera
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              currentMode === 'photo' 
                ? "Describe the image you want to generate..." 
                : currentMode === 'study'
                ? "Ask me to explain any topic..."
                : currentMode === 'deep-search'
                ? "Ask for in-depth research..."
                : currentMode === 'code'
                ? "Ask for coding help..."
                : currentMode === 'creative'
                ? "Let's create something amazing..."
                : currentMode === 'analyze'
                ? "Share data or info to analyze..."
                : disabled ? "AI is thinking..." : "Message..."
            }
            disabled={disabled}
            className="min-h-[40px] max-h-32 resize-none bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
            rows={1}
          />
        </div>
        
        <Button 
          type="submit" 
          size="icon"
          disabled={disabled || !message.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
