import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  {
    id: 'midnight',
    name: 'Midnight',
    icon: '🌙',
    description: 'Soft twilight slate with royal violet, indigo & sky cyan',
    preview: {
      bg: '#111625',
      primary: '#8b5cf6',
      secondary: '#6366f1',
      accent: '#38bdf8',
    },
    assets: {
      background: '/themes/midnight/background.jpg',
      hero: '/themes/midnight/hero.jpg',
      heroVector: '/themes/midnight/hero.svg',
      auth: '/themes/midnight/auth.svg',
      prepare: '/themes/midnight/prepare.svg',
      interview: '/themes/midnight/interview.svg',
      admin: '/themes/midnight/admin.svg',
      generic: '/themes/midnight/generic.svg',
    },
  },
  {
    id: 'love',
    name: 'Love',
    icon: '❤️',
    description: 'Soft plum velvet with gentle ruby rose & coral warmth',
    preview: {
      bg: '#1f141d',
      primary: '#f43f5e',
      secondary: '#fb7185',
      accent: '#fda4af',
    },
    assets: {
      background: '/themes/love/background.jpg',
      hero: '/themes/love/hero.jpg',
      heroVector: '/themes/love/hero.svg',
      auth: '/themes/love/auth.svg',
      prepare: '/themes/love/prepare.svg',
      interview: '/themes/love/interview.svg',
      admin: '/themes/love/admin.svg',
      generic: '/themes/love/generic.svg',
    },
  },
  {
    id: 'space',
    name: 'Space',
    icon: '🌌',
    description: 'Soft cosmic navy slate with starlight indigo & cyan highlights',
    preview: {
      bg: '#101528',
      primary: '#6366f1',
      secondary: '#818cf8',
      accent: '#06b6d4',
    },
    assets: {
      background: '/themes/space/background.jpg',
      hero: '/themes/space/hero.jpg',
      heroVector: '/themes/space/hero.svg',
      auth: '/themes/space/auth.svg',
      prepare: '/themes/space/prepare.svg',
      interview: '/themes/space/interview.svg',
      admin: '/themes/space/admin.svg',
      generic: '/themes/space/generic.svg',
    },
  },
  {
    id: 'jungle',
    name: 'Jungle',
    icon: '🌿',
    description: 'Soft botanical sage slate with fresh emerald & mint accents',
    preview: {
      bg: '#111d18',
      primary: '#10b981',
      secondary: '#14b8a6',
      accent: '#84cc16',
    },
    assets: {
      background: '/themes/jungle/background.jpg',
      hero: '/themes/jungle/hero.jpg',
      heroVector: '/themes/jungle/hero.svg',
      auth: '/themes/jungle/auth.svg',
      prepare: '/themes/jungle/prepare.svg',
      interview: '/themes/jungle/interview.svg',
      admin: '/themes/jungle/admin.svg',
      generic: '/themes/jungle/generic.svg',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    description: 'Soft deep marine glass slate with turquoise & azure waves',
    preview: {
      bg: '#0f1d2b',
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      accent: '#14b8a6',
    },
    assets: {
      background: '/themes/ocean/background.jpg',
      hero: '/themes/ocean/hero.jpg',
      heroVector: '/themes/ocean/hero.svg',
      auth: '/themes/ocean/auth.svg',
      prepare: '/themes/ocean/prepare.svg',
      interview: '/themes/ocean/interview.svg',
      admin: '/themes/ocean/admin.svg',
      generic: '/themes/ocean/generic.svg',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    description: 'Soft warm terracotta dusk with golden amber & peach embers',
    preview: {
      bg: '#211614',
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#f59e0b',
    },
    assets: {
      background: '/themes/sunset/background.jpg',
      hero: '/themes/sunset/hero.jpg',
      heroVector: '/themes/sunset/hero.svg',
      auth: '/themes/sunset/auth.svg',
      prepare: '/themes/sunset/prepare.svg',
      interview: '/themes/sunset/interview.svg',
      admin: '/themes/sunset/admin.svg',
      generic: '/themes/sunset/generic.svg',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    icon: '🌸',
    description: 'Soft mauve garden slate with delicate cherry blossom petals',
    preview: {
      bg: '#20141e',
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#c084fc',
    },
    assets: {
      background: '/themes/sakura/background.jpg',
      hero: '/themes/sakura/hero.jpg',
      heroVector: '/themes/sakura/hero.svg',
      auth: '/themes/sakura/auth.svg',
      prepare: '/themes/sakura/prepare.svg',
      interview: '/themes/sakura/interview.svg',
      admin: '/themes/sakura/admin.svg',
      generic: '/themes/sakura/generic.svg',
    },
  },
  {
    id: 'cyber',
    name: 'Cyber',
    icon: '⚡',
    description: 'Soft modern graphite slate with electric cyan & laser sky',
    preview: {
      bg: '#111420',
      primary: '#06b6d4',
      secondary: '#38bdf8',
      accent: '#facc15',
    },
    assets: {
      background: '/themes/cyber/background.jpg',
      hero: '/themes/cyber/hero.jpg',
      heroVector: '/themes/cyber/hero.svg',
      auth: '/themes/cyber/auth.svg',
      prepare: '/themes/cyber/prepare.svg',
      interview: '/themes/cyber/interview.svg',
      admin: '/themes/cyber/admin.svg',
      generic: '/themes/cyber/generic.svg',
    },
  },
];

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('spp-theme') || 'midnight';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove all existing theme classes
    themes.forEach((t) => root.classList.remove(`theme-${t.id}`));
    // Add the new theme class and data-theme attribute
    root.classList.add(`theme-${currentTheme}`);
    root.setAttribute('data-theme', currentTheme);
    // Save to local storage
    localStorage.setItem('spp-theme', currentTheme);
  }, [currentTheme]);

  const activeTheme = themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        activeTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

