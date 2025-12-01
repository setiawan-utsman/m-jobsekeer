import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/utils/storage';
import { colors } from '@/theme/colors';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: typeof colors.light;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  themeMode: 'auto',
  setThemeMode: () => {},
  colors: colors.light,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useColorScheme() || 'light';
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');

  useEffect(() => {
    loadThemeMode();
  }, []);

  const loadThemeMode = async () => {
    const savedMode = await storage.getThemeMode();
    if (savedMode) {
      setThemeModeState(savedMode as ThemeMode);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await storage.setThemeMode(mode);
  };

  const theme = themeMode === 'auto' ? systemTheme : themeMode;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        colors: colors[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}