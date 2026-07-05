import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>('audio/webm');
  const audioBlobRef = useRef<Blob | null>(null);
  const stoppedPromiseRef = useRef<Promise<void> | null>(null);

  const pickMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/mpeg',
    ];
    for (const t of candidates) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(t)) {
        return t;
      }
    }
    return '';
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMimeType();
      const mediaRecorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      mimeTypeRef.current = mediaRecorder.mimeType || mime || 'audio/webm';
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      audioBlobRef.current = null;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) chunksRef.current.push(event.data);
      };

      stoppedPromiseRef.current = new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          const type = mimeTypeRef.current || 'audio/webm';
          audioBlobRef.current = new Blob(chunksRef.current, { type });
          stream.getTracks().forEach((t) => t.stop());
          resolve();
        };
      });

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 60 seconds
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
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const transcribe = useCallback(async (): Promise<string> => {
    setTranscribing(true);
    try {
      // Wait for MediaRecorder onstop to fire so blob is finalized
      if (stoppedPromiseRef.current) {
        await stoppedPromiseRef.current;
      }
      const blob = audioBlobRef.current;
      if (!blob || blob.size < 500) {
        toast.error('No audio captured. Try again.');
        return '';
      }

      const ext = (blob.type.split('/')[1] || 'webm').split(';')[0];
      const file = new File([blob], `recording.${ext}`, { type: blob.type });

      const formData = new FormData();
      formData.append('audio', file);

      const { data, error } = await supabase.functions.invoke('elevenlabs-stt', {
        body: formData,
      });

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
