import { useEffect, useRef, useCallback } from 'react';

export const useTypingSound = (isTyping: boolean, enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);

  const playTypingSound = useCallback(() => {
    if (!audioContextRef.current || !enabled) return;

    try {
      const ctx = audioContextRef.current;
      
      // Create oscillator for a soft typing click
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Random frequency for variety (simulates different key sounds)
      const baseFreq = 800 + Math.random() * 400;
      oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      oscillator.type = 'sine';
      
      // Quick envelope for click sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (error) {
      // Silently handle audio errors
    }
  }, [enabled]);

  const startTypingSound = useCallback(() => {
    if (isPlayingRef.current || !enabled) return;
    
    isPlayingRef.current = true;
    
    // Initialize audio context on first use
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Resume audio context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Play typing sounds at random intervals (simulates typing)
    const playRandomTyping = () => {
      if (!isPlayingRef.current) return;
      
      playTypingSound();
      
      // Random interval between 40-120ms for realistic typing feel
      const nextInterval = 40 + Math.random() * 80;
      intervalRef.current = setTimeout(playRandomTyping, nextInterval);
    };
    
    playRandomTyping();
  }, [enabled, playTypingSound]);

  const stopTypingSound = useCallback(() => {
    isPlayingRef.current = false;
    
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isTyping && enabled) {
      startTypingSound();
    } else {
      stopTypingSound();
    }
    
    return () => {
      stopTypingSound();
    };
  }, [isTyping, enabled, startTypingSound, stopTypingSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTypingSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stopTypingSound]);

  return { startTypingSound, stopTypingSound };
};
