import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSwitcher = () => {
  const { currentTheme, toggleTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] select-none"
      style={{
        backgroundColor: 'var(--theme-surface)',
        borderColor: 'var(--theme-border)',
        boxShadow: 'var(--theme-shadow)',
      }}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark ? 'Academic Light' : 'Obsidian Dark'} Theme`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-zinc-100 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110" />
        )}
      </div>

      <span
        className="text-xs font-semibold tracking-wide hidden sm:inline-block transition-colors"
        style={{ color: 'var(--theme-text)' }}
      >
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>

      {/* Subtle indicator pill */}
      <div
        className="w-7 h-4 rounded-full p-0.5 flex items-center transition-colors duration-300 border"
        style={{
          backgroundColor: isDark ? '#27272a' : '#e4e4e7',
          borderColor: isDark ? '#3f3f46' : '#d4d4d8',
        }}
      >
        <div
          className={`w-3 h-3 rounded-full shadow-sm transition-transform duration-300 ${
            isDark ? 'translate-x-3 bg-white' : 'translate-x-0 bg-zinc-900'
          }`}
        />
      </div>
    </button>
  );
};
