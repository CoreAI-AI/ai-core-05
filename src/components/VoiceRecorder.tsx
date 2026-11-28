import { Mic, Square, Pause, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export const VoiceRecorder = ({ onTranscriptionComplete, disabled }: VoiceRecorderProps) => {
  const {
    isRecording,
    isPaused,
    transcribing,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    transcribe,
    reset,
  } = useVoiceRecorder();

  const handleStopAndTranscribe = async () => {
    stopRecording();
    const text = await transcribe();
    if (text) {
      onTranscriptionComplete(text);
    }
    reset();
  };

  if (transcribing) {
    return (
      <Button size="sm" variant="ghost" disabled className="text-primary">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  if (isRecording) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1.5 bg-destructive/10 border border-destructive/20 rounded-full px-2 py-0.5"
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={isPaused ? resumeRecording : pauseRecording}
          className="h-7 w-7 p-0 text-foreground hover:bg-destructive/20 rounded-full cursor-pointer"
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleStopAndTranscribe}
          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/20 rounded-full cursor-pointer"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </Button>

        {/* Live Audio Waves Animation */}
        <div className="flex items-center gap-0.5 px-1 h-3">
          {[0.6, 1.2, 0.8, 1.4].map((scale, i) => (
            <motion.span
              key={i}
              animate={isPaused ? { height: 4 } : { height: [4, 14, 6, 16, 4] }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-0.5 bg-destructive rounded-full"
            />
          ))}
        </div>

        <span className="text-[11px] font-medium text-destructive pr-1">
          {isPaused ? 'Paused' : 'Listening...'}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={startRecording}
      disabled={disabled}
      className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
      title="Start voice recording (Ctrl+Shift+V)"
    >
      <Mic className="w-4 h-4" />
    </motion.button>
  );
};
