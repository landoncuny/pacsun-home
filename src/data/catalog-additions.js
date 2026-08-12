// ============================================================
// PACSUN HOME — CATALOG ADDITIONS (loaded after catalog.js)
// Additive only: Pantone colour standards per collection, every
// photographed SKU, per-collection route slugs, and the helpers the
// storefront reads. catalog.js itself is untouched — byId() closes over
// the same PRODUCTS array we push into, so it keeps working.
//
// Storefront grids show photographed SKUs only (see gridProducts). The
// unphotographed catalog stays in PRODUCTS so the room builder, presets,
// quiz results and AR view keep resolving every id they reference.
// ============================================================
;(function () {
  const D = window.DATA
  const IMG = './src/assets/'

  // ---------- collection identity ----------
  // Customer-facing name is "Home"; the internal id stays `essentials`
  // because presets, the quiz scorer and saved room links all key off it.
  D.COLLECTIONS.essentials.name = 'Home'
  D.COLLECTIONS.essentials.short = 'Home'
  D.COLLECTIONS.essentials.tagline = 'Washed cotton, warm neutrals, and a table worth setting.'
  D.COLLECTIONS.dorm.tagline = 'Move-in bedding that comes with the matching sleep set.'
  D.COLLECTIONS.kids.tagline = 'Bright prints that survive being jumped on.'

  // Route slugs — the URL hash the collection page lives at.
  D.SLUG_BY_ID = { essentials: 'home', dorm: 'dorm', kids: 'kids' }
  D.ID_BY_SLUG = { home: 'essentials', dorm: 'dorm', kids: 'kids' }
  Object.keys(D.SLUG_BY_ID).forEach((id) => { D.COLLECTIONS[id].slug = D.SLUG_BY_ID[id] })

  // ---------- Pantone standards ----------
  D.COLLECTIONS.dorm.pantone = [
    { name: 'Dorm Pink', code: 'PANTONE 1905 C', hex: '#f2c9d5' },
    { name: 'Bright White', code: 'PANTONE 11-0601 TCX', hex: '#eeeeec' },
    { name: 'Deep Navy', code: 'PANTONE 533 C', hex: '#2a3350' },
    { name: 'Cocoa', code: 'PANTONE 4625 C', hex: '#4a3230' },
  ]
  D.COLLECTIONS.essentials.pantone = [
    { name: 'Oat', code: 'PANTONE 7501 C', hex: '#e3d5bd' },
    { name: 'Mocha', code: 'PANTONE 7526 C', hex: '#6f5a4e' },
    { name: 'Charcoal', code: 'PANTONE 426 C', hex: '#3f4145' },
    { name: 'Cream', code: 'PANTONE 7527 C', hex: '#efe9dc' },
  ]
  D.COLLECTIONS.kids.pantone = [
    { name: 'Butter', code: 'PANTONE 7403 C', hex: '#f2d9a0' },
    { name: 'Palm Green', code: 'PANTONE 5773 C', hex: '#7fa86a' },
    { name: 'Bright White', code: 'PANTONE 11-0601 TCX', hex: '#eeeeec' },
    { name: 'Sky', code: 'PANTONE 545 C', hex: '#a9c4d4' },
  ]

  // ---------- photographed SKUs ----------
  // line = merchandising label shown as the card's corner tag.
  // Listed in grid order; each collection's run leads its storefront page.
  const PHOTOGRAPHED = [
    // ----- HOME -----
    { id: 'e20', name: 'Washed Cotton Duvet Set', collection: 'essentials',
      category: 'bedding', short: 'Duvet', price: 149, zone: 'bed', pattern: null,
      footprint: { w: 5, l: 7 }, dims: { w: 60, d: 80, h: 25 },
      image: IMG + 'home-bedding-oat.png',
      colorways: [{ name: 'Oat', hex: '#ded7c6', image: IMG + 'home-bedding-oat.png' }] },
    { id: 'e21', name: 'Brushed Twill Duvet Set', collection: 'essentials',
      category: 'bedding', short: 'Duvet', price: 149, zone: 'bed', pattern: null,
      footprint: { w: 5, l: 7 }, dims: { w: 60, d: 80, h: 25 },
      image: IMG + 'home-bedding-charcoal.png',
      colorways: [{ name: 'Charcoal', hex: '#3f4145', image: IMG + 'home-bedding-charcoal.png' }] },
    { id: 'e22', name: 'Cabana Stripe Dinnerware Set', collection: 'essentials',
      category: 'kitchen', short: 'Dinnerware', price: 96, zone: 'desk', pattern: null,
      footprint: null, dims: { w: 11, d: 11, h: 10 },
      image: IMG + 'home-dinnerware-stripe.png',
      colorways: [{ name: 'Black & Cream', hex: '#2b2b2b', image: IMG + 'home-dinnerware-stripe.png' }] },
    { id: 'e23', name: 'Cabana Stripe Pillow Set · Set of 4', collection: 'essentials',
      category: 'pillow', short: 'Pillows', price: 78, zone: 'bed', pattern: null,
      footprint: null, dims: { w: 20, d: 6, h: 20 },
      image: IMG + 'home-pillows-stripe.png',
      colorways: [{ name: 'Cream & Mocha', hex: '#6f5a4e', image: IMG + 'home-pillows-stripe.png' }] },

    // ----- DORM (PS Goodnight: bedding merchandised with the matching sleep set) -----
    { id: 'd20', name: 'Pinstripe Bedding & Cami Sleep Set', collection: 'dorm', line: 'PS Goodnight',
      category: 'bedding', short: 'Bedding', price: 139, zone: 'bed', pattern: null,
      footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
      image: IMG + 'dorm-goodnight-pinstripe-white.png',
      colorways: [{ name: 'White & Blush', hex: '#f4d7de', image: IMG + 'dorm-goodnight-pinstripe-white.png' }] },
    { id: 'd21', name: 'Plaid Bedding & Pajama Set', collection: 'dorm', line: 'PS Goodnight',
      category: 'bedding', short: 'Bedding', price: 139, zone: 'bed', pattern: 'checker',
      footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
      image: IMG + 'dorm-goodnight-plaid-blue.png',
      colorways: [{ name: 'Sky Plaid & Navy', hex: '#bcd2e0', image: IMG + 'dorm-goodnight-plaid-blue.png' }] },
    { id: 'd22', name: 'Lace Trim Bedding & Short Set', collection: 'dorm', line: 'PS Goodnight',
      category: 'bedding', short: 'Bedding', price: 139, zone: 'bed', pattern: null,
      footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
      image: IMG + 'dorm-goodnight-lace-blue.png',
      colorways: [{ name: 'Dusty Blue', hex: '#9fbccd', image: IMG + 'dorm-goodnight-lace-blue.png' }] },
    { id: 'd23', name: 'Stripe Bedding & Robe Set', collection: 'dorm', line: 'PS Goodnight',
      category: 'bedding', short: 'Bedding', price: 149, zone: 'bed', pattern: null,
      footprint: { w: 4, l: 7 }, dims: { w: 42, d: 80, h: 24 },
      image: IMG + 'dorm-goodnight-stripe-cocoa.png',
      colorways: [{ name: 'Cocoa Stripe', hex: '#4a3230', image: IMG + 'dorm-goodnight-stripe-cocoa.png' }] },
    { id: 'd24', name: 'Candy Stripe Dinnerware & Tumbler Set', collection: 'dorm',
      category: 'kitchen', short: 'Dinnerware', price: 42, zone: 'desk', pattern: null,
      footprint: null, dims: { w: 11, d: 11, h: 9 },
      image: IMG + 'dorm-dishware-pink-stripe.png',
      colorways: [{ name: 'Dorm Pink', hex: '#ef5a9c', image: IMG + 'dorm-dishware-pink-stripe.png' }] },

    // ----- KIDS -----
    { id: 'k20', name: 'Sunburst Comforter & Sham Set', collection: 'kids',
      category: 'bedding', short: 'Comforter', price: 79, zone: 'bed', pattern: 'stars',
      footprint: { w: 4, l: 6 }, dims: { w: 39, d: 75, h: 22 },
      image: IMG + 'kids-bedding-sun.png',
      colorways: [{ name: 'Butter Sun', hex: '#f2d9a0', image: IMG + 'kids-bedding-sun.png' }] },
    { id: 'k21', name: 'Palm Print Comforter & Sham Set', collection: 'kids',
      category: 'bedding', short: 'Comforter', price: 79, zone: 'bed', pattern: 'dots',
      footprint: { w: 4, l: 6 }, dims: { w: 39, d: 75, h: 22 },
      image: IMG + 'kids-bedding-palm.png',
      colorways: [{ name: 'Palm Green', hex: '#7fa86a', image: IMG + 'kids-bedding-palm.png' }] },
  ]

  // Insert each photographed SKU at the front of its collection's run, keeping
  // the order declared above (walk backwards so the first ends up first).
  PHOTOGRAPHED.slice().reverse().forEach((p) => {
    const at = D.PRODUCTS.findIndex((x) => x.collection === p.collection)
    D.PRODUCTS.splice(at < 0 ? D.PRODUCTS.length : at, 0, p)
  })

  // ---------- room-canvas crops ----------
  // The mockups are whole scenes on white: a made bed, or — for PS Goodnight —
  // a bed with its matching sleep set laid out beside it. The room preview
  // needs the product alone, so each SKU carries the sub-rect to lift out of
  // its image, as fractions of the source: [x0, y0, x1, y1].
  //
  // Bedding crops to the duvet surface only (no frame, no sleep set) so the
  // fabric can be stretched over the bed the room already draws. Everything
  // else crops to the product's own outline and stands on the surface it was
  // dropped on.
  const ROOM_CROP = {
    // duvet surfaces — inset from the mockup's own frame on every side
    e20: [0.423, 0.478, 0.792, 0.665],
    e21: [0.401, 0.454, 0.769, 0.641],
    d20: [0.28, 0.513, 0.649, 0.7],
    d21: [0.267, 0.5, 0.636, 0.686],
    d22: [0.287, 0.497, 0.656, 0.683],
    d23: [0.272, 0.504, 0.641, 0.69],
    k20: [0.387, 0.489, 0.756, 0.675],
    k21: [0.399, 0.445, 0.768, 0.631],
    // props that sit on a surface
    e22: [0.193, 0.114, 0.806, 0.884],
    e23: [0.119, 0.188, 0.881, 0.81],
    d24: [0.074, 0.039, 0.946, 0.922],
  }
  Object.keys(ROOM_CROP).forEach((id) => {
    const p = D.byId(id)
    if (p) p.crop = ROOM_CROP[id]
  })

  // ---------- presets: photographed SKUs only ----------
  // The builder never shows an unphotographed product, so the starter rooms
  // can only place photographed ones. Anything a preset used to drop in that
  // has no photography yet (rugs, lamps, LEDs, posters) is dropped from it;
  // re-add those lines here once the mockups exist.
  const PRESET_ITEMS = {
    'y2k-glow': [['d20', 0, 'bed'], ['d24', 0, 'desk']],
    'poster-wall': [['d21', 0, 'bed'], ['d24', 0, 'desk']],
    'minimal-dorm': [['d23', 0, 'bed']],
    'neutral-era': [['e20', 0, 'bed'], ['e23', 0, 'bed'], ['e22', 0, 'desk']],
    'coffee-bar': [['e21', 0, 'bed'], ['e22', 0, 'desk']],
    'f1-racer': [['k20', 0, 'bed']],
    'polka-dot': [['k21', 0, 'bed']],
  }
  D.PRESETS.forEach((preset) => {
    if (PRESET_ITEMS[preset.id]) preset.items = PRESET_ITEMS[preset.id]
  })

  // ---------- shop structure ----------
  D.CATEGORY_LABEL = {
    bedding: 'Bedding', pillow: 'Pillows & Shams', rug: 'Rugs',
    organizer: 'Storage & Organization', storage: 'Storage & Organization',
    lighting: 'Lighting', 'wall-art': 'Wall Art', wallpaper: 'Wallpaper', kit: 'Complete Kits',
    blanket: 'Throws & Blankets', kitchen: 'Kitchen & Table', decor: 'Decor', audio: 'Audio',
  }

  // Home leads, then Dorm, then Kids. Single source of truth for the shop
  // dropdown, the landing entry points and the collection page order.
  D.DISPLAY_ORDER = ['essentials', 'dorm', 'kids']
  D.collectionList = () => D.DISPLAY_ORDER.map((id) => D.COLLECTIONS[id]).filter(Boolean)

  // Storefront grids: photographed SKUs only.
  D.gridProducts = (cid) => D.PRODUCTS.filter((p) => p.collection === cid && p.image)

  // Category chips / dropdown links, deduped by merchandising LABEL.
  D.categoriesFor = (cid) => {
    const seen = []
    D.gridProducts(cid).forEach((p) => {
      const label = D.CATEGORY_LABEL[p.category] || p.category
      if (!seen.some((s) => s.label === label)) seen.push({ label, category: p.category })
    })
    return seen
  }

  D.shopMenu = () =>
    D.collectionList().map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.name,
      swatch: c.pantone[0].hex,
      count: D.gridProducts(c.id).length,
      items: [{ label: 'Shop all ' + c.short, strong: true, category: null }].concat(
        D.categoriesFor(c.id).map((x) => ({ label: x.label, category: x.category }))
      ),
    }))
})()
