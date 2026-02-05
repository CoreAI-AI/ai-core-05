import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  MessageSquarePlus, 
  Mic, 
  Camera, 
  Image as ImageIcon,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onNewChat: () => void;
  onVoiceInput: () => void;
  onCameraUpload: () => void;
  onImageUpload: () => void;
  className?: string;
}

const fabActions = [
  { id: 'new-chat', icon: MessageSquarePlus, label: 'New Chat', color: 'bg-primary' },
  { id: 'voice', icon: Mic, label: 'Voice Input', color: 'bg-green-500' },
  { id: 'camera', icon: Camera, label: 'Camera', color: 'bg-purple-500' },
  { id: 'image', icon: ImageIcon, label: 'Upload Image', color: 'bg-orange-500' },
];

export const FloatingActionButton = ({
  onNewChat,
  onVoiceInput,
  onCameraUpload,
  onImageUpload,
  className,
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (actionId: string) => {
    setIsOpen(false);
    switch (actionId) {
      case 'new-chat':
        onNewChat();
        break;
      case 'voice':
        onVoiceInput();
        break;
      case 'camera':
        onCameraUpload();
        break;
      case 'image':
        onImageUpload();
        break;
    }
  };

  return (
    <div className={cn("fixed bottom-24 right-4 z-50 md:hidden", className)}>
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 items-end"
          >
            {fabActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm font-medium bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-border">
                  {action.label}
                </span>
                <Button
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg",
                    action.color,
                    "text-white hover:opacity-90"
                  )}
                  onClick={() => handleAction(action.id)}
                >
                  <action.icon className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        animate={isOpen ? { rotate: 135 } : { rotate: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          className={cn(
            "h-12 w-12 rounded-full shadow-xl bg-foreground dark:bg-white",
            "hover:opacity-90 transition-all duration-200"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Plus className={cn(
            "w-5 h-5 stroke-[2.5]",
            "text-background dark:text-black"
          )} />
        </Button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
