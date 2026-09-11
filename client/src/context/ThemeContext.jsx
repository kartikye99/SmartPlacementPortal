import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const themes = [
  {
    id: 'light',
    name: 'Institutional Light',
    icon: '☀️',
    description: 'Clear university workspace for everyday administration',
    preview: { bg: '#f4f6f8', surface: '#ffffff', primary: '#0c5964', secondary: '#d7e0e5', accent: '#174b6b' },
    assets: {},
  },
  {
    id: 'dark',
    name: 'Institutional Dark',
    icon: '🌙',
    description: 'Low-light university workspace with restrained contrast',
    preview: { bg: '#0e1921', surface: '#142630', primary: '#67c4c0', secondary: '#2a424e', accent: '#72a8c2' },
    assets: {},
  },
];

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('spp-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.className = root.className
      .split(' ')
      .filter((className) => !className.startsWith('theme-'))
      .join(' ');
    root.classList.add(`theme-${currentTheme}`);
    root.dataset.theme = currentTheme;
    localStorage.setItem('spp-theme', currentTheme);
  }, [currentTheme]);

  const activeTheme = themes.find((theme) => theme.id === currentTheme) || themes[0];
  const toggleTheme = () => setCurrentTheme((theme) => (theme === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, toggleTheme, activeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
