# PacSun Home — "Wear Your Room"

Mobile-first, single-page marketing + shopping concept site for a PacSun home collection.
React with **no build step**: React 18 + Babel Standalone load from CDN and the JSX compiles
in the browser, so it runs on any static file server (this machine has no Node/npm).

**Design system** is modeled on pacsun.com: Poppins, near-black `#111` on white, monochrome
chrome, squared zero-radius buttons, black promo utility bar, small uppercase labels. Product
line structure is inspired by Hollister's Dorm & Home assortment (naming/categories only).
All product imagery is intentionally a grey **placeholder tile** (category label + colorway
strip) to be swapped for real mockups later — no emoji, no invented product lines.

## Run it

```sh
python3 -m http.server 5173 --directory .
# open http://localhost:5173
```

(Any static server works. There is also a `pacsun-home` entry in `../.claude/launch.json`.)

## Structure

```
index.html                  script load order (data → components → app)
src/styles.css              all styling (PacSun-modeled design system)
src/data/catalog.js         ★ EDITABLE catalog: products, collections, presets, quiz, bundle rules
src/components/
  view-in-room.jsx          ★ "View in Your Room" AR: camera feed + to-scale perspective
                            dimension box, tap/drag/pinch, snapshot, sample-room fallback
  nav.jsx                   sticky nav + section pills + cart badge
  hero.jsx                  "Wear your room." hero + campaign-image placeholder
  collections.jsx           3 audience cards + filtered product grid + Bundle & Save banner
  room-builder.jsx          ★ core: isometric SVG room, drag/drop snap zones, colorway
                            bottom sheet, AI Fit Check (dimension math), share links, presets
  quiz.jsx                  5-question tap-through quiz → collection + starter room
  campaign.jsx              pop-up / shop-the-look carousel / TikTok drops + footer
  cart.jsx                  cart drawer; 3+ items from one collection = 15% off
src/app.jsx                 state owner: active collection, cart, preset requests, share-hash parsing
```

Since there are no ES module imports (Babel Standalone runs each file as a classic script),
every component file exports by assigning to `window`, and shared data lives on `window.DATA`.

## Notes

- **State is React-memory only** — no localStorage/sessionStorage. "Share My Room" encodes
  the room config (collection, dimensions, items+colorways+zones) as base64url JSON in the
  URL hash, so the link itself reopens the exact room.
- "AI Fit Check" is mock AI: pure footprint math (item fits if it clears the room's W×L;
  warns past 55% floor coverage) plus a canvas scale factor.
- Product tiles are deliberate placeholders (`.ph-tile`) — grey block, category label,
  selected-colorway strip. Swap in real product mockups by replacing `ProductThumb`
  in `src/components/collections.jsx`.

## "View in Your Room" (AR)

Entry points: "View in Your Room" on every product card, and inside the room-builder item sheet.
It requests the camera (`getUserMedia`, environment-facing), explains the privacy model first,
and falls back to a rendered sample room if permission is denied or no camera exists.

The product renders as an Amazon-style **dimension box at true scale**: a pinhole-camera
projection (assumed ~55° vertical FOV) of the product's real `dims` (W×D×H inches from the
catalog), with edge labels, footprint, tap-to-place, drag-to-move, pinch/scroll for distance,
a rotation control, colorway swap, add-to-cart, and a snapshot button that composites the
camera frame + overlay to a downloadable PNG.

**Caveats / production path:**
- `getUserMedia` needs a secure context. `localhost` is fine; to test from a phone you need
  HTTPS (e.g. a tunnel like `ngrok`/`cloudflared`, or deploy to any HTTPS host).
- Scale is honest but calibration is manual (the distance control) — the web can't measure
  your room without WebXR. For true Amazon-grade AR (plane detection, walk-around), each SKU
  needs a GLB + USDZ model; then `<model-viewer>` gives Scene Viewer on Android and AR Quick
  Look on iOS with ~10 lines of markup. The catalog already carries `dims` per product, so
  swapping this overlay for model-viewer later is additive.
