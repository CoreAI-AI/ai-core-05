import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";

interface TTSState {
  isActive: boolean;
  isPaused: boolean;
  title: string;
  text: string;
  progress: number; // 0-100
  charIndex: number;
  totalChars: number;
}

interface TTSContextValue extends TTSState {
  play: (text: string, opts?: { title?: string; lang?: string }) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggle: () => void;
}

const TTSContext = createContext<TTSContextValue | null>(null);

export const TTSProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TTSState>({
    isActive: false,
    isPaused: false,
    title: "",
    text: "",
    progress: 0,
    charIndex: 0,
    totalChars: 0,
  });
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  // smooth progress timer for browsers that don't fire 'boundary'
  const tickRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const estimatedMsRef = useRef<number>(0);

  const clearTick = () => {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const stop = useCallback(() => {
    clearTick();
    try {
      window.speechSynthesis.cancel();
    } catch {}
    utterRef.current = null;
    setState({
      isActive: false,
      isPaused: false,
      title: "",
      text: "",
      progress: 0,
      charIndex: 0,
      totalChars: 0,
    });
  }, []);

  const play = useCallback(
    (text: string, opts: { title?: string; lang?: string } = {}) => {
      if (!("speechSynthesis" in window)) return;
      // stop anything first
      try {
        window.speechSynthesis.cancel();
      } catch {}
      clearTick();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = opts.lang || "hi-IN";
      utter.rate = 1;
      utter.pitch = 1;
      utterRef.current = utter;

      // Average ~14 chars/sec at rate 1; fallback estimate for progress ticking
      estimatedMsRef.current = Math.max(2000, (text.length / 14) * 1000);
      startedAtRef.current = Date.now();

      setState({
        isActive: true,
        isPaused: false,
        title: opts.title || "Read aloud",
        text,
        progress: 0,
        charIndex: 0,
        totalChars: text.length,
      });

      utter.onboundary = (e) => {
        const idx = (e as any).charIndex ?? 0;
        const pct = Math.min(100, Math.round((idx / Math.max(1, text.length)) * 100));
        setState((s) => (s.isActive ? { ...s, charIndex: idx, progress: Math.max(s.progress, pct) } : s));
      };
      utter.onend = () => {
        clearTick();
        setState((s) => (s.isActive ? { ...s, progress: 100 } : s));
        // fade out after a beat
        setTimeout(() => {
          utterRef.current = null;
          setState({
            isActive: false,
            isPaused: false,
            title: "",
            text: "",
            progress: 0,
            charIndex: 0,
            totalChars: 0,
          });
        }, 600);
      };
      utter.onerror = () => stop();

      // fallback smooth progress (browsers like mobile Safari don't always fire boundary)
      tickRef.current = window.setInterval(() => {
        setState((s) => {
          if (!s.isActive || s.isPaused) return s;
          const elapsed = Date.now() - startedAtRef.current;
          const est = Math.min(99, Math.round((elapsed / estimatedMsRef.current) * 100));
          return est > s.progress ? { ...s, progress: est } : s;
        });
      }, 250);

      try {
        window.speechSynthesis.speak(utter);
      } catch {
        stop();
      }
    },
    [stop]
  );

  const pause = useCallback(() => {
    try {
      window.speechSynthesis.pause();
      setState((s) => ({ ...s, isPaused: true }));
    } catch {}
  }, []);

  const resume = useCallback(() => {
    try {
      window.speechSynthesis.resume();
      startedAtRef.current = Date.now() - (state.progress / 100) * estimatedMsRef.current;
      setState((s) => ({ ...s, isPaused: false }));
    } catch {}
  }, [state.progress]);

  const toggle = useCallback(() => {
    if (!state.isActive) return;
    if (state.isPaused) resume();
    else pause();
  }, [state.isActive, state.isPaused, pause, resume]);

  useEffect(() => {
    return () => {
      clearTick();
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
  }, []);

  return (
    <TTSContext.Provider value={{ ...state, play, pause, resume, stop, toggle }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTSPlayer = () => {
  const ctx = useContext(TTSContext);
  if (!ctx) throw new Error("useTTSPlayer must be used within TTSProvider");
  return ctx;
};
