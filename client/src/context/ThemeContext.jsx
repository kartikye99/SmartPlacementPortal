import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  {
    id: 'dark',
    name: 'Obsidian Dark',
    icon: '🌙',
    description: 'Executive deep obsidian black with clean white typography & crisp slate borders',
    preview: {
      bg: '#09090b',
      surface: '#121215',
      primary: '#ffffff',
      secondary: '#27272a',
      accent: '#a1a1aa',
    },
    assets: {
      background: '',
      hero: '',
      heroVector: '',
      auth: '',
      prepare: '',
      interview: '',
      admin: '',
      generic: '',
    },
  },
  {
    id: 'light',
    name: 'Academic Light',
    icon: '☀️',
    description: 'Prestigious clean white campus aesthetic with rich dark typography & slate outlines',
    preview: {
      bg: '#ffffff',
      surface: '#f8fafc',
      primary: '#09090b',
      secondary: '#e4e4e7',
      accent: '#52525b',
    },
    assets: {
      background: '',
      hero: '',
      heroVector: '',
      auth: '',
      prepare: '',
      interview: '',
      admin: '',
      generic: '',
    },
  },
];

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('spp-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Clean old theme classes
    root.classList.remove(
      'theme-midnight',
      'theme-love',
      'theme-space',
      'theme-jungle',
      'theme-ocean',
      'theme-sunset',
      'theme-sakura',
      'theme-cyber',
      'theme-dark',
      'theme-light'
    );
    root.classList.add(`theme-${currentTheme}`);
    root.setAttribute('data-theme', currentTheme);
    localStorage.setItem('spp-theme', currentTheme);
  }, [currentTheme]);

  const activeTheme = themes.find((t) => t.id === currentTheme) || themes[0];

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        toggleTheme,
        activeTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
