import { useState, useRef } from "react";
import { Send, Paperclip, Image, File, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onFileSelect?: (file: File) => void;
}

export const ChatInput = ({ onSendMessage, disabled, onFileSelect }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
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
      onFileSelect(file);
    }
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
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
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
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
              <Paperclip className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={openGallery} className="cursor-pointer">
              <Image className="w-4 h-4 mr-2" />
              Gallery
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openFileExplorer} className="cursor-pointer">
              <File className="w-4 h-4 mr-2" />
              File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openCamera} className="cursor-pointer">
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "AI is thinking..." : "Message..."}
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