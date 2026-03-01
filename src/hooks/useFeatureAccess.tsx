import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type FeatureId = 'hd_image' | 'deep_research' | 'pdf_export' | 'chat_save';

export interface FeatureConfig {
  id: FeatureId;
  name: string;
  priceINR: number;
  description: string;
  icon: string;
}

export const PREMIUM_FEATURES: Record<FeatureId, FeatureConfig> = {
  hd_image: {
    id: 'hd_image',
    name: 'HD Image Generation',
    priceINR: 19,
    description: 'Generate high-quality HD images with all styles',
    icon: '🎨',
  },
  deep_research: {
    id: 'deep_research',
    name: 'Deep Research Mode',
    priceINR: 29,
    description: 'Advanced AI research with detailed analysis',
    icon: '🔬',
  },
  pdf_export: {
    id: 'pdf_export',
    name: 'PDF/DOC Export',
    priceINR: 49,
    description: 'Export your chats as PDF or DOC files',
    icon: '📄',
  },
  chat_save: {
    id: 'chat_save',
    name: 'Chat History Save',
    priceINR: 19,
    description: 'Save unlimited chat history',
    icon: '💾',
  },
};

export const useFeatureAccess = (userId: string | undefined) => {
  const [unlockedFeatures, setUnlockedFeatures] = useState<Set<FeatureId>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPurchases = async () => {
      const { data, error } = await supabase
        .from('user_purchases')
        .select('feature_id')
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (!error && data) {
        setUnlockedFeatures(new Set(data.map(p => p.feature_id as FeatureId)));
      }
      setLoading(false);
    };

    fetchPurchases();
  }, [userId]);

  const isFeatureUnlocked = useCallback(
    (featureId: FeatureId) => unlockedFeatures.has(featureId),
    [unlockedFeatures]
  );

  const unlockFeature = useCallback(
    async (featureId: FeatureId) => {
      if (!userId) return false;
      
      const feature = PREMIUM_FEATURES[featureId];
      const { error } = await supabase.from('user_purchases').insert({
        user_id: userId,
        feature_id: featureId,
        amount_inr: feature.priceINR,
        status: 'completed',
      });

      if (!error) {
        setUnlockedFeatures(prev => new Set([...prev, featureId]));
        return true;
      }
      return false;
    },
    [userId]
  );

  return { isFeatureUnlocked, unlockFeature, loading, unlockedFeatures };
};
