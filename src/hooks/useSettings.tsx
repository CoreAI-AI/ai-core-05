import { useState, useEffect } from 'react';

export interface UserSettings {
  displayName: string;
  profilePicture?: string;
  // Appearance
  fontSize: 'small' | 'medium' | 'large';
  chatDensity: 'comfortable' | 'compact';
  // AI Preferences
  responseLength: 'short' | 'balanced' | 'detailed';
  creativityLevel: number;
  // Voice & Audio (mic input only — TTS removed)
  voiceInputEnabled: boolean;
  // Data & History
  autoSaveConversations: boolean;
  // --- Deprecated (kept optional for backwards-compat with old localStorage) ---
  defaultModel?: string;
  textToSpeechEnabled?: boolean;
  selectedVoice?: string;
  speechRate?: number;
}

const defaultSettings: UserSettings = {
  displayName: '',
  profilePicture: '',
  fontSize: 'medium',
  chatDensity: 'comfortable',
  responseLength: 'balanced',
  creativityLevel: 50,
  voiceInputEnabled: false,
  autoSaveConversations: true,
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