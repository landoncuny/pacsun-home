// ============================================================
// PACSUN HOME — CATALOG ADDITIONS (loaded after catalog.js)
// Additive only: Pantone colour standards per collection, the four
// bedding mockups as real SKUs, and preset swaps so starter rooms use
// the photographed bedding. catalog.js itself is untouched — byId()
// closes over the same PRODUCTS array we push into, so it keeps working.
// ============================================================
;(function () {
  const D = window.DATA
  const IMG = './src/assets/'

  // ---------- Pantone standards ----------
  D.COLLECTIONS.dorm.pantone = [
    { name: 'Dorm Pink', code: 'PANTONE 1905 C', hex: '#f2c9d5' },
    { name: 'Bright White', code: 'PANTONE 11-0601 TCX', hex: '#eeeeec' },
    { name: 'Deep Navy', code: 'PANTONE 533 C', hex: '#1f2a44' },
    { name: 'Court Lime', code: 'PANTONE 381 C', hex: '#c9d96a' },
  ]
  D.COLLECTIONS.essentials.pantone = [
    { name: 'Oat', code: 'PANTONE 7501 C', hex: '#e3d5bd' },
    { name: 'Clay', code: 'PANTONE 7515 C', hex: '#c67d54' },
    { name: 'Sage', code: 'PANTONE 5645 C', hex: '#adb99a' },
    { name: 'Mocha', code: 'PANTONE 7526 C', hex: '#b08968' },
  ]
  D.COLLECTIONS.kids.pantone = [
    { name: 'Sky', code: 'PANTONE 545 C', hex: '#a9c4d4' },
    { name: 'Butter', code: 'PANTONE 7404 C', hex: '#f0de55' },
    { name: 'Blush', code: 'PANTONE 1767 C', hex: '#fcafc0' },
    { name: 'Burgundy Check', code: 'PANTONE 4975 C', hex: '#5c3237' },
  ]

  // ---------- photographed bedding ----------
  // line = merchandising label shown as the card's corner tag.
  const BEDDING = [
    { id: 'd10', name: 'Heart Jacquard Comforter & Sham Set', collection: 'dorm', line: "Women's",
      category: 'bedding', short: 'Comforter', price: 119, zone: 'bed', pattern: 'stars',
      footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
      image: IMG + 'bedding-pink-heart.png',
      colorways: [
        { name: 'Blush Pink', hex: '#f2c9d5', image: IMG + 'bedding-pink-heart.png' },
        { name: 'Bright White', hex: '#eeeeec', image: IMG + 'bedding-white-heart.png' },
      ] },
    { id: 'd11', name: 'Heart Stripe Comforter & Sham Set', collection: 'dorm', line: "Women's",
      category: 'bedding', short: 'Comforter', price: 119, zone: 'bed', pattern: 'stars',
      footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
      image: IMG + 'bedding-white-heart.png',
      colorways: [
        { name: 'Bright White', hex: '#eeeeec', image: IMG + 'bedding-white-heart.png' },
        { name: 'Blush Pink', hex: '#f2c9d5', image: IMG + 'bedding-pink-heart.png' },
      ] },
    { id: 'd12', name: 'Piped Sateen Comforter & Sham Set', collection: 'dorm', line: "Men's",
      category: 'bedding', short: 'Comforter', price: 129, zone: 'bed', pattern: null,
      footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
      image: IMG + 'bedding-navy.png',
      colorways: [{ name: 'Deep Navy', hex: '#1f2a44', image: IMG + 'bedding-navy.png' }] },
    { id: 'k10', name: 'Gingham Check Comforter & Sham Set', collection: 'kids',
      category: 'bedding', short: 'Comforter', price: 89, zone: 'bed', pattern: 'checker',
      footprint: { w: 4, l: 6 }, dims: { w: 39, d: 75, h: 22 },
      image: IMG + 'bedding-plaid-blue.png',
      colorways: [{ name: 'Blue & Burgundy Check', hex: '#5c3237', image: IMG + 'bedding-plaid-blue.png' }] },
  ]

  // Insert each bedding SKU at the front of its collection's run so the
  // photographed pieces lead the grid.
  BEDDING.slice().reverse().forEach((p) => {
    const at = D.PRODUCTS.findIndex((x) => x.collection === p.collection)
    D.PRODUCTS.splice(at < 0 ? D.PRODUCTS.length : at, 0, p)
  })

  // ---------- presets lead with the photographed bedding ----------
  const swapBed = (presetId, pid) => {
    const preset = D.PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    const bed = preset.items.find((it) => it[2] === 'bed')
    if (bed) bed[0] = pid
    else preset.items.unshift([pid, 0, 'bed'])
  }
  swapBed('y2k-glow', 'd10')
  swapBed('minimal-dorm', 'd12')
  swapBed('f1-racer', 'k10')

  // ---------- Shop dropdown structure ----------
  D.CATEGORY_LABEL = {
    bedding: 'Bedding', rug: 'Rugs', organizer: 'Storage & Organization', storage: 'Storage & Organization',
    lighting: 'Lighting', 'wall-art': 'Wall Art', wallpaper: 'Wallpaper', kit: 'Complete Kits',
    blanket: 'Throws & Blankets', kitchen: 'Kitchen', decor: 'Decor', audio: 'Audio',
  }
  // ---------- customer-facing order ----------
  // Home Essentials leads, then Dorm, then Kids. Single source of truth for
  // the shop dropdown, the collection cards and the scroll order of the bands.
  D.DISPLAY_ORDER = ['essentials', 'dorm', 'kids']
  D.collectionList = () => D.DISPLAY_ORDER.map((id) => D.COLLECTIONS[id]).filter(Boolean)

  D.shopMenu = () =>
    D.collectionList().map((c) => {
      // Dedupe by LABEL — several categories share one merchandising label.
      const labels = []
      D.PRODUCTS.forEach((p) => {
        if (p.collection !== c.id) return
        const label = D.CATEGORY_LABEL[p.category] || p.category
        if (!labels.includes(label)) labels.push(label)
      })
      return {
        id: c.id,
        title: c.name,
        swatch: c.pantone[0].hex,
        items: [{ label: 'Shop all ' + c.short, strong: true }].concat(labels.map((label) => ({ label }))),
      }
    })
})()
