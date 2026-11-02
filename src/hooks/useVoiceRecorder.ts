import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Free, in-browser speech recognition (Chrome, Edge, Safari, Android).
// Falls back to server transcription only when the browser lacks it.
const getNativeRecognition = (): any => {
  if (typeof window === 'undefined') return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>('audio/webm');
  const audioBlobRef = useRef<Blob | null>(null);
  const stoppedPromiseRef = useRef<Promise<void> | null>(null);

  // Native speech state
  const nativeRef = useRef<any>(null);
  const usingNativeRef = useRef(false);
  const finalTextRef = useRef('');
  const interimTextRef = useRef('');
  const wantListeningRef = useRef(false);
  const nativeEndedRef = useRef<Promise<void> | null>(null);
  const nativeEndResolveRef = useRef<(() => void) | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pickMimeType = () => {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/mpeg'];
    for (const t of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(t)) return t;
    }
    return '';
  };

  const startNativeSession = (Ctor: any) => {
    const rec = new Ctor();
    rec.lang = 'en-IN'; // handles English + Hinglish well
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalTextRef.current += r[0].transcript + ' ';
        else interim += r[0].transcript;
      }
      interimTextRef.current = interim;
    };
    rec.onerror = (e: any) => {
      if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') {
        toast.error('Microphone permission denied. Please allow mic access.');
        wantListeningRef.current = false;
      }
    };
    rec.onend = () => {
      // Browsers stop after silence; keep listening until user stops.
      if (wantListeningRef.current) {
        try { rec.start(); return; } catch { /* fall through */ }
      }
      if (interimTextRef.current) {
        finalTextRef.current += interimTextRef.current + ' ';
        interimTextRef.current = '';
      }
      nativeEndResolveRef.current?.();
    };
    nativeRef.current = rec;
    rec.start();
  };

  const startRecording = useCallback(async () => {
    const Ctor = getNativeRecognition();
    if (Ctor) {
      try {
        usingNativeRef.current = true;
        finalTextRef.current = '';
        interimTextRef.current = '';
        wantListeningRef.current = true;
        nativeEndedRef.current = new Promise<void>((res) => { nativeEndResolveRef.current = res; });
        startNativeSession(Ctor);
        setIsRecording(true);
        setIsPaused(false);
        autoStopRef.current = setTimeout(() => {
          if (wantListeningRef.current) {
            wantListeningRef.current = false;
            try { nativeRef.current?.stop(); } catch { /* noop */ }
            setIsRecording(false);
            toast.info('Recording stopped after 60 seconds');
          }
        }, 60000);
        return;
      } catch (err) {
        console.warn('Native speech failed, using fallback', err);
        usingNativeRef.current = false;
      }
    }

    // Fallback: record audio and transcribe on the server
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMimeType();
      const mediaRecorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mimeTypeRef.current = mediaRecorder.mimeType || mime || 'audio/webm';
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      audioBlobRef.current = null;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };
      stoppedPromiseRef.current = new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          audioBlobRef.current = new Blob(chunksRef.current, { type: mimeTypeRef.current || 'audio/webm' });
          stream.getTracks().forEach((t) => t.stop());
          resolve();
        };
      });
      mediaRecorder.start();
      setIsRecording(true);
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          setIsPaused(false);
          toast.info('Recording stopped after 60 seconds');
        }
      }, 60000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (usingNativeRef.current) {
      wantListeningRef.current = false;
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      try { nativeRef.current?.stop(); } catch { nativeEndResolveRef.current?.(); }
      setIsRecording(false);
      setIsPaused(false);
      return;
    }
    const mr = mediaRecorderRef.current;
    if (mr && (mr.state === 'recording' || mr.state === 'paused')) {
      mr.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (usingNativeRef.current) {
      wantListeningRef.current = false;
      try { nativeRef.current?.stop(); } catch { /* noop */ }
      setIsPaused(true);
      return;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (usingNativeRef.current) {
      const Ctor = getNativeRecognition();
      if (Ctor) {
        wantListeningRef.current = true;
        nativeEndedRef.current = new Promise<void>((res) => { nativeEndResolveRef.current = res; });
        try { startNativeSession(Ctor); } catch { /* noop */ }
      }
      setIsPaused(false);
      return;
    }
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const transcribe = useCallback(async (): Promise<string> => {
    setTranscribing(true);
    try {
      if (usingNativeRef.current) {
        if (nativeEndedRef.current) {
          await Promise.race([nativeEndedRef.current, new Promise((r) => setTimeout(r, 2000))]);
        }
        const text = (finalTextRef.current + interimTextRef.current).trim();
        if (!text) {
          toast.error("Couldn't understand audio. Please try again.");
          return '';
        }
        return text;
      }

      if (stoppedPromiseRef.current) await stoppedPromiseRef.current;
      const blob = audioBlobRef.current;
      if (!blob || blob.size < 500) {
        toast.error('No audio captured. Try again.');
        return '';
      }
      const ext = (blob.type.split('/')[1] || 'webm').split(';')[0];
      const file = new File([blob], `recording.${ext}`, { type: blob.type });
      const formData = new FormData();
      formData.append('audio', file);
      const { data, error } = await supabase.functions.invoke('elevenlabs-stt', { body: formData });
      if (error) {
        console.error('STT error', error);
        toast.error('Transcription failed. Please try again.');
        return '';
      }
      const text = (data as any)?.text?.trim() ?? '';
      if (!text) {
        toast.error("Couldn't understand audio. Please try again.");
        return '';
      }
      return text;
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Transcription failed');
      return '';
    } finally {
      setTranscribing(false);
    }
  }, []);

  const reset = useCallback(() => {
    wantListeningRef.current = false;
    try { nativeRef.current?.abort?.(); } catch { /* noop */ }
    usingNativeRef.current = false;
    finalTextRef.current = '';
    interimTextRef.current = '';
    audioBlobRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setTranscribing(false);
  }, []);

  return {
    isRecording,
    isPaused,
    transcribing,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    transcribe,
    reset,
  };
};
