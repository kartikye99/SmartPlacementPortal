import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = path.join(__dirname, 'public', 'themes');

// Curated high-aesthetic Unsplash photography matching each theme's vibe
// Using parameters: w=1920&q=80&auto=format&fit=crop for crisp, gorgeous wallpaper visuals
const themeImages = {
  space: {
    bg: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1920&q=80&auto=format&fit=crop', // Purple nebula & cosmic stardust
    hero: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80&auto=format&fit=crop', // Deep space satellite nebula network
  },
  jungle: {
    bg: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80&auto=format&fit=crop', // Dark lush tropical foliage
    hero: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&q=80&auto=format&fit=crop', // Emerald misty forest sunbeams
  },
  ocean: {
    bg: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80&auto=format&fit=crop', // Deep turquoise marine ocean waves
    hero: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1600&q=80&auto=format&fit=crop', // Sunlight piercing deep blue water
  },
  sunset: {
    bg: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80&auto=format&fit=crop', // Fiery golden orange twilight clouds
    hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80&auto=format&fit=crop', // Warm sunset horizon dusk
  },
  sakura: {
    bg: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=80&auto=format&fit=crop', // Soft pink cherry blossom petals bokeh
    hero: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80&auto=format&fit=crop', // Kyoto sakura blossom garden pagoda
  },
  cyber: {
    bg: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80&auto=format&fit=crop', // Cyberpunk neon rainy night reflections
    hero: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80&auto=format&fit=crop', // Neon futuristic grid synthwave
  },
  midnight: {
    bg: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=1920&q=80&auto=format&fit=crop', // Full moon through midnight clouds
    hero: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80&auto=format&fit=crop', // Midnight starry peaks & violet glow
  },
  love: {
    bg: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920&q=80&auto=format&fit=crop', // Deep red rose velvet petals
    hero: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1600&q=80&auto=format&fit=crop', // Romantic warm glowing hearts bokeh
  }
};

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    console.log(`Saved: ${destPath} (${Math.round(buffer.length / 1024)} KB)`);
  } catch (err) {
    console.error(`Failed to download ${url}:`, err.message);
  }
}

async function main() {
  for (const [theme, urls] of Object.entries(themeImages)) {
    const themeDir = path.join(THEMES_DIR, theme);
    if (!fs.existsSync(themeDir)) fs.mkdirSync(themeDir, { recursive: true });

    const bgDest = path.join(themeDir, 'background.jpg');
    const heroDest = path.join(themeDir, 'hero.jpg');

    console.log(`Downloading assets for ${theme}...`);
    await downloadFile(urls.bg, bgDest);
    await downloadFile(urls.hero, heroDest);
  }
  console.log('All theme images downloaded successfully!');
}

main();
