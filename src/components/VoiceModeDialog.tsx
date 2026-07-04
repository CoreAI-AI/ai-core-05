import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, X, Volume2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";

interface VoiceModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (text: string) => void;
  /** Latest AI text to speak back (parent passes newest assistant message). */
  latestAssistantText?: string;
  /** True while AI is generating / streaming. */
  isAIBusy?: boolean;
  isPremium?: boolean;
}

type Phase = "idle" | "listening" | "thinking" | "speaking";

// Prefer a natural female Indian/English voice if available
const pickVoice = () => {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => /hi-IN/i.test(v.lang) && /female|swara|kalpana|neerja/i.test(v.name)) ||
    voices.find((v) => /en-IN/i.test(v.lang)) ||
    voices.find((v) => /hi-IN/i.test(v.lang)) ||
    voices.find((v) => /en-(US|GB)/i.test(v.lang) && /female|samantha|zira|jenny/i.test(v.name)) ||
    voices.find((v) => /en/i.test(v.lang)) ||
    voices[0]
  );
};

export const VoiceModeDialog = ({
  open,
  onOpenChange,
  onSubmit,
  latestAssistantText,
  isAIBusy,
  isPremium,
}: VoiceModeDialogProps) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [interim, setInterim] = useState("");
  const [finalText, setFinalText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const submittedRef = useRef<string>("");
  const spokenTextRef = useRef<string>("");
  const shouldListenRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<number | null>(null);

  const clearSilence = () => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false;
    clearSilence();
    try { recognitionRef.current?.stop(); } catch {}
  };

  const startListening = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    // Cancel any TTS
    try { window.speechSynthesis.cancel(); } catch {}

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";

    rec.onstart = () => {
      setPhase("listening");
      setError(null);
    };

    rec.onresult = (event: any) => {
      let interimText = "";
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalChunk += res[0].transcript;
        else interimText += res[0].transcript;
      }
      if (finalChunk) {
        setFinalText((p) => (p + " " + finalChunk).trim());
      }
      setInterim(interimText);

      // Reset silence timer whenever we get any speech
      clearSilence();
      silenceTimerRef.current = window.setTimeout(() => {
        // On silence, submit whatever we have
        const combined = (finalText + " " + finalChunk + " " + interimText).replace(/\s+/g, " ").trim();
        if (combined && combined !== submittedRef.current) {
          submittedRef.current = combined;
          setFinalText("");
          setInterim("");
          setPhase("thinking");
          try { rec.stop(); } catch {}
          track("voice_mode_message_sent", { length: combined.length });
          onSubmit(combined);
        }
      }, 1400);
    };

    rec.onerror = (e: any) => {
      if (e?.error === "no-speech" || e?.error === "aborted") return;
      if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
        setError("Microphone permission denied. Enable it in your browser settings.");
        shouldListenRef.current = false;
        setPhase("idle");
      }
    };

    rec.onend = () => {
      // Auto-restart if we still want to listen (continuous mode)
      if (shouldListenRef.current && phase !== "speaking") {
        try { rec.start(); } catch {}
      }
    };

    recognitionRef.current = rec;
    shouldListenRef.current = true;
    try {
      rec.start();
    } catch {
      // ignore start errors on rapid toggles
    }
  };

  // Speak assistant response, then resume listening.
  useEffect(() => {
    if (!open) return;
    if (!latestAssistantText) return;
    if (latestAssistantText === spokenTextRef.current) return;
    if (isAIBusy) return; // wait until stream done

    spokenTextRef.current = latestAssistantText;
    // Strip markdown-ish
    const clean = latestAssistantText
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[*_`#>]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .slice(0, 900);
    if (!clean.trim()) return;

    // Pause listening while speaking
    try { recognitionRef.current?.stop(); } catch {}
    setPhase("speaking");

    const utter = new SpeechSynthesisUtterance(clean);
    const v = pickVoice();
    if (v) utter.voice = v;
    utter.rate = 1.02;
    utter.pitch = 1;
    utter.onend = () => {
      if (shouldListenRef.current) {
        setPhase("listening");
        try { recognitionRef.current?.start(); } catch {}
      } else {
        setPhase("idle");
      }
    };
    utter.onerror = () => {
      if (shouldListenRef.current) setPhase("listening");
      else setPhase("idle");
    };
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch {}
  }, [latestAssistantText, isAIBusy, open]);

  // Ensure voices load
  useEffect(() => {
    if (!open) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, [open]);

  // Start when opened, cleanup when closed
  useEffect(() => {
    if (open) {
      track("voice_mode_started");
      setInterim("");
      setFinalText("");
      submittedRef.current = "";
      spokenTextRef.current = "";
      // Request mic permission upfront for reliability
      (async () => {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ audio: true });
          s.getTracks().forEach((t) => t.stop());
          startListening();
        } catch {
          setError("Microphone permission denied. Enable it in your browser settings.");
          toast.error("Microphone permission is needed for Voice Mode.");
        }
      })();
    } else {
      track("voice_mode_stopped");
      stopListening();
      try { window.speechSynthesis.cancel(); } catch {}
      setPhase("idle");
    }
    return () => {
      stopListening();
      try { window.speechSynthesis.cancel(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Reflect thinking state from parent
  useEffect(() => {
    if (!open) return;
    if (isAIBusy) setPhase("thinking");
  }, [isAIBusy, open]);

  const label =
    phase === "listening" ? "Listening…" :
    phase === "thinking" ? "Thinking…" :
    phase === "speaking" ? "Speaking…" :
    "Tap the mic to start";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <div className={`relative rounded-3xl p-8 text-center backdrop-blur-2xl border ${
          isPremium
            ? "bg-gradient-to-br from-amber-500/10 via-background/95 to-purple-600/15 border-amber-400/30 shadow-[0_0_60px_rgba(168,85,247,0.25)]"
            : "bg-background/95 border-border shadow-2xl"
        }`}>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted/60 transition"
            aria-label="Close voice mode"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center gap-6 py-4">
            {/* Animated orb */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <AnimatePresence>
                {phase !== "idle" && (
                  <>
                    <motion.div
                      key="ring1"
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: [0.9, 1.25, 0.9], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full ${
                        phase === "listening" ? "bg-primary/30" :
                        phase === "speaking" ? "bg-amber-400/30" :
                        "bg-purple-500/30"
                      }`}
                    />
                    <motion.div
                      key="ring2"
                      initial={{ scale: 0.7, opacity: 0.4 }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      className={`absolute inset-0 rounded-full ${
                        phase === "listening" ? "bg-primary/20" :
                        phase === "speaking" ? "bg-purple-500/20" :
                        "bg-primary/20"
                      }`}
                    />
                  </>
                )}
              </AnimatePresence>

              <motion.div
                animate={{ scale: phase === "listening" ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl ${
                  isPremium
                    ? "bg-gradient-to-br from-amber-400 via-yellow-500 to-purple-600"
                    : "bg-gradient-to-br from-primary to-purple-500"
                }`}
              >
                {phase === "thinking" ? (
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                ) : phase === "speaking" ? (
                  <Volume2 className="w-10 h-10 text-white" />
                ) : phase === "listening" ? (
                  <Mic className="w-10 h-10 text-white" />
                ) : (
                  <MicOff className="w-10 h-10 text-white/80" />
                )}
              </motion.div>
            </div>

            <div className="space-y-1">
              <p className={`text-lg font-semibold ${isPremium ? "bg-gradient-to-r from-amber-500 to-purple-500 bg-clip-text text-transparent" : "text-foreground"}`}>
                {label}
              </p>
              <p className="text-xs text-muted-foreground">
                Hands-free voice conversation with CoreAI
              </p>
            </div>

            {(finalText || interim) && phase === "listening" && (
              <div className="w-full max-w-sm min-h-[52px] rounded-xl bg-muted/60 border border-border px-3 py-2 text-sm text-left">
                <span className="text-foreground">{finalText}</span>{" "}
                <span className="text-muted-foreground italic">{interim}</span>
              </div>
            )}

            {error && (
              <p className="text-xs text-destructive max-w-sm">{error}</p>
            )}

            <div className="flex items-center gap-2 pt-2">
              {phase === "listening" ? (
                <Button
                  variant="outline"
                  onClick={stopListening}
                  className="rounded-full"
                >
                  <MicOff className="w-4 h-4 mr-1.5" /> Pause
                </Button>
              ) : phase !== "thinking" && phase !== "speaking" ? (
                <Button
                  onClick={startListening}
                  className={`rounded-full ${isPremium ? "bg-gradient-to-r from-amber-500 to-purple-600 text-white" : "gradient-bg text-white"}`}
                >
                  <Mic className="w-4 h-4 mr-1.5" /> Start speaking
                </Button>
              ) : null}
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full">
                End
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
