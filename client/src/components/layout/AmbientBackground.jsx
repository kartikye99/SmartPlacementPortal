import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AmbientBackground
 * Renders an executive, clean academic background with a subtle mathematical grid,
 * gentle monochromatic ambient lighting, and tactile texture.
 * Ensures 100% legibility and prestigious College UMS aesthetic in both Dark and Light modes.
 */
export const AmbientBackground = () => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none" aria-hidden="true">
      {/* Dynamic Background Base */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: 'var(--theme-background-image)',
        }}
      />

      {/* Elegant Academic Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 transition-opacity duration-500" />

      {/* Monochromatic Executive Ambient Glow (Top Center) */}
      <div
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full transition-all duration-700 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.045) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(15, 23, 42, 0.035) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Subtle Bottom Ambient Gradient */}
      <div
        className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full transition-all duration-700 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(15, 23, 42, 0.018) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />

      {/* Soft Vignette Mask */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(9, 9, 11, 0.6) 100%)'
            : 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(248, 250, 252, 0.6) 100%)',
        }}
      />

      {/* SVG Micro-Texture Noise Overlay for subtle paper/slate feel */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.02] mix-blend-overlay pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="ambientNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ambientNoise)" />
      </svg>
    </div>
  );
};
