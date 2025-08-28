"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
};

type FontSize = 'small' | 'medium' | 'large';

type ThemeContextType = {
  currentTheme: Theme;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
};

const themes: Theme[] = [
  {
    name: 'Light',
    primary: 'bg-blue-600',
    secondary: 'bg-blue-200',
    background: 'bg-white',
    text: 'text-gray-900'
  },
  {
    name: 'Dark',
    primary: 'bg-gray-800',
    secondary: 'bg-gray-700',
    background: 'bg-gray-900',
    text: 'text-white'
  },
  {
    name: 'Purple',
    primary: 'bg-purple-600',
    secondary: 'bg-purple-200',
    background: 'bg-purple-50',
    text: 'text-gray-900'
  },
  {
    name: 'Green',
    primary: 'bg-green-600',
    secondary: 'bg-green-200',
    background: 'bg-green-50',
    text: 'text-gray-900'
  }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setCurrentTheme(JSON.parse(savedTheme));
    }

    // Load font size from localStorage
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', JSON.stringify(theme));
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        fontSize,
        setTheme: handleThemeChange,
        setFontSize: handleFontSizeChange
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { themes };