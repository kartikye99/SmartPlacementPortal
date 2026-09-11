import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeSwitcher = () => {
  const { currentTheme, setCurrentTheme, activeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Top Navbar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: isOpen ? 'var(--theme-primary)' : 'var(--theme-border)',
          boxShadow: isOpen ? 'var(--theme-glow)' : 'none',
        }}
        aria-label="Theme selector"
        title="Change application theme"
      >
        <span className="text-sm leading-none select-none">{activeTheme.icon}</span>
        <span 
          className="text-xs font-bold hidden md:inline-block leading-none"
          style={{ color: 'var(--theme-text)' }}
        >
          {activeTheme.name}
        </span>
        {/* Small Visual Preview Dots */}
        <div className="flex items-center gap-1">
          <span 
            className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm"
            style={{ backgroundColor: activeTheme.preview.primary }}
          />
          <span 
            className="w-2 h-2 rounded-full border border-white/20 shadow-sm hidden sm:inline-block"
            style={{ backgroundColor: activeTheme.preview.accent }}
          />
        </div>
        <ChevronDown 
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--theme-text-muted)' }}
        />
      </button>

      {/* Theme Selection Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 rounded-2xl border p-2.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50 backdrop-blur-2xl"
          style={{
            backgroundColor: 'var(--theme-surface-elevated)',
            borderColor: 'var(--theme-border)',
            boxShadow: 'var(--theme-shadow), 0 20px 45px -10px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div 
            className="px-3 py-2 border-b mb-2 flex items-center justify-between"
            style={{ borderColor: 'var(--theme-border-subtle)' }}
          >
            <div>
              <p className="text-xs font-extrabold flex items-center gap-1.5" style={{ color: 'var(--theme-text)' }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
                Atmospheric Themes
              </p>
              <p className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>
                Global palette & ambient visual engine
              </p>
            </div>
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: 'var(--theme-badge-bg)',
                color: 'var(--theme-badge-text)',
                borderColor: 'var(--theme-badge-border)',
              }}
            >
              8 Themes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-0.5">
            {themes.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setCurrentTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`group relative flex flex-col p-2.5 rounded-xl border text-left transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-offset-1 ring-offset-black/50 shadow-lg scale-[1.01]' 
                      : 'hover:scale-[1.015]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--theme-surface-hover)' : 'var(--theme-surface)',
                    borderColor: isSelected ? 'var(--theme-primary)' : 'var(--theme-border-subtle)',
                    boxShadow: isSelected ? 'var(--theme-glow)' : 'none',
                  }}
                >
                  {/* Card Header: Icon & Name & Check */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base select-none">{theme.icon}</span>
                      <span 
                        className="text-xs font-bold truncate"
                        style={{ color: isSelected ? 'var(--theme-text)' : 'var(--theme-text-muted)' }}
                      >
                        {theme.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: 'var(--theme-primary)' }}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Small Visual Preview Swatch */}
                  <div 
                    className="w-full h-7 rounded-lg border p-1 flex items-center justify-between shadow-inner"
                    style={{
                      backgroundColor: theme.preview.bg,
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-3.5 h-3.5 rounded-md shadow-sm border border-white/20"
                        style={{ backgroundColor: theme.preview.primary }}
                      />
                      <div 
                        className="w-2.5 h-2.5 rounded-md shadow-sm border border-white/10"
                        style={{ backgroundColor: theme.preview.secondary }}
                      />
                    </div>
                    <div 
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: theme.preview.accent }}
                    />
                  </div>

                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div 
                      className="w-full h-0.5 rounded-full mt-2 transition-all"
                      style={{ background: 'var(--theme-gradient)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
