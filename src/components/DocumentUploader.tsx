import { useState, useCallback } from "react";
import { Upload, File, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentUploaderProps {
  userId: string;
  onUploadComplete: () => void;
}

export const DocumentUploader = ({ userId, onUploadComplete }: DocumentUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, DOCX, and TXT files are supported');
      return false;
    }
    
    return true;
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setUploadProgress(15);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Smooth progress simulation
      const progressTimer = setInterval(() => {
        setUploadProgress(prev => (prev >= 85 ? prev : prev + 12));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      clearInterval(progressTimer);
      setUploadProgress(95);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_url: fileName,
          file_size: file.size,
          file_type: file.type,
        });

      if (dbError) throw dbError;

      setUploadProgress(100);
      toast.success('Document uploaded successfully! ✓');
      setTimeout(() => {
        setSelectedFile(null);
        onUploadComplete();
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [userId, onUploadComplete]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4 select-none">
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={dragActive ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden ${
          dragActive 
            ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
            : 'border-border/70 hover:border-primary/50 hover:bg-muted/30'
        }`}
      >
        <motion.div
          animate={dragActive ? { y: -6 } : { y: 0 }}
          transition={{ repeat: dragActive ? Infinity : 0, repeatType: "reverse", duration: 0.6 }}
        >
          <Upload className={`w-12 h-12 mx-auto mb-3 transition-colors ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
        </motion.div>
        
        <p className="text-sm font-medium text-foreground mb-1">
          Drag and drop your document here, or
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          PDF, DOCX, TXT (Up to 10MB)
        </p>

        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <label htmlFor="file-upload">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={uploading} 
            asChild
            className="rounded-xl px-5 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <span>Browse Files</span>
          </Button>
        </label>
      </motion.div>

      <AnimatePresence>
        {selectedFile && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="border border-border/70 bg-card/60 rounded-2xl p-4 space-y-3.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <File className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {!uploading && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedFile(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {uploading && (
              <div className="space-y-1.5">
                <Progress value={uploadProgress} className="h-2 rounded-full" />
                <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" /> Uploading to secure cloud...
                  </span>
                  <span>{uploadProgress.toFixed(0)}%</span>
                </div>
              </div>
            )}

            {!uploading && (
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => uploadFile(selectedFile)}
                  className="w-full rounded-xl h-10 font-medium cursor-pointer shadow-sm hover:shadow-md transition-all"
                  size="sm"
                >
                  Start Upload
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
