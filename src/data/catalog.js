// ============================================================
// PACSUN HOME — EDITABLE CATALOG
// Edit the PRODUCTS array below to change the whole site:
// tray, shop grid, presets, quiz results and cart all read from it.
// footprint = real-world size in feet (used by AI Fit Check).
// dims = real-world W × D × H in INCHES (used by "View in Your Room" AR).
// short = compact label used on the room canvas + AR box.
// pattern: 'stars' | 'checker' | 'dots' | null  (room-canvas texture)
// zone: default snap zone — 'bed' | 'floor' | 'desk' | 'wall' | 'window'
// Product imagery is intentionally placeholder — tiles render a grey
// swatch-tinted block until real mockups are dropped in.
// ============================================================

const PRODUCTS = [
  // ---------- DORM / COLLEGE (16–24) ----------
  { id: 'd1', name: 'Star Print Comforter & Sham Set', collection: 'dorm', category: 'bedding', short: 'Comforter', price: 89, zone: 'bed', pattern: 'stars', footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
    colorways: [ { name: 'Pink', hex: '#f4b8dd' }, { name: 'Lime', hex: '#cfe08a' }, { name: 'Black', hex: '#2b2b31' } ] },
  { id: 'd2', name: 'Checkerboard Shag Rug', collection: 'dorm', category: 'rug', short: 'Rug', price: 59, zone: 'floor', pattern: 'checker', footprint: { w: 5, l: 7 }, dims: { w: 60, d: 84, h: 2 },
    colorways: [ { name: 'Black & White', hex: '#f2f2f2' }, { name: 'Sage', hex: '#c3cfa4' }, { name: 'Lilac', hex: '#cbb2ff' } ] },
  { id: 'd3', name: 'Acrylic Desk Organizer', collection: 'dorm', category: 'organizer', short: 'Organizer', price: 34, zone: 'desk', pattern: null, footprint: null, dims: { w: 9, d: 7, h: 11 },
    colorways: [ { name: 'Clear', hex: '#dfe9f0' }, { name: 'Pink', hex: '#f2cfe4' } ] },
  { id: 'd4', name: 'Chrome Jewelry Case', collection: 'dorm', category: 'storage', short: 'Jewelry', price: 28, zone: 'desk', pattern: null, footprint: null, dims: { w: 8, d: 6, h: 5 },
    colorways: [ { name: 'Chrome', hex: '#d9dee6' }, { name: 'Blush', hex: '#eec2d8' } ] },
  { id: 'd5', name: 'LED Strip Lights · 16 ft', collection: 'dorm', category: 'lighting', short: 'LED', price: 24, zone: 'wall', pattern: null, footprint: null, dims: { w: 7, d: 7, h: 2 },
    colorways: [ { name: 'Pink', hex: '#e87fc4' }, { name: 'Ice Blue', hex: '#8fd4e8' }, { name: 'Lime', hex: '#c9d96a' } ] },
  { id: 'd6', name: 'Poster Print Pack · Set of 6', collection: 'dorm', category: 'wall-art', short: 'Posters', price: 22, zone: 'wall', pattern: null, footprint: null, dims: { w: 18, d: 1, h: 24 },
    colorways: [ { name: 'Mixed', hex: '#e0a9c9' }, { name: 'Blue Tone', hex: '#9cb4d6' }, { name: 'Mono', hex: '#d8d8d8' } ] },
  { id: 'd7', name: 'Complete Dorm Kit', collection: 'dorm', category: 'kit', short: 'Dorm Kit', price: 199, zone: 'floor', pattern: null, footprint: { w: 2, l: 2 }, dims: { w: 24, d: 24, h: 24 },
    colorways: [ { name: 'Warm', hex: '#dcb8cb' }, { name: 'Neutral', hex: '#ddd8cd' } ] },

  // ---------- HOME ESSENTIALS (22–30, flagship) ----------
  { id: 'e1', name: 'Washed Sateen Duvet Set', collection: 'essentials', category: 'bedding', short: 'Duvet', price: 129, zone: 'bed', pattern: null, footprint: { w: 5, l: 7 }, dims: { w: 60, d: 80, h: 25 },
    colorways: [ { name: 'Oat', hex: '#e3d5bd' }, { name: 'Clay', hex: '#c67d54' }, { name: 'Sage', hex: '#adb99a' } ] },
  { id: 'e2', name: 'Matcha Ceremony Set', collection: 'essentials', category: 'kitchen', short: 'Matcha', price: 68, zone: 'desk', pattern: null, footprint: null, dims: { w: 12, d: 8, h: 6 },
    colorways: [ { name: 'Matcha', hex: '#b7c9a1' }, { name: 'Cream', hex: '#efe6d6' } ] },
  { id: 'e3', name: 'Arched Stone Bookends · Pair', collection: 'essentials', category: 'decor', short: 'Bookends', price: 42, zone: 'desk', pattern: null, footprint: null, dims: { w: 12, d: 5, h: 7 },
    colorways: [ { name: 'Travertine', hex: '#ddd0bd' }, { name: 'Charcoal', hex: '#5a5a5a' } ] },
  { id: 'e4', name: 'Suitcase Record Player', collection: 'essentials', category: 'audio', short: 'Turntable', price: 149, zone: 'desk', pattern: null, footprint: null, dims: { w: 14, d: 10, h: 5 },
    colorways: [ { name: 'Cream', hex: '#efe6d6' }, { name: 'Cocoa', hex: '#8a6247' } ] },
  { id: 'e5', name: 'Plush Throw Blanket', collection: 'essentials', category: 'blanket', short: 'Throw', price: 79, zone: 'bed', pattern: null, footprint: null, dims: { w: 20, d: 14, h: 8 },
    colorways: [ { name: 'Ivory', hex: '#f3ede2' }, { name: 'Mocha', hex: '#b08968' }, { name: 'Stone', hex: '#b9b6ae' } ] },
  { id: 'e6', name: 'Stoneware Dinnerware Set', collection: 'essentials', category: 'kitchen', short: 'Dinnerware', price: 96, zone: 'desk', pattern: null, footprint: null, dims: { w: 11, d: 11, h: 10 },
    colorways: [ { name: 'Sand', hex: '#dccfb8' }, { name: 'Off-White', hex: '#f1ece1' } ] },
  { id: 'e7', name: 'Ribbed Glassware · Set of 4', collection: 'essentials', category: 'kitchen', short: 'Glassware', price: 32, zone: 'desk', pattern: null, footprint: null, dims: { w: 12, d: 4, h: 5 },
    colorways: [ { name: 'Clear', hex: '#dcedf5' }, { name: 'Amber', hex: '#e0a951' } ] },
  { id: 'e8', name: 'Mushroom Table Lamp', collection: 'essentials', category: 'lighting', short: 'Lamp', price: 54, zone: 'desk', pattern: null, footprint: null, dims: { w: 8, d: 8, h: 14 },
    colorways: [ { name: 'Butter', hex: '#eed9a4' }, { name: 'Cream', hex: '#efe6d6' } ] },
  { id: 'e9', name: 'Potted Faux Monstera', collection: 'essentials', category: 'decor', short: 'Plant', price: 46, zone: 'floor', pattern: null, footprint: { w: 1, l: 1 }, dims: { w: 14, d: 14, h: 30 },
    colorways: [ { name: 'Stone Pot', hex: '#cfc8bb' }, { name: 'Terracotta', hex: '#c67d54' } ] },

  // ---------- KIDS (4–12) ----------
  { id: 'k1', name: 'Polka Dot Comforter Set', collection: 'kids', category: 'bedding', short: 'Comforter', price: 69, zone: 'bed', pattern: 'dots', footprint: { w: 4, l: 6 }, dims: { w: 39, d: 75, h: 22 },
    colorways: [ { name: 'Butter', hex: '#ffe9a8' }, { name: 'Sky', hex: '#bfe3ff' }, { name: 'Blush', hex: '#ffd3dd' } ] },
  { id: 'k2', name: 'Checkered Flag Comforter Set', collection: 'kids', category: 'bedding', short: 'Comforter', price: 74, zone: 'bed', pattern: 'checker', footprint: { w: 4, l: 6 }, dims: { w: 39, d: 75, h: 22 },
    colorways: [ { name: 'Race Red', hex: '#e05555' }, { name: 'Pit Blue', hex: '#7291e0' } ] },
  { id: 'k3', name: 'Bunk Bed Bedding Set', collection: 'kids', category: 'bedding', short: 'Bunk Set', price: 89, zone: 'bed', pattern: null, footprint: null, dims: { w: 20, d: 14, h: 10 },
    colorways: [ { name: 'Cherry', hex: '#e07070' }, { name: 'Navy', hex: '#4a5c85' } ] },
  { id: 'k4', name: 'Race Car Wall Art · Set of 3', collection: 'kids', category: 'wall-art', short: 'Wall Art', price: 36, zone: 'wall', pattern: null, footprint: null, dims: { w: 12, d: 1, h: 12 },
    colorways: [ { name: 'Red Team', hex: '#e08080' }, { name: 'Blue Team', hex: '#93aae0' } ] },
  { id: 'k5', name: 'Checkered Wallpaper Roll', collection: 'kids', category: 'wallpaper', short: 'Wallpaper', price: 48, zone: 'wall', pattern: 'checker', footprint: null, dims: { w: 4, d: 4, h: 21 },
    colorways: [ { name: 'Black & White', hex: '#ffffff' }, { name: 'Sky Blue', hex: '#bfe3ff' } ] },
  { id: 'k6', name: 'Racetrack Play Rug', collection: 'kids', category: 'rug', short: 'Play Rug', price: 44, zone: 'floor', pattern: 'checker', footprint: { w: 4, l: 6 }, dims: { w: 48, d: 72, h: 1 },
    colorways: [ { name: 'Asphalt', hex: '#8a8a8a' }, { name: 'Green', hex: '#8fce7e' } ] },
]

const COLLECTIONS = {
  dorm: {
    id: 'dorm', name: 'Dorm / College', short: 'Dorm', ages: '16–24',
    tagline: 'Everything your 12×14 needs for move-in.',
    vibe: ['graphic prints', 'LED lighting', 'small-space storage'],
    accent: '#9db24a',
  },
  essentials: {
    id: 'essentials', name: 'Home Essentials', short: 'Essentials', ages: '22–30', flagship: true,
    tagline: 'Elevated basics in warm neutrals.',
    vibe: ['minimal', 'warm neutrals', 'kitchen + decor'],
    accent: '#b08968',
  },
  kids: {
    id: 'kids', name: 'Kids', short: 'Kids', ages: '4–12',
    tagline: 'Playful rooms in light, bright palettes.',
    vibe: ['polka dots', 'racing checkers', 'bunk-bed ready'],
    accent: '#c25858',
  },
}

// Room presets — one-tap starter rooms. items: [productId, colorwayIndex, zone]
const PRESETS = [
  { id: 'y2k-glow', name: 'Glow Setup', collection: 'dorm',
    items: [['d1', 0, 'bed'], ['d5', 0, 'wall'], ['d2', 2, 'floor'], ['d4', 0, 'desk']] },
  { id: 'poster-wall', name: 'Poster Wall', collection: 'dorm',
    items: [['d6', 0, 'wall'], ['d1', 2, 'bed'], ['d3', 0, 'desk'], ['d2', 0, 'floor']] },
  { id: 'minimal-dorm', name: 'Minimal Dorm', collection: 'dorm',
    items: [['d1', 2, 'bed'], ['d2', 0, 'floor'], ['d3', 0, 'desk']] },
  { id: 'neutral-era', name: 'Neutral Era', collection: 'essentials',
    items: [['e1', 0, 'bed'], ['e5', 0, 'bed'], ['e8', 0, 'desk'], ['e3', 0, 'desk']] },
  { id: 'coffee-bar', name: 'Coffee Bar Corner', collection: 'essentials',
    items: [['e2', 0, 'desk'], ['e7', 0, 'desk'], ['e6', 1, 'desk'], ['e4', 0, 'desk'], ['e1', 1, 'bed']] },
  { id: 'f1-racer', name: 'Race Day', collection: 'kids',
    items: [['k2', 0, 'bed'], ['k4', 0, 'wall'], ['k5', 0, 'wall'], ['k6', 0, 'floor']] },
  { id: 'polka-dot', name: 'Polka Dot', collection: 'kids',
    items: [['k1', 1, 'bed'], ['k3', 1, 'bed'], ['k6', 1, 'floor']] },
]

const DEFAULT_PRESET = { dorm: 'y2k-glow', essentials: 'neutral-era', kids: 'f1-racer' }

// 5-question tap-through quiz. w = score weights per collection,
// preset = hint used if that collection wins.
const QUIZ = [
  { q: 'Pick your aesthetic.', options: [
    { label: 'Graphic + glow lighting', w: { dorm: 3 }, preset: 'y2k-glow' },
    { label: 'Clean + neutral', w: { essentials: 3 }, preset: 'neutral-era' },
    { label: 'Cozy café corner', w: { essentials: 3 }, preset: 'coffee-bar' },
    { label: 'Race day energy', w: { kids: 3 }, preset: 'f1-racer' },
  ] },
  { q: 'Color palette check.', options: [
    { label: 'High contrast + brights', w: { dorm: 2 } },
    { label: 'Oat, clay + sage', w: { essentials: 2 } },
    { label: 'Bright primaries', w: { kids: 2 }, preset: 'f1-racer' },
    { label: 'Soft pastels', w: { dorm: 1, kids: 1 }, preset: 'polka-dot' },
  ] },
  { q: 'Whose room are we doing?', options: [
    { label: 'My dorm', w: { dorm: 3 } },
    { label: 'My first apartment', w: { essentials: 3 } },
    { label: "My kid's room", w: { kids: 3 } },
    { label: 'A shared space', w: { essentials: 1, dorm: 1 } },
  ] },
  { q: 'Budget for the refresh?', options: [
    { label: 'Under $150', w: { dorm: 1, kids: 1 } },
    { label: '$150–$300', w: { dorm: 1, essentials: 1 } },
    { label: '$300+', w: { essentials: 2 } },
    { label: 'Whatever the moodboard costs', w: { dorm: 2 }, preset: 'poster-wall' },
  ] },
  { q: 'Saturday morning looks like…', options: [
    { label: 'Sleeping in', w: { dorm: 2 } },
    { label: 'Matcha + records', w: { essentials: 2 }, preset: 'coffee-bar' },
    { label: 'Cartoons + toy cars', w: { kids: 2 } },
    { label: 'Filming my room tour', w: { dorm: 1 } },
  ] },
]

const BUNDLE_MIN = 3
const BUNDLE_PCT = 0.15

const byId = (id) => PRODUCTS.find((p) => p.id === id)
const fmt = (n) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

// Shared by every component file (no build step, so no imports).
window.DATA = { PRODUCTS, COLLECTIONS, PRESETS, DEFAULT_PRESET, QUIZ, BUNDLE_MIN, BUNDLE_PCT, byId, fmt }
