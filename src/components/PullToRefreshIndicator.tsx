import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshIndicatorProps {
  pullProgress: number;
  refreshing: boolean;
  pulling: boolean;
}

export const PullToRefreshIndicator = ({ pullProgress, refreshing, pulling }: PullToRefreshIndicatorProps) => {
  if (!pulling && !refreshing) return null;

  return (
    <motion.div
      className="flex items-center justify-center py-3"
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: pullProgress > 0.2 || refreshing ? 1 : 0,
        height: refreshing ? 48 : pullProgress * 48,
      }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={refreshing ? { rotate: 360 } : { rotate: pullProgress * 360 }}
        transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
      >
        <RefreshCw 
          className={`w-5 h-5 ${pullProgress >= 1 || refreshing ? 'text-primary' : 'text-muted-foreground'}`} 
        />
      </motion.div>
    </motion.div>
  );
};
