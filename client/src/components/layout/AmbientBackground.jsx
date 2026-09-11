import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AmbientBackground
 * Renders high-definition theme photographic / artistic background,
 * dynamic multi-color aurora glow blobs, and an SVG micro-texture noise overlay.
 * Delivers deep visual immersion tailored to each theme while preserving crisp content legibility.
 */
export const AmbientBackground = () => {
  const { activeTheme } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-700" aria-hidden="true">
      {/* Theme Photographic / Art Wallpaper with Soft Atmospheric Vignette */}
      {activeTheme?.assets?.background && (
        <div className="absolute inset-0 overflow-hidden transition-all duration-1000 ease-out">
          <img
            key={activeTheme.id}
            src={activeTheme.assets.background}
            alt=""
            className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out animate-in fade-in"
            style={{
              opacity: '0.11',
              filter: 'saturate(1.15) contrast(1.05)',
            }}
          />
          {/* Gentle Radial & Linear Vignette masks for soft, pleasant atmospheric depth */}
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: 'radial-gradient(ellipse at 50% 35%, transparent 15%, var(--theme-background) 80%)',
            }}
          />
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{
              background: 'linear-gradient(180deg, color-mix(in srgb, var(--theme-background) 40%, transparent) 0%, transparent 20%, transparent 80%, var(--theme-background) 100%)',
            }}
          />
        </div>
      )}

      {/* Aurora Blob 1: Dynamic Theme Primary Glow (Top Left - Center) */}
      <div
        className="absolute -top-[12%] -left-[8%] w-[680px] h-[680px] rounded-full animate-aurora-1 transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, var(--theme-glow-1) 0%, transparent 70%)',
          filter: 'blur(95px)',
        }}
      />

      {/* Aurora Blob 2: Dynamic Theme Secondary Glow (Top Right - Floating) */}
      <div
        className="absolute top-[18%] -right-[10%] w-[620px] h-[620px] rounded-full animate-aurora-2 transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, var(--theme-glow-2) 0%, transparent 70%)',
          filter: 'blur(105px)',
        }}
      />

      {/* Aurora Blob 3: Dynamic Theme Accent Glow (Bottom Center - Deep) */}
      <div
        className="absolute -bottom-[15%] left-[25%] w-[650px] h-[650px] rounded-full animate-aurora-3 transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, var(--theme-glow-3) 0%, transparent 70%)',
          filter: 'blur(115px)',
        }}
      />

      {/* Atmospheric Theme Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{
          backgroundColor: 'var(--theme-background-overlay)',
        }}
      />

      {/* SVG Micro-Texture Noise Overlay to eliminate banding & provide tactile matte depth */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.032] mix-blend-overlay pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="ambientNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
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
