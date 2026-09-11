import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = path.join(__dirname, 'public', 'themes');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Colors config per theme
const themeColors = {
  space: {
    bg1: '#0b112c', bg2: '#040714', bg3: '#020308',
    primary: '#6366f1', secondary: '#8b5cf6', accent: '#06b6d4',
    particle1: '#38bdf8', particle2: '#c4b5fd'
  },
  jungle: {
    bg1: '#03261a', bg2: '#011810', bg3: '#010e09',
    primary: '#10b981', secondary: '#059669', accent: '#84cc16',
    particle1: '#34d399', particle2: '#a3e635'
  },
  ocean: {
    bg1: '#052c4d', bg2: '#02172b', bg3: '#010c17',
    primary: '#0ea5e9', secondary: '#0284c7', accent: '#14b8a6',
    particle1: '#38bdf8', particle2: '#2dd4bf'
  },
  sunset: {
    bg1: '#451a08', bg2: '#260e05', bg3: '#120602',
    primary: '#f97316', secondary: '#ea580c', accent: '#f59e0b',
    particle1: '#fed7aa', particle2: '#fb923c'
  },
  sakura: {
    bg1: '#2d0b1d', bg2: '#190610', bg3: '#0f030a',
    primary: '#ec4899', secondary: '#d946ef', accent: '#f472b6',
    particle1: '#fbcfe8', particle2: '#f472b6'
  },
  cyber: {
    bg1: '#0c0d18', bg2: '#05060b', bg3: '#020204',
    primary: '#facc15', secondary: '#06b6d4', accent: '#ff007f',
    particle1: '#facc15', particle2: '#06b6d4'
  },
  midnight: {
    bg1: '#0f111a', bg2: '#08090f', bg3: '#030407',
    primary: '#7c3aed', secondary: '#3b82f6', accent: '#38bdf8',
    particle1: '#c4b5fd', particle2: '#ffffff'
  },
  love: {
    bg1: '#2c0817', bg2: '#17040c', bg3: '#0a0205',
    primary: '#f43f5e', secondary: '#ec4899', accent: '#fda4af',
    particle1: '#fda4af', particle2: '#f43f5e'
  }
};

// Generate Auth Background (clean focused spotlight vignette)
const createAuthSvg = (t) => {
  const c = themeColors[t];
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="auth-spotlight" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="${c.primary}" stop-opacity="0.28"/>
      <stop offset="40%" stop-color="${c.secondary}" stop-opacity="0.12"/>
      <stop offset="80%" stop-color="${c.bg2}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${c.bg3}" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="auth-corner" cx="90%" cy="10%" r="40%">
      <stop offset="0%" stop-color="${c.accent}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${c.bg3}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="${c.bg3}"/>
  <rect width="1920" height="1080" fill="url(#auth-spotlight)"/>
  <circle cx="1700" cy="150" r="450" fill="url(#auth-corner)"/>
  <circle cx="960" cy="500" r="380" fill="none" stroke="${c.primary}" stroke-width="1" stroke-opacity="0.15" stroke-dasharray="4,8"/>
  <circle cx="960" cy="500" r="550" fill="none" stroke="${c.accent}" stroke-width="1" stroke-opacity="0.08"/>
</svg>`.trim();
};

// Generate AI Prepare Background (data streams & neural node matrix)
const createPrepareSvg = (t) => {
  const c = themeColors[t];
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="prep-bg" cx="30%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${c.bg1}"/>
      <stop offset="60%" stop-color="${c.bg2}"/>
      <stop offset="100%" stop-color="${c.bg3}"/>
    </radialGradient>
    <radialGradient id="prep-glow" cx="70%" cy="30%" r="40%">
      <stop offset="0%" stop-color="${c.primary}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${c.bg3}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#prep-bg)"/>
  <circle cx="1400" cy="300" r="450" fill="url(#prep-glow)"/>
  <g stroke="${c.primary}" stroke-width="1" stroke-opacity="0.2" fill="none">
    <path d="M100,200 L400,200 L550,350 L1000,350 L1200,200 L1600,200"/>
    <path d="M200,800 L600,800 L800,650 L1300,650 L1500,800 L1800,800"/>
    <circle cx="550" cy="350" r="4" fill="${c.accent}"/>
    <circle cx="1000" cy="350" r="5" fill="${c.primary}"/>
    <circle cx="800" cy="650" r="4" fill="${c.accent}"/>
    <circle cx="1300" cy="650" r="5" fill="${c.secondary}"/>
  </g>
</svg>`.trim();
};

// Generate Mock Interview Background (soundwave/resonance acoustic aperture)
const createInterviewSvg = (t) => {
  const c = themeColors[t];
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="int-bg" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="${c.bg1}"/>
      <stop offset="60%" stop-color="${c.bg2}"/>
      <stop offset="100%" stop-color="${c.bg3}"/>
    </radialGradient>
    <radialGradient id="int-pulse" cx="50%" cy="50%" r="40%">
      <stop offset="0%" stop-color="${c.secondary}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${c.bg3}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#int-bg)"/>
  <circle cx="960" cy="540" r="400" fill="url(#int-pulse)"/>
  <g fill="none" stroke="${c.primary}" stroke-opacity="0.22" stroke-width="1.5">
    <ellipse cx="960" cy="540" rx="300" ry="120"/>
    <ellipse cx="960" cy="540" rx="450" ry="180" stroke="${c.accent}" stroke-opacity="0.15"/>
    <ellipse cx="960" cy="540" rx="600" ry="240" stroke-dasharray="8,8"/>
    <ellipse cx="960" cy="540" rx="750" ry="300" stroke-opacity="0.08"/>
  </g>
</svg>`.trim();
};

// Generate Admin Dashboard Background (command telemetry grid & metrics architecture)
const createAdminSvg = (t) => {
  const c = themeColors[t];
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="adm-bg" cx="80%" cy="20%" r="75%">
      <stop offset="0%" stop-color="${c.bg1}"/>
      <stop offset="55%" stop-color="${c.bg2}"/>
      <stop offset="100%" stop-color="${c.bg3}"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#adm-bg)"/>
  <g stroke="${c.primary}" stroke-opacity="0.08" stroke-width="1">
    ${Array.from({ length: 16 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="1080"/>`).join('')}
    ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 120}" x2="1920" y2="${i * 120}"/>`).join('')}
  </g>
  <circle cx="1600" cy="200" r="400" fill="${c.primary}" opacity="0.12" filter="blur(60px)"/>
  <circle cx="300" cy="800" r="350" fill="${c.accent}" opacity="0.08" filter="blur(60px)"/>
</svg>`.trim();
};

// Generate Generic Empty-State / Subtle Section Background
const createGenericSvg = (t) => {
  const c = themeColors[t];
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="100%" height="100%">
  <defs>
    <radialGradient id="gen-bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${c.bg1}"/>
      <stop offset="70%" stop-color="${c.bg2}"/>
      <stop offset="100%" stop-color="${c.bg3}"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#gen-bg)"/>
  <circle cx="960" cy="540" r="500" fill="${c.primary}" opacity="0.06" filter="blur(80px)"/>
</svg>`.trim();
};

// Process all themes
Object.keys(themeColors).forEach((theme) => {
  const dir = path.join(THEMES_DIR, theme);
  ensureDir(dir);

  fs.writeFileSync(path.join(dir, 'auth.svg'), createAuthSvg(theme), 'utf8');
  fs.writeFileSync(path.join(dir, 'prepare.svg'), createPrepareSvg(theme), 'utf8');
  fs.writeFileSync(path.join(dir, 'interview.svg'), createInterviewSvg(theme), 'utf8');
  fs.writeFileSync(path.join(dir, 'admin.svg'), createAdminSvg(theme), 'utf8');
  fs.writeFileSync(path.join(dir, 'generic.svg'), createGenericSvg(theme), 'utf8');

  console.log(`Generated full asset suite for theme: ${theme}`);
});
console.log('All 40 theme assets generated successfully.');
