import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppSettings {
  showPricing: boolean;      // Hide all currency/cost displays
  showVendors: boolean;       // Hide vendor/order links
  learningMode: boolean;      // Quick toggle for both (learning = no pricing/vendors)
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  setLearningMode: (enabled: boolean) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = {
  showPricing: true,
  showVendors: true,
  learningMode: false,
};

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kb-app-settings');
      if (saved) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch {
          return DEFAULT_SETTINGS;
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kb-app-settings', JSON.stringify(settings));
    }
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };

      // If toggling individual settings, update learningMode accordingly
      if (key === 'showPricing' || key === 'showVendors') {
        newSettings.learningMode = !newSettings.showPricing && !newSettings.showVendors;
      }

      return newSettings;
    });
  };

  const setLearningMode = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      learningMode: enabled,
      showPricing: !enabled,
      showVendors: !enabled,
    }));
  };

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting, setLearningMode }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
}
