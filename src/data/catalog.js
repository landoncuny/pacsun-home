// ============================================================
// PACSUN HOME — EDITABLE CATALOG
// Edit the PRODUCTS array below to change the whole site:
// tray, shop grid, presets, quiz results and cart all read from it.
// footprint = real-world size in feet (used by AI Fit Check).
// dims = real-world W × D × H in INCHES (used by "View in Your Room" AR).
// pattern: 'stars' | 'checker' | 'dots' | null  (room-canvas texture)
// zone: default snap zone — 'bed' | 'floor' | 'desk' | 'wall' | 'window'
// ============================================================

const PRODUCTS = [
  // ---------- DORM / COLLEGE (16–24) ----------
  { id: 'd1', name: 'Y2K Star Bedding Set', collection: 'dorm', category: 'bedding', price: 89, zone: 'bed', thumb: '🛏️', pattern: 'stars', footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
    colorways: [ { name: 'Pink Pop', hex: '#ff8fd6' }, { name: 'Acid Lime', hex: '#d4ff3f' }, { name: 'Blackout', hex: '#2b2b31' } ] },
  { id: 'd2', name: 'Checker Shag Rug', collection: 'dorm', category: 'rug', price: 59, zone: 'floor', thumb: '🏁', pattern: 'checker', footprint: { w: 5, l: 7 }, dims: { w: 60, d: 84, h: 2 },
    colorways: [ { name: 'B&W', hex: '#f2f2f2' }, { name: 'Lime', hex: '#d4ff3f' }, { name: 'Lilac', hex: '#cbb2ff' } ] },
  { id: 'd3', name: 'Acrylic Stack Organizer', collection: 'dorm', category: 'organizer', price: 34, zone: 'desk', thumb: '🗃️', pattern: null, footprint: null, dims: { w: 9, d: 7, h: 11 },
    colorways: [ { name: 'Crystal', hex: '#dff0ff' }, { name: 'Pink Haze', hex: '#ffd1ef' } ] },
  { id: 'd4', name: 'Chrome Heart Jewelry Box', collection: 'dorm', category: 'jewelry', price: 28, zone: 'desk', thumb: '💍', pattern: null, footprint: null, dims: { w: 8, d: 6, h: 5 },
    colorways: [ { name: 'Chrome', hex: '#d9dee6' }, { name: 'Bubblegum', hex: '#ffb3e2' } ] },
  { id: 'd5', name: 'LED Glow Strip · 16ft', collection: 'dorm', category: 'led', price: 24, zone: 'wall', thumb: '🌈', pattern: null, footprint: null, dims: { w: 7, d: 7, h: 2 },
    colorways: [ { name: 'Hot Pink', hex: '#ff4fd8' }, { name: 'Ice Blue', hex: '#6ee7ff' }, { name: 'Acid Lime', hex: '#d4ff3f' } ] },
  { id: 'd6', name: 'Poster Pack · 6 Prints', collection: 'dorm', category: 'wall-art', price: 22, zone: 'wall', thumb: '🖼️', pattern: null, footprint: null, dims: { w: 18, d: 1, h: 24 },
    colorways: [ { name: 'Y2K Mix', hex: '#ff8fd6' }, { name: 'Chrome Blue', hex: '#9cc4ff' }, { name: 'Mono', hex: '#e8e8e8' } ] },
  { id: 'd7', name: 'Dorm Room Kit — Moodboard in a Box', collection: 'dorm', category: 'bundle', price: 199, zone: 'floor', thumb: '📦', pattern: null, footprint: { w: 2, l: 2 }, dims: { w: 24, d: 24, h: 24 },
    colorways: [ { name: 'Glow Kit', hex: '#ff8fd6' }, { name: 'Minimal Kit', hex: '#e6e2d8' } ] },

  // ---------- HOME ESSENTIALS (22–30, flagship) ----------
  { id: 'e1', name: 'Washed Sateen Bedding', collection: 'essentials', category: 'bedding', price: 129, zone: 'bed', thumb: '🛏️', pattern: null, footprint: { w: 5, l: 7 }, dims: { w: 60, d: 80, h: 25 },
    colorways: [ { name: 'Oat', hex: '#e3d5bd' }, { name: 'Clay', hex: '#c67d54' }, { name: 'Sage', hex: '#adb99a' } ] },
  { id: 'e2', name: 'Matcha Ritual Set', collection: 'essentials', category: 'kitchen', price: 68, zone: 'desk', thumb: '🍵', pattern: null, footprint: null, dims: { w: 12, d: 8, h: 6 },
    colorways: [ { name: 'Matcha', hex: '#b7c9a1' }, { name: 'Cream', hex: '#efe6d6' } ] },
  { id: 'e3', name: 'Arc Bookends · Pair', collection: 'essentials', category: 'decor', price: 42, zone: 'desk', thumb: '📚', pattern: null, footprint: null, dims: { w: 12, d: 5, h: 7 },
    colorways: [ { name: 'Travertine', hex: '#ddd0bd' }, { name: 'Charcoal', hex: '#5a5a5a' } ] },
  { id: 'e4', name: 'Suitcase Record Player', collection: 'essentials', category: 'audio', price: 149, zone: 'desk', thumb: '📀', pattern: null, footprint: null, dims: { w: 14, d: 10, h: 5 },
    colorways: [ { name: 'Cream', hex: '#efe6d6' }, { name: 'Cocoa', hex: '#8a6247' } ] },
  { id: 'e5', name: 'Cloud Plush Blanket', collection: 'essentials', category: 'blanket', price: 79, zone: 'bed', thumb: '☁️', pattern: null, footprint: null, dims: { w: 20, d: 14, h: 8 },
    colorways: [ { name: 'Ivory', hex: '#f3ede2' }, { name: 'Mocha', hex: '#b08968' }, { name: 'Stone', hex: '#b9b6ae' } ] },
  { id: 'e6', name: 'Stoneware Plates + Bowls', collection: 'essentials', category: 'kitchen', price: 96, zone: 'desk', thumb: '🍽️', pattern: null, footprint: null, dims: { w: 11, d: 11, h: 10 },
    colorways: [ { name: 'Sand', hex: '#dcCFb8' }, { name: 'Off-White', hex: '#f1ece1' } ] },
  { id: 'e7', name: 'Ribbed Glass Cups · Set of 4', collection: 'essentials', category: 'kitchen', price: 32, zone: 'desk', thumb: '🥛', pattern: null, footprint: null, dims: { w: 12, d: 4, h: 5 },
    colorways: [ { name: 'Clear', hex: '#dcedf5' }, { name: 'Amber', hex: '#e0a951' } ] },
  { id: 'e8', name: 'Mushroom Glow Lamp', collection: 'essentials', category: 'lighting', price: 54, zone: 'desk', thumb: '🍄', pattern: null, footprint: null, dims: { w: 8, d: 8, h: 14 },
    colorways: [ { name: 'Butter', hex: '#ffdf8e' }, { name: 'Cream', hex: '#efe6d6' } ] },
  { id: 'e9', name: 'Monstera + Stone Pot', collection: 'essentials', category: 'decor', price: 46, zone: 'floor', thumb: '🪴', pattern: null, footprint: { w: 1, l: 1 }, dims: { w: 14, d: 14, h: 30 },
    colorways: [ { name: 'Stone', hex: '#cfc8bb' }, { name: 'Terracotta', hex: '#c67d54' } ] },

  // ---------- KIDS (4–12) ----------
  { id: 'k1', name: 'Polka Dot Bedding', collection: 'kids', category: 'bedding', price: 69, zone: 'bed', thumb: '🛏️', pattern: 'dots', footprint: { w: 4, l: 6 }, dims: { w: 39, d: 75, h: 22 },
    colorways: [ { name: 'Butter', hex: '#ffe9a8' }, { name: 'Sky', hex: '#bfe3ff' }, { name: 'Blush', hex: '#ffd3dd' } ] },
  { id: 'k2', name: 'Grand Prix Checkered Bedding', collection: 'kids', category: 'bedding', price: 74, zone: 'bed', thumb: '🏎️', pattern: 'checker', footprint: { w: 4, l: 6 }, dims: { w: 39, d: 75, h: 22 },
    colorways: [ { name: 'Race Red', hex: '#ff4d4d' }, { name: 'Pit Blue', hex: '#5e86ff' } ] },
  { id: 'k3', name: 'Bunk Bed Textile Set', collection: 'kids', category: 'blanket', price: 89, zone: 'bed', thumb: '🪜', pattern: null, footprint: null, dims: { w: 20, d: 14, h: 10 },
    colorways: [ { name: 'Cherry', hex: '#ff5a5a' }, { name: 'Navy', hex: '#4a5c85' } ] },
  { id: 'k4', name: 'Race Car Wall Art · Set of 3', collection: 'kids', category: 'wall-art', price: 36, zone: 'wall', thumb: '🏎️', pattern: null, footprint: null, dims: { w: 12, d: 1, h: 12 },
    colorways: [ { name: 'Red Team', hex: '#ff6b6b' }, { name: 'Blue Team', hex: '#7ea2ff' } ] },
  { id: 'k5', name: 'Checkered Flag Wallpaper', collection: 'kids', category: 'wallpaper', price: 48, zone: 'wall', thumb: '🏁', pattern: 'checker', footprint: null, dims: { w: 4, d: 4, h: 21 },
    colorways: [ { name: 'Classic B&W', hex: '#ffffff' }, { name: 'Sky Blue', hex: '#bfe3ff' } ] },
  { id: 'k6', name: 'Pit Stop Play Rug', collection: 'kids', category: 'rug', price: 44, zone: 'floor', thumb: '🛣️', pattern: 'checker', footprint: { w: 4, l: 6 }, dims: { w: 48, d: 72, h: 1 },
    colorways: [ { name: 'Asphalt', hex: '#8a8a8a' }, { name: 'Grass Green', hex: '#8fce7e' } ] },
]

const COLLECTIONS = {
  dorm: {
    id: 'dorm', name: 'Dorm / College', short: 'Dorm', ages: '16–24',
    tagline: 'Y2K energy for your 12×14.',
    vibe: ['Y2K', 'graphic', 'LED glow', 'streetwear prints'],
    accent: '#d4ff3f', accent2: '#ff4fd8', onAccent: '#101014',
  },
  essentials: {
    id: 'essentials', name: 'Home Essentials', short: 'Essentials', ages: '22–30', flagship: true,
    tagline: 'Elevated basics. Neutral era.',
    vibe: ['minimal', 'warm neutrals', 'matcha core', 'plush'],
    accent: '#d9b98c', accent2: '#8a6247', onAccent: '#1c150e',
  },
  kids: {
    id: 'kids', name: 'Kids', short: 'Kids', ages: '4–12',
    tagline: 'Playful rooms, big imaginations.',
    vibe: ['polka dots', 'F1 checkers', 'bright primaries'],
    accent: '#ff4d4d', accent2: '#5e86ff', onAccent: '#ffffff',
  },
}

// Room presets — one-tap starter rooms. items: [productId, colorwayIndex, zone]
const PRESETS = [
  { id: 'y2k-glow', name: 'Y2K Glow', emoji: '✨', collection: 'dorm',
    items: [['d1', 0, 'bed'], ['d5', 0, 'wall'], ['d2', 2, 'floor'], ['d4', 0, 'desk']] },
  { id: 'poster-wall', name: 'Poster Wall', emoji: '🖼️', collection: 'dorm',
    items: [['d6', 0, 'wall'], ['d1', 2, 'bed'], ['d3', 0, 'desk'], ['d2', 0, 'floor']] },
  { id: 'minimal-dorm', name: 'Minimal Dorm', emoji: '🩶', collection: 'dorm',
    items: [['d1', 2, 'bed'], ['d2', 0, 'floor'], ['d3', 0, 'desk']] },
  { id: 'neutral-era', name: 'Neutral Era', emoji: '🤍', collection: 'essentials',
    items: [['e1', 0, 'bed'], ['e5', 0, 'bed'], ['e8', 0, 'desk'], ['e3', 0, 'desk']] },
  { id: 'coffee-bar', name: 'Coffee Bar Corner', emoji: '🍵', collection: 'essentials',
    items: [['e2', 0, 'desk'], ['e7', 0, 'desk'], ['e6', 1, 'desk'], ['e4', 0, 'desk'], ['e1', 1, 'bed']] },
  { id: 'f1-racer', name: 'F1 Racer', emoji: '🏁', collection: 'kids',
    items: [['k2', 0, 'bed'], ['k4', 0, 'wall'], ['k5', 0, 'wall'], ['k6', 0, 'floor']] },
  { id: 'polka-dot', name: 'Polka Dot', emoji: '🔵', collection: 'kids',
    items: [['k1', 1, 'bed'], ['k3', 1, 'bed'], ['k6', 1, 'floor']] },
]

const DEFAULT_PRESET = { dorm: 'y2k-glow', essentials: 'neutral-era', kids: 'f1-racer' }

// 5-question tap-through quiz. w = score weights per collection,
// preset = hint used if that collection wins.
const QUIZ = [
  { q: 'Pick your aesthetic.', options: [
    { label: 'Y2K chrome + glow', emoji: '✨', w: { dorm: 3 }, preset: 'y2k-glow' },
    { label: 'Clean + neutral', emoji: '🤍', w: { essentials: 3 }, preset: 'neutral-era' },
    { label: 'Cozy café core', emoji: '🍵', w: { essentials: 3 }, preset: 'coffee-bar' },
    { label: 'Race day energy', emoji: '🏁', w: { kids: 3 }, preset: 'f1-racer' },
  ] },
  { q: 'Color palette check.', options: [
    { label: 'Neon on black', emoji: '🟢', w: { dorm: 2 } },
    { label: 'Oat, clay + sage', emoji: '🪵', w: { essentials: 2 } },
    { label: 'Bright primaries', emoji: '🔴', w: { kids: 2 }, preset: 'f1-racer' },
    { label: 'Pastel pop', emoji: '🩷', w: { dorm: 1, kids: 1 }, preset: 'polka-dot' },
  ] },
  { q: 'Whose room are we doing?', options: [
    { label: 'My dorm', emoji: '🎓', w: { dorm: 3 } },
    { label: 'My first apartment', emoji: '🔑', w: { essentials: 3 } },
    { label: "My kid's room", emoji: '🧒', w: { kids: 3 } },
    { label: 'A shared space', emoji: '🛋️', w: { essentials: 1, dorm: 1 } },
  ] },
  { q: 'Budget for the refresh?', options: [
    { label: 'Under $150', emoji: '💸', w: { dorm: 1, kids: 1 } },
    { label: '$150–$300', emoji: '💳', w: { dorm: 1, essentials: 1 } },
    { label: '$300+', emoji: '🤑', w: { essentials: 2 } },
    { label: 'Whatever the moodboard costs', emoji: '📌', w: { dorm: 2 }, preset: 'poster-wall' },
  ] },
  { q: 'Saturday morning looks like…', options: [
    { label: 'Sleeping til noon', emoji: '😴', w: { dorm: 2 } },
    { label: 'Matcha + records', emoji: '📀', w: { essentials: 2 }, preset: 'coffee-bar' },
    { label: 'Cartoons + toy cars', emoji: '🏎️', w: { kids: 2 } },
    { label: 'Posting my room tour', emoji: '📱', w: { dorm: 1 } },
  ] },
]

const BUNDLE_MIN = 3
const BUNDLE_PCT = 0.15

const byId = (id) => PRODUCTS.find((p) => p.id === id)
const fmt = (n) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`)

// Shared by every component file (no build step, so no imports).
window.DATA = { PRODUCTS, COLLECTIONS, PRESETS, DEFAULT_PRESET, QUIZ, BUNDLE_MIN, BUNDLE_PCT, byId, fmt }
