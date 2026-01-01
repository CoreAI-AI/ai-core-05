import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, ImagePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  styleName: string;
  styleImage?: string;
  isCelebrityStyle?: boolean;
  discoverText?: string;
}

const ImageUploadModal = ({ 
  isOpen, 
  onClose, 
  styleName, 
  styleImage,
  isCelebrityStyle = false,
  discoverText
}: ImageUploadModalProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [celebrityImage, setCelebrityImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const userInputRef = useRef<HTMLInputElement>(null);
  const celebrityInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setImage: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyStyle = async () => {
    if (!userImage) {
      toast.error("Please upload an image first");
      return;
    }
    if (isCelebrityStyle && !celebrityImage) {
      toast.error("Please upload a celebrity image as well");
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`${styleName} style applied successfully!`);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setUserImage(null);
    setCelebrityImage(null);
    onClose();
  };

  const removeImage = (setImage: (url: string | null) => void) => {
    setImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {discoverText || styleName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Example/Style Preview */}
          {styleImage && (
            <div className="rounded-xl overflow-hidden border border-border">
              <img 
                src={styleImage} 
                alt={styleName}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 bg-muted/50">
                <p className="text-xs text-muted-foreground text-center">Style Preview</p>
              </div>
            </div>
          )}

          {/* Upload Instructions */}
          <p className="text-sm text-muted-foreground text-center">
            {isCelebrityStyle 
              ? "Upload your image and a celebrity image to merge them"
              : "Upload your image to apply this style"
            }
          </p>

          {/* User Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {isCelebrityStyle ? "Your Photo" : "Upload Image"}
            </label>
            <input 
              ref={userInputRef}
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, setUserImage)}
              className="hidden"
            />
            {userImage ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img 
                  src={userImage} 
                  alt="User upload"
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeImage(setUserImage)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => userInputRef.current?.click()}
                className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Click to upload your image</span>
              </button>
            )}
          </div>

          {/* Celebrity Image Upload (only for Celebrity Style) */}
          {isCelebrityStyle && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Celebrity Photo</label>
              <input 
                ref={celebrityInputRef}
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, setCelebrityImage)}
                className="hidden"
              />
              {celebrityImage ? (
                <div className="relative rounded-xl overflow-hidden border border-border">
                  <img 
                    src={celebrityImage} 
                    alt="Celebrity upload"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeImage(setCelebrityImage)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => celebrityInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <ImagePlus className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Click to upload celebrity image</span>
                </button>
              )}
            </div>
          )}

          {/* Apply Button */}
          <Button 
            onClick={handleApplyStyle}
            disabled={!userImage || (isCelebrityStyle && !celebrityImage) || isProcessing}
            className="w-full h-12 text-base font-medium"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Apply Style
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
