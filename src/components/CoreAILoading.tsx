import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import coreaiLogo from '@/assets/coreai-logo.png';

interface CoreAILoadingProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CoreAILoading = ({
  fullScreen = true,
  message,
  size = 'md',
}: CoreAILoadingProps) => {
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // 3.5 seconds se zyada load time hone par slow network status dikhayega
    const slowTimer = setTimeout(() => {
      setIsSlowNetwork(true);
    }, 3500);

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setIsSlowNetwork(false);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      clearTimeout(slowTimer);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const sizeClasses = {
    sm: { box: 'w-12 h-12', logo: 'w-8 h-8 rounded-lg', ring: '-inset-1', text: 'text-xs' },
    md: { box: 'w-20 h-20', logo: 'w-14 h-14 rounded-xl', ring: '-inset-2', text: 'text-sm' },
    lg: { box: 'w-28 h-28', logo: 'w-20 h-20 rounded-2xl', ring: '-inset-3', text: 'text-base' },
  }[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-5 select-none">
      {/* Logo with Orbiting Loading Arc */}
      <div className={`relative ${sizeClasses.box} flex items-center justify-center`}>
        {/* Subtle Ambient Pulse */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%)' }}
          animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orbiting Loading Arc Ring */}
        <motion.div
          className={`absolute ${sizeClasses.ring} rounded-full pointer-events-none border-2 border-transparent`}
          style={{
            borderTopColor: '#2dd4bf',
            borderRightColor: 'rgba(45, 212, 191, 0.25)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        />

        {/* CoreAI Logo with Gentle Breath Effect */}
        <motion.img
          src={coreaiLogo}
          alt="CoreAI Loading"
          className={`${sizeClasses.logo} object-contain will-change-transform shadow-lg`}
          animate={{ scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Dynamic Status Text */}
      <div className={`flex items-center gap-2 font-medium text-muted-foreground tracking-wide ${sizeClasses.text}`}>
        <span>
          {isOffline
            ? 'Offline • Reconnecting...'
            : isSlowNetwork
            ? 'Slow network • Holding on...'
            : message || 'Loading CoreAI'}
        </span>
        {!isOffline && (
          <span className="inline-flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse [animation-delay:400ms]" />
          </span>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F17] transition-colors duration-300">
        {content}
      </div>
    );
  }

  return content;
};

export default CoreAILoading;
