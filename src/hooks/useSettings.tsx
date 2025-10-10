import { useState, useEffect } from 'react';

export interface UserSettings {
  displayName: string;
  profilePicture?: string;
  enabledModelProviders: {
    openai: boolean;
    google: boolean;
  };
  enabledModels: string[];
}

const defaultSettings: UserSettings = {
  displayName: '',
  profilePicture: '',
  enabledModelProviders: {
    openai: true,
    google: true,
  },
  enabledModels: [
    'openai/gpt-5',
    'openai/gpt-5-mini',
    'openai/gpt-5-nano',
    'google/gemini-2.5-pro',
    'google/gemini-2.5-flash',
    'google/gemini-2.5-flash-lite',
    'google/gemini-2.5-flash-image-preview',
  ],
};

export const useSettings = (userId?: string) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const settingsKey = userId ? `user_settings_${userId}` : 'user_settings_demo';

  useEffect(() => {
    // Load settings from localStorage
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