# Keita's Kold Brew — Full Project Plan
> A mobile-first Progressive Web App (PWA) for cold brew concentrate, dilution, and cold foam calculations.
> Built with React + Tailwind CSS. Hosted on a subdomain. Installable on iOS & Android.

---

## 1. Project Overview

**App Name:** Keita's Kold Brew  
**Tagline:** *Brewed to perfection. Every time.*  
**URL Structure:** `brew.yourwebsite.com` (subdomain)  
**Tech Stack:** React + Tailwind CSS + Vite (PWA via `vite-plugin-pwa`)  
**Primary Platform:** Mobile (iOS & Android) via PWA install  
**Secondary Platform:** Desktop browser  

### What It Does
Three linked calculators, all on one installable web app:
1. **Concentrate Calculator** — how much coffee and water to make cold brew concentrate
2. **Dilution Calculator** — how much water and sugar syrup to add to your concentrate
3. **Cold Foam Calculator** — heavy cream, sugar syrup, and full cream milk ratios

---

## 2. Research Summary

### Cold Brew Ratios (Industry Context)
- Standard cold brew concentrate brewing ratios range from **1:4 to 1:8** (coffee:water by weight/volume)
- Keita's preferred ratio is **1:4** (1 part coffee grounds to 4 parts water) — on the stronger/more concentrated end, producing a bold concentrate ideal for dilution
- After brewing, the coffee grounds absorb ~20% of water, so actual yield is ~80% of water used — the app should account for this in yield estimates
- Steep time: **12–24 hours**, ideal sweet spot is **16–18 hours** in the fridge
- Grind size: **coarse** — this should be noted as a tip in the UI

### Keita's Dilution Ratio
- Recipe: **2L concentrate + 2.5L water + 0.5L sugar syrup = 5L ready-to-drink**
- Simplified ratio: **4 : 5 : 1** (concentrate : water : sugar syrup)
- As percentages: 40% concentrate, 50% water, 10% sugar syrup
- This is the default. Users can adjust the ratio sliders and set their concentrate volume.

### Keita's Cold Foam Recipe
- **8 parts heavy cream + 2 parts sugar syrup + 1 part full cream milk**
- Total ratio: **8:2:1** (cream:syrup:milk)
- Results in a rich, pourable foam — not stiff whipped cream
- Tip: Ingredients must be **very cold** before frothing
- Tip: Use a handheld milk frother for 15–25 seconds until soft peaks form
- Tip: Make fresh — foam separates if left to sit

### PWA Technical Notes
- React + Vite + `vite-plugin-pwa` is the recommended modern stack for this
- Requires: `manifest.json`, service worker, HTTPS on subdomain
- On Android (Chrome): auto install prompt or via browser menu → "Add to Home Screen"
- On iOS (Safari): Share → "Add to Home Screen"
- Offline support: app works without internet after first load (all logic is client-side)
- `localStorage` is available in PWAs for saving user preferences/custom ratios

### UI/UX Design Patterns (Research Findings)
- Best-in-class calculator apps use **large touch targets**, **slider + numeric input combos**, and **live updating results** (no submit button)
- Mobile-first means: bottom nav bar, thumb-friendly input zones, generous padding
- Premium feel comes from: **custom typography**, **subtle texture**, **card-based layout**, **smooth transitions**
- Coffee apps that perform well use **warm neutrals**, **earthy tones**, and **clean iconography**
- Avoid cluttered UIs — one calculator per screen, clear hierarchy

---

## 3. Visual Design System

### Colour Palette
```
Background:       #1A1208  (deep espresso brown)
Surface/Cards:    #2C1F0E  (dark roast brown)
Surface Light:    #3D2B14  (mid-roast brown)
Primary Accent:   #C8956C  (warm caramel/latte)
Secondary Accent: #E8C99A  (cream highlight)
Text Primary:     #F5ECD7  (off-white cream)
Text Secondary:   #A68B6A  (muted tan)
Border/Divider:   #4A3520  (subtle brown)
Success:          #7DB87A  (soft sage green)
Error:            #C0614E  (muted terracotta)
```

### Typography
```
Display/Logo:   'Playfair Display' (serif) — brand name, headings
Body/UI:        'Inter' (sans-serif) — labels, inputs, results
Accent/Tips:    'Playfair Display' italic — tip text, taglines
```

### Spacing & Radii
- Border radius: `16px` for cards, `12px` for inputs, `999px` for pills/badges
- Padding: `24px` horizontal gutters on mobile
- Touch targets: minimum `48px` height for all interactive elements

### Iconography
- Use `lucide-react` icons throughout
- Key icons: `Coffee`, `Droplets`, `Timer`, `Settings`, `ChevronRight`, `RefreshCw`, `Bookmark`

---

## 4. App Architecture

### File Structure
```
keitas-kold-brew/
├── public/
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── favicon.ico
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── SliderInput.jsx
│   │   ├── UnitToggle.jsx
│   │   ├── ResultCard.jsx
│   │   ├── TipCard.jsx
│   │   ├── SaveRatioButton.jsx
│   │   └── Timer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ConcentrateCalculator.jsx
│   │   ├── DilutionCalculator.jsx
│   │   └── ColdFoamCalculator.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useTimer.js
│   └── utils/
│       ├── calculations.js
│       └── unitConversions.js
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### Routing
Use `react-router-dom` with four routes:
- `/` → Home screen
- `/concentrate` → Concentrate Calculator
- `/dilution` → Dilution Calculator
- `/cold-foam` → Cold Foam Calculator

---

## 5. Screen-by-Screen Specification

---

### Screen 1: Home

**Layout:**
- Full-screen dark background with subtle coffee texture overlay (CSS radial gradient)
- Centered logo lockup: "Keita's" in Playfair Display italic (cream), "KOLD BREW" in bold caps with letter-spacing
- Tagline below: *"Brewed to perfection. Every time."* in muted tan
- Three large tappable cards stacked vertically, each with:
  - Icon (lucide-react)
  - Card title
  - One-line description
  - Chevron arrow

**Cards:**
```
☕ Concentrate Calculator
   "How much coffee & water do I need?"

💧 Dilution Calculator
   "Mix your concentrate to drinking strength"

🥛 Cold Foam Calculator
   "Silky foam ratios for any batch size"
```

**Bottom Nav:** Always visible. Icons for Home, Concentrate, Dilution, Cold Foam.

**PWA Install Banner:** If `beforeinstallprompt` event fires (Android/Chrome), show a subtle bottom banner: *"Add Keita's Kold Brew to your home screen"* with an Install button.

---

### Screen 2: Concentrate Calculator

**Purpose:** Input how much coffee grounds you have (or want to use), and calculate how much water you need based on a 1:4 ratio.

**Header:** "Concentrate" with a back-to-home chevron and a settings/reset icon.

**Unit Toggle:** Metric (g / ml) | Imperial (oz / cups) — pill toggle at top right. Persisted to localStorage.

**Section A — Ratio Settings**
- Default ratio: **1:4** (coffee:water)
- Ratio slider: range 1:3 to 1:8, step 0.5, live label showing current ratio
- "Reset to Keita's ratio" text button (resets to 1:4)
- Save custom ratio button (💾) — saves to localStorage

**Section B — Input**
- Large numeric input: "Coffee Grounds" with unit label (g or oz)
- Stepper buttons (+/-) flanking the input for easy mobile adjustment
- Alternatively: slider below the input (0–500g range, step 5)

**Section C — Results (live updating)**
ResultCard component showing:
```
┌─────────────────────────────┐
│  ☕ Coffee Grounds           │
│  [input value] g            │
├─────────────────────────────┤
│  💧 Water Needed             │
│  [calculated] ml            │
├─────────────────────────────┤
│  📦 Expected Yield          │
│  ~[0.8 × water] ml          │
│  (accounts for grounds      │
│   absorbing ~20% of water)  │
└─────────────────────────────┘
```

**Section D — Brew Timer**
- Collapsed by default, expand with a tap
- User sets hours (12–24h, default 18h)
- Start / Pause / Reset controls
- Live countdown display: `HH:MM:SS`
- Push notification tip: *"Set your phone's native alarm as a backup"*
- TipCard: *"Steep in the fridge. Coarse grind only. 16–18 hours is the sweet spot."*

**Section E — Tips**
Expandable tip card:
- Grind size: Extra coarse
- Steep time: 12–24 hrs, ideal 16–18 hrs
- Temperature: Always in the fridge
- Water: Use filtered water for best flavour

---

### Screen 3: Dilution Calculator

**Purpose:** Given a volume of concentrate, calculate how much water and sugar syrup to add to reach drinking strength using Keita's 4:5:1 ratio.

**Header:** "Dilution" with unit toggle.

**Section A — Ratio Settings**
- Default: **4:5:1** (concentrate:water:sugar syrup)
- Three sliders, one per component, labelled in parts (1–10)
- Live ratio label updates as sliders move: e.g. "4 : 5 : 1"
- "Reset to Keita's ratio" text button
- Save custom ratio button

**Section B — Input**
- Large numeric input: "Concentrate Volume" with unit label (ml or fl oz / cups)
- Stepper buttons (+/-)
- Slider: 0–3000ml, step 50

**Section C — Results (live updating)**
```
┌─────────────────────────────┐
│  🧪 Concentrate              │
│  [input] ml                 │
├─────────────────────────────┤
│  💧 Water to Add             │
│  [calculated] ml            │
├─────────────────────────────┤
│  🍯 Sugar Syrup to Add       │
│  [calculated] ml            │
├─────────────────────────────┤
│  🥤 Total Volume             │
│  [total] ml  (~[L] litres)  │
└─────────────────────────────┘
```

**Section D — Tips**
TipCard:
- *"Keita's ratio makes 5L from 2L concentrate — perfect for a big batch"*
- *"Adjust sweetness by tweaking the sugar syrup ratio"*
- *"Ready-to-drink cold brew keeps 5–7 days in the fridge"*

---

### Screen 4: Cold Foam Calculator

**Purpose:** Input desired batch size of cold foam, calculate exact amounts of heavy cream, sugar syrup, and full cream milk.

**Header:** "Cold Foam" with unit toggle.

**Section A — Ratio Settings**
- Default: **8:2:1** (heavy cream : sugar syrup : full cream milk)
- Three sliders, one per component
- "Reset to Keita's ratio" text button
- Save custom ratio button

**Section B — Input**
- Large numeric input: "Total Foam Volume" (ml or fl oz)
- Stepper buttons (+/-)
- Preset quick-select pill buttons: `50ml` `100ml` `150ml` `200ml`

**Section C — Results (live updating)**
```
┌─────────────────────────────┐
│  🥛 Heavy Cream              │
│  [calculated] ml            │
├─────────────────────────────┤
│  🍯 Sugar Syrup              │
│  [calculated] ml            │
├─────────────────────────────┤
│  🥛 Full Cream Milk          │
│  [calculated] ml            │
├─────────────────────────────┤
│  Total                      │
│  [total] ml                 │
└─────────────────────────────┘
```

**Section D — Technique Tips**
TipCard (expandable):
- *"Ingredients must be very cold before frothing"*
- *"Froth for 15–25 seconds — stop at soft, pourable peaks"*
- *"Make fresh — foam separates after ~15 minutes"*
- *"Use a handheld milk frother for best results"*
- *"Don't over-whip — you want pourable foam, not stiff cream"*

---

## 6. Shared Components

### `SliderInput`
Props: `value`, `onChange`, `min`, `max`, `step`, `unit`, `label`
- Shows a numeric text input + stepper buttons on top
- Slider below, synced bidirectionally
- Tapping the number opens a native numeric keyboard

### `UnitToggle`
Props: `unit` (`'metric'` | `'imperial'`), `onChange`
- Pill-style toggle: `ml / g` | `fl oz / cups`
- Persisted to localStorage
- Triggers unit conversion on all visible values when toggled

### `ResultCard`
Props: `rows` (array of `{ icon, label, value, unit }`)
- Styled dark card with dividers
- Values animate/transition when they change (CSS transition on value)
- Large, readable font for the value

### `TipCard`
Props: `tips` (array of strings), `collapsible` (bool)
- Warm amber/cream styling
- Coffee bean icon header
- Expandable if `collapsible` is true

### `SaveRatioButton`
Props: `ratioKey`, `currentValues`
- Small 💾 icon button
- On tap: saves to localStorage under `ratioKey`
- Shows a brief "Saved!" toast confirmation

### `Timer`
Props: `defaultHours`
- Hours selector (12–24, tap to edit)
- Start / Pause / Reset
- Countdown display: `HH : MM : SS` in large mono font
- Persists timer state across page navigations (component stays mounted via layout)

### `BottomNav`
- 4 tabs: Home, Concentrate, Dilution, Cold Foam
- Active tab: accent colour + slightly larger icon
- Always fixed to bottom, above safe area inset (for iPhone notch)

---

## 7. Calculation Logic (`utils/calculations.js`)

### Concentrate Calculator
```js
// coffee: grams, ratio: e.g. 4 (meaning 1:4)
function calculateConcentrate(coffeeGrams, ratio) {
  const waterMl = coffeeGrams * ratio;
  const expectedYieldMl = waterMl * 0.8; // 20% absorbed by grounds
  return { waterMl, expectedYieldMl };
}
```

### Dilution Calculator
```js
// concentrateMl: number, ratio: { concentrate, water, syrup }
function calculateDilution(concentrateMl, ratio) {
  const total = ratio.concentrate + ratio.water + ratio.syrup;
  const waterMl = (concentrateMl / ratio.concentrate) * ratio.water;
  const syrupMl = (concentrateMl / ratio.concentrate) * ratio.syrup;
  const totalMl = concentrateMl + waterMl + syrupMl;
  return { waterMl, syrupMl, totalMl };
}

// Default call: calculateDilution(2000, { concentrate: 4, water: 5, syrup: 1 })
// → { waterMl: 2500, syrupMl: 500, totalMl: 5000 }
```

### Cold Foam Calculator
```js
// totalMl: number, ratio: { cream, syrup, milk }
function calculateColdFoam(totalMl, ratio) {
  const parts = ratio.cream + ratio.syrup + ratio.milk;
  const creamMl = (totalMl / parts) * ratio.cream;
  const syrupMl = (totalMl / parts) * ratio.syrup;
  const milkMl = (totalMl / parts) * ratio.milk;
  return { creamMl, syrupMl, milkMl };
}

// Default call: calculateColdFoam(110, { cream: 8, syrup: 2, milk: 1 })
// → { creamMl: 80, syrupMl: 20, milkMl: 10 }
```

### Unit Conversions (`utils/unitConversions.js`)
```js
// Metric ↔ Imperial
const ML_PER_FLOZ = 29.5735;
const ML_PER_CUP = 236.588;
const G_PER_OZ = 28.3495;

function mlToFlOz(ml) { return ml / ML_PER_FLOZ; }
function flOzToMl(floz) { return floz * ML_PER_FLOZ; }
function gToOz(g) { return g / G_PER_OZ; }
function ozToG(oz) { return oz * G_PER_OZ; }
function mlToCups(ml) { return ml / ML_PER_CUP; }
function cupsToMl(cups) { return cups * ML_PER_CUP; }

// Display helper: show ml up to 999, then switch to L
function formatVolume(ml, unit) {
  if (unit === 'metric') {
    return ml >= 1000 ? `${(ml / 1000).toFixed(2)} L` : `${Math.round(ml)} ml`;
  } else {
    const floz = mlToFlOz(ml);
    return floz >= 8 ? `${(floz / 8).toFixed(2)} cups` : `${floz.toFixed(1)} fl oz`;
  }
}
```

---

## 8. localStorage Schema

```js
// Keys stored in localStorage:
{
  "kkb_unit": "metric" | "imperial",
  "kkb_concentrate_ratio": 4,              // e.g. 1:4
  "kkb_dilution_ratio": { concentrate: 4, water: 5, syrup: 1 },
  "kkb_foam_ratio": { cream: 8, syrup: 2, milk: 1 },
  "kkb_timer_hours": 18,
  "kkb_last_tab": "/concentrate"           // restore last visited tab
}
```

---

## 9. PWA Configuration

### `manifest.json`
```json
{
  "name": "Keita's Kold Brew",
  "short_name": "Kold Brew",
  "description": "Cold brew calculator for concentrate, dilution & cold foam",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#1A1208",
  "theme_color": "#1A1208",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

### `vite.config.js` (PWA plugin)
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: { /* same as above */ },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
});
```

### Tailwind Config
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brew: {
          bg:        '#1A1208',
          surface:   '#2C1F0E',
          mid:       '#3D2B14',
          accent:    '#C8956C',
          cream:     '#E8C99A',
          text:      '#F5ECD7',
          muted:     '#A68B6A',
          border:    '#4A3520',
          success:   '#7DB87A',
          error:     '#C0614E',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
      }
    }
  },
  plugins: []
};
```

---

## 10. Dependencies

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "react-router-dom": "^6",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "vite-plugin-pwa": "^0.20",
    "tailwindcss": "^3",
    "autoprefixer": "^10",
    "postcss": "^8"
  }
}
```

Google Fonts to load in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet">
```

---

## 11. Hosting & Subdomain Setup

1. **Build:** `npm run build` → outputs to `dist/`
2. **Host options (recommended):**
   - **Vercel** (easiest): connect repo, set root to project folder, add custom domain `brew.yourwebsite.com`
   - **Netlify**: same process, drag-and-drop `dist/` or connect repo
   - **Cloudflare Pages**: free, fast CDN, great for PWAs
3. **Subdomain DNS:** Add a `CNAME` record in your domain registrar:
   - Name: `brew`
   - Value: your Vercel/Netlify/Cloudflare URL
4. **HTTPS:** All three hosts provide free SSL — required for PWA install to work
5. **Service worker scope:** Ensure the service worker is served from the root of the subdomain (`brew.yourwebsite.com/`)

---

## 12. Default Recipes Reference (for Claude Code)

| Calculator | Field | Default Value |
|---|---|---|
| Concentrate | Ratio | 1:4 (coffee:water) |
| Concentrate | Coffee input | 100g |
| Concentrate | Steep time | 18 hours |
| Dilution | Ratio | 4:5:1 (concentrate:water:syrup) |
| Dilution | Concentrate input | 2000ml |
| Cold Foam | Ratio | 8:2:1 (cream:syrup:milk) |
| Cold Foam | Total volume | 110ml |
| Global | Unit | Metric (ml/g) |

---

## 13. Build Order for Claude Code

Suggest building in this sequence:
1. `vite.config.js` + `tailwind.config.js` + `package.json` setup
2. Global styles (`index.css`), font imports, CSS variables
3. `utils/calculations.js` + `utils/unitConversions.js`
4. `hooks/useLocalStorage.js` + `hooks/useTimer.js`
5. Shared components: `UnitToggle`, `SliderInput`, `ResultCard`, `TipCard`, `SaveRatioButton`, `Timer`, `BottomNav`
6. Pages: `Home` → `ConcentrateCalculator` → `DilutionCalculator` → `ColdFoamCalculator`
7. `App.jsx` with routing
8. `manifest.json` + PWA icons
9. `vite-plugin-pwa` integration + service worker
10. Final test: build, serve, install on phone via Chrome/Safari

---

## 14. Future Features (Post-MVP)

- **Batch history** — log previous brews with date stamps
- **Flavour notes** — tag each batch with a rating and notes
- **Share recipe** — generate a shareable link with your custom ratio encoded in the URL
- **Sugar syrup calculator** — 1:1 water:sugar with volume input
- **Push notifications** — native timer alert when steep is done (requires notification permission)
- **Dark/light mode toggle**
- **Onboarding flow** — brief swipeable intro for first-time users

---

*Plan prepared for Claude Code. All ratios, calculations, and architecture are production-ready.*
