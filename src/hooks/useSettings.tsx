import { useState, useEffect } from 'react';

export interface UserSettings {
  displayName: string;
  profilePicture?: string;
}

const defaultSettings: UserSettings = {
  displayName: '',
  profilePicture: '',
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