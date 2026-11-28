import { useState, useEffect } from 'react';

export type FaithPreference = 'universal' | 'islam' | 'hinduism' | 'christianity' | 'sikhism' | 'jainism_buddhism';

export interface UserSettings {
  displayName: string;
  profilePicture?: string;
  // Appearance
  fontSize: 'small' | 'medium' | 'large';
  chatDensity: 'comfortable' | 'compact';
  // AI Preferences
  defaultModel: string;
  responseLength: 'short' | 'balanced' | 'detailed';
  creativityLevel: number;
  // Voice & Audio
  voiceInputEnabled: boolean;
  textToSpeechEnabled: boolean;
  selectedVoice: string;
  speechRate: number;
  // Data & History
  autoSaveConversations: boolean;

  // --- Real Personality & Custom Instructions (Zero Cost) ---
  personalityPreset: 'friend' | 'mentor' | 'teacher' | 'creative' | 'technical';
  customAboutMe: string;           // "CoreAI aapke baare mein kya jaane?"
  customResponseStyle: string;     // "CoreAI kis style mein respond kare?"
  sendOnEnter: boolean;            // Enter = Send, Shift+Enter = New line

  // --- Faith & Cultural Greetings Preference ---
  faithPreference: FaithPreference;
}

const defaultSettings: UserSettings = {
  displayName: '',
  profilePicture: '',
  fontSize: 'medium',
  chatDensity: 'comfortable',
  defaultModel: 'gpt-4',
  responseLength: 'balanced',
  creativityLevel: 50,
  voiceInputEnabled: false,
  textToSpeechEnabled: false,
  selectedVoice: '',
  speechRate: 1,
  autoSaveConversations: true,

  // Defaults
  personalityPreset: 'friend',
  customAboutMe: '',
  customResponseStyle: '',
  sendOnEnter: true,
  faithPreference: 'universal',
};

export const useSettings = (userId?: string) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const settingsKey = userId ? `user_settings_${userId}` : 'user_settings_demo';

  useEffect(() => {
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
    setIsLoading(false);
  }, [settingsKey]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem(settingsKey, JSON.stringify(updatedSettings));
    // Broadcast to companion memory & homepage so AI immediately updates personality & greetings
    window.dispatchEvent(new Event('coreai_settings_updated'));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(settingsKey);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };
};
