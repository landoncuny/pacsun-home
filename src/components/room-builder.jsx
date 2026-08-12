const { useState, useEffect, useMemo, useRef, useCallback } = React

// ---------------------------------------------------------------
// Snap zones — hit boxes + chip anchors, in % of the canvas.
// ---------------------------------------------------------------
const ZONES = ['bed', 'floor', 'desk', 'wall', 'window']
// cx/cy anchor the plain chips. A photographed product instead stands on the
// surface: px/py is the point its base rests on and pw is its width, both in
// % of the canvas, traced off the room drawing below.
const ZONE_META = {
  bed: { label: 'Bed', box: { x: 4, y: 40, w: 46, h: 40 }, cx: 32, cy: 58, px: 31, py: 60, pw: 21, surface: true },
  floor: { label: 'Floor', box: { x: 38, y: 60, w: 40, h: 36 }, cx: 56, cy: 74, px: 59, py: 78, pw: 23, surface: true },
  desk: { label: 'Desk', box: { x: 62, y: 36, w: 34, h: 24 }, cx: 77, cy: 47, px: 77, py: 52, pw: 17, surface: true },
  wall: { label: 'Bed wall', box: { x: 4, y: 2, w: 44, h: 36 }, cx: 24, cy: 16, px: 24, py: 16, pw: 18 },
  window: { label: 'Window', box: { x: 56, y: 4, w: 40, h: 30 }, cx: 79, cy: 20, px: 79, py: 20, pw: 16 },
}

const CHIP_OFFSETS = [
  [0, 0], [9, -4], [-8, 5], [7, 7], [-9, -6], [14, 2],
]

// Every product mockup is shot on the same 792×612 white plate.
const MOCKUP_W = 792
const MOCKUP_H = 612

let uidSeq = 1
const nextUid = () => 'u' + uidSeq++

function visualFor(it) {
  const p = window.DATA.byId(it.pid)
  if (!p) return 'chip'
  if (p.category === 'bedding' && it.z === 'bed') return 'duvet'
  if (p.category === 'blanket' && it.z === 'bed') return 'throw'
  if (p.category === 'rug' && it.z === 'floor') return 'rug'
  if (p.category === 'wall-art' && it.z === 'wall') return 'posters'
  if (p.category === 'wallpaper' && (it.z === 'wall' || it.z === 'window')) return 'wallpaper'
  if (p.category === 'led' && (it.z === 'wall' || it.z === 'window')) return 'led'
  return 'chip'
}

// ---------------------------------------------------------------
// The isometric room drawing. Special categories paint the room
// itself (duvet, rug, posters, wallpaper, LED); the rest render
// as HTML chips on top.
// ---------------------------------------------------------------
function RoomSVG({ placed, scale, flags, onTapItem }) {
  const { byId } = window.DATA
  const groups = useMemo(() => {
    const g = { duvet: [], throw: [], rug: [], posters: [], wallpaper: [], led: [] }
    placed.forEach((it) => {
      const v = visualFor(it)
      if (g[v]) g[v].push(it)
    })
    return g
  }, [placed])

  const colorOf = (it) => {
    const p = byId(it.pid)
    return p.colorways[it.c]?.hex || '#ddd'
  }
  const patternOf = (it) => byId(it.pid).pattern
  // Photography wins over the flat swatch, but only when the SKU also declares
  // which part of its mockup to lift out — see ROOM_CROP in catalog-additions.
  const imageOf = (it) => {
    const p = byId(it.pid)
    return p.colorways[it.c]?.image || p.image
  }
  const cropOf = (it) => {
    const p = byId(it.pid)
    return p.crop && imageOf(it) ? p.crop : null
  }

  const patDefs = []
  const withPattern = (it, shapeProps, keySuffix = '') => {
    const pat = patternOf(it)
    const flagged = flags[it.uid]
    const els = [
      <polygon
        key={it.uid + keySuffix}
        {...shapeProps}
        fill={colorOf(it)}
        className={'tappable' + (flagged ? ' svg-flagged' : '')}
        onClick={() => onTapItem(it.uid)}
      />,
    ]
    if (pat) {
      els.push(
        <polygon
          key={it.uid + keySuffix + '-pat'}
          {...shapeProps}
          fill={`url(#pat-${pat}-${it.uid}${keySuffix})`}
          pointerEvents="none"
        />
      )
      patDefs.push({ id: `pat-${pat}-${it.uid}${keySuffix}`, type: pat })
    }
    return els
  }

  // Layered stacking: later placements sit on top with a small shift.
  const duvets = groups.duvet.map((it, i) => {
    const dy = -i * 10
    const pts = `150,${332 + dy} 330,${240 + dy} 468,${306 + dy} 288,${398 + dy}`
    const shape = { points: pts, stroke: '#17171a', strokeWidth: 3, strokeLinejoin: 'round' }
    const crop = cropOf(it)
    if (!crop) return withPattern(it, shape)

    // The four polygon points are the unit square's corners in order, so this
    // matrix drops the cropped fabric onto the mattress at the room's angle:
    // (0,0)→150,332  (1,0)→330,240  (1,1)→468,306  (0,1)→288,398.
    const [x0, y0, x1, y1] = crop
    const w = x1 - x0
    const h = y1 - y0
    return (
      <g key={it.uid}>
        <clipPath id={'duvet-' + it.uid}>
          <polygon points={pts} />
        </clipPath>
        {/* The clip has to sit on an untransformed wrapper: a clip-path is
            resolved in the coordinate system the element's own transform
            establishes, so pairing them on one <g> would clip in fabric
            space and drop the image entirely. */}
        <g clipPath={`url(#duvet-${it.uid})`}>
          <g transform={`matrix(180 -92 138 66 150 ${332 + dy})`}>
            <image
              href={imageOf(it)}
              x={-x0 / w}
              y={-y0 / h}
              width={1 / w}
              height={1 / h}
              preserveAspectRatio="none"
            />
          </g>
        </g>
        <polygon
          {...shape}
          fill="none"
          className={'tappable' + (flags[it.uid] ? ' svg-flagged' : '')}
          onClick={() => onTapItem(it.uid)}
        />
      </g>
    )
  })

  const throws_ = groups.throw.map((it, i) => {
    const d = i * 12
    return (
      <polygon
        key={it.uid}
        points={`${262 - d},${384 - d * 0.5} ${442 - d},${292 - d * 0.5} ${468 - d},${306 - d * 0.5} ${288 - d},${398 - d * 0.5}`}
        fill={colorOf(it)}
        stroke="#17171a"
        strokeWidth="2.5"
        className={'tappable' + (flags[it.uid] ? ' svg-flagged' : '')}
        onClick={() => onTapItem(it.uid)}
      />
    )
  })

  const rugs = groups.rug.map((it, i) => {
    const d = i * 14
    return withPattern(it, {
      points: `${470 + d},${478 - d} ${340 + d},${413 - d} ${470 + d},${348 - d} ${600 + d},${413 - d}`,
      stroke: '#17171a', strokeWidth: 3, strokeLinejoin: 'round', opacity: 0.96,
    })
  })

  // Posters on the left (bed) wall — parallelograms following the wall slope.
  const posterSlots = [
    [118, 150], [196, 112], [274, 74],
  ]
  const posters = groups.posters.map((it, gi) =>
    posterSlots.map(([x, y0], i) => {
      const y = y0 + gi * 16
      return (
        <polygon
          key={it.uid + '-' + i}
          points={`${x},${y} ${x + 58},${y - 29} ${x + 58},${y + 41} ${x},${y + 70}`}
          fill={colorOf(it)}
          stroke="#17171a"
          strokeWidth="3"
          className={'tappable' + (flags[it.uid] ? ' svg-flagged' : '')}
          onClick={() => onTapItem(it.uid)}
        />
      )
    })
  )

  // Wallpaper tints both walls; last one placed wins.
  const wp = groups.wallpaper[groups.wallpaper.length - 1]
  const wallpaper = wp && (
    <g className="tappable" onClick={() => onTapItem(wp.uid)}>
      <polygon points="70,375 400,210 400,15 70,180" fill={colorOf(wp)} opacity="0.45" />
      <polygon points="400,210 730,375 730,180 400,15" fill={colorOf(wp)} opacity="0.35" />
      {patternOf(wp) && (
        <>
          <polygon points="70,375 400,210 400,15 70,180" fill={`url(#pat-${patternOf(wp)}-${wp.uid})`} opacity="0.5" pointerEvents="none" />
          <polygon points="400,210 730,375 730,180 400,15" fill={`url(#pat-${patternOf(wp)}-${wp.uid})`} opacity="0.4" pointerEvents="none" />
        </>
      )}
    </g>
  )
  if (wp && patternOf(wp)) patDefs.push({ id: `pat-${patternOf(wp)}-${wp.uid}`, type: patternOf(wp) })

  const leds = groups.led.map((it, i) => (
    <g key={it.uid} className="tappable" onClick={() => onTapItem(it.uid)}>
      <polyline
        points={`70,${180 - i * 8} 400,${15 - i * 8} 730,${180 - i * 8}`}
        fill="none" stroke={colorOf(it)} strokeWidth="10" strokeLinecap="round" opacity="0.35" filter="url(#glow)"
      />
      <polyline
        points={`70,${180 - i * 8} 400,${15 - i * 8} 730,${180 - i * 8}`}
        fill="none" stroke={colorOf(it)} strokeWidth="3.5" strokeLinecap="round"
      />
    </g>
  ))

  return (
    <svg viewBox="0 0 800 560" className="room-svg" role="img" aria-label="Your room preview">
      <defs>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <linearGradient id="windowSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe3ff" />
          <stop offset="1" stopColor="#ffe9c4" />
        </linearGradient>
        {patDefs.map((pd) =>
          pd.type === 'checker' ? (
            <pattern key={pd.id} id={pd.id} width="34" height="34" patternUnits="userSpaceOnUse">
              <rect width="17" height="17" fill="#17171a" opacity="0.55" />
              <rect x="17" y="17" width="17" height="17" fill="#17171a" opacity="0.55" />
            </pattern>
          ) : pd.type === 'dots' ? (
            <pattern key={pd.id} id={pd.id} width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="5" fill="#ffffff" opacity="0.85" />
            </pattern>
          ) : (
            <pattern key={pd.id} id={pd.id} width="46" height="46" patternUnits="userSpaceOnUse">
              <text x="6" y="26" fontSize="20" fill="#ffffff" opacity="0.8">✦</text>
            </pattern>
          )
        )}
      </defs>

      <g transform={`translate(400 300) scale(${scale}) translate(-400 -300)`}>
        {/* room shell */}
        <polygon points="400,540 70,375 400,210 730,375" fill="#e0d6c6" stroke="#17171a" strokeWidth="4" strokeLinejoin="round" />
        <polygon points="70,375 400,210 400,15 70,180" fill="#f2ede3" stroke="#17171a" strokeWidth="4" strokeLinejoin="round" />
        <polygon points="400,210 730,375 730,180 400,15" fill="#e9e2d4" stroke="#17171a" strokeWidth="4" strokeLinejoin="round" />
        {wallpaper}

        {/* window on the right wall */}
        <g>
          <polygon points="500,90 622,151 622,251 500,190" fill="url(#windowSky)" stroke="#17171a" strokeWidth="4" />
          <line x1="561" y1="120" x2="561" y2="221" stroke="#17171a" strokeWidth="3" />
          <circle cx="596" cy="146" r="10" fill="#ffd76e" opacity="0.9" />
        </g>

        {/* bed frame (always there — bedding drops onto it) */}
        <g>
          <polygon points="288,398 468,306 468,352 288,444" fill="#c9bda8" stroke="#17171a" strokeWidth="3" />
          <polygon points="150,332 288,398 288,444 150,378" fill="#b3a68f" stroke="#17171a" strokeWidth="3" />
          {duvets.length === 0 && (
            <polygon points="150,332 330,240 468,306 288,398" fill="#efe9dc" stroke="#17171a" strokeWidth="3" strokeDasharray="7 6" />
          )}
          {duvets}
          {/* pillow */}
          <polygon points="188,318 258,282 300,302 230,338" fill="#fbf8f1" stroke="#17171a" strokeWidth="3" />
          {throws_}
        </g>

        {/* rug drop hint */}
        {rugs.length === 0 && (
          <polygon points="470,478 340,413 470,348 600,413" fill="none" stroke="#17171a" strokeWidth="2.5" strokeDasharray="7 7" opacity="0.5" />
        )}
        {rugs}

        {/* desk + shelf on the right wall */}
        <g>
          <polygon points="520,288 640,228 706,261 586,321" fill="#d9c9ad" stroke="#17171a" strokeWidth="3" />
          <line x1="524" y1="292" x2="524" y2="340" stroke="#17171a" strokeWidth="4" />
          <line x1="588" y1="323" x2="588" y2="372" stroke="#17171a" strokeWidth="4" />
          <line x1="702" y1="264" x2="702" y2="312" stroke="#17171a" strokeWidth="4" />
          <polygon points="648,170 716,204 716,214 648,180" fill="#d9c9ad" stroke="#17171a" strokeWidth="3" />
        </g>

        {/* wall posters */}
        {posters}
        {/* LED strips along the ceiling line */}
        {leds}
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------
// AI Fit Check — mock "AI": pure dimension math.
// ---------------------------------------------------------------
const ROOM_PRESETS = [
  { label: 'Standard dorm', w: 12, l: 14 },
  { label: 'Cozy single', w: 9, l: 11 },
  { label: 'Big room', w: 15, l: 18 },
]

function computeFit(placed, dims) {
  const { byId } = window.DATA
  const flags = {}
  const notes = []
  const area = dims.w * dims.l
  let used = 0
  placed.forEach((it) => {
    const p = byId(it.pid)
    if (!p || !p.footprint) return
    const { w, l } = p.footprint
    const fits = (w <= dims.w && l <= dims.l) || (l <= dims.w && w <= dims.l)
    if (!fits) {
      flags[it.uid] = 'too-big'
      notes.push({ level: 'bad', text: `${p.name} (${w}×${l} ft) won't clear a ${dims.w}×${dims.l} room.` })
      return
    }
    used += w * l
    if (used > area * 0.55) {
      flags[it.uid] = 'tight'
      notes.push({ level: 'warn', text: `${p.name} makes the floor plan tight — you're over 55% floor coverage.` })
    }
  })
  if (notes.length === 0 && placed.length > 0) notes.push({ level: 'ok', text: `Everything fits your ${dims.w}×${dims.l} ft room. Clean layout.` })
  return { flags, notes, used, area }
}

// ---------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------
function RoomBuilder({ collection, presetReq, initialRoom, onShopRoom, onViewInRoom }) {
  const { PRESETS, COLLECTIONS, gridProducts, byId, fmt, BUNDLE_MIN, BUNDLE_PCT } = window.DATA

  const [placed, setPlaced] = useState(() =>
    initialRoom ? initialRoom.i.map(([pid, c, z]) => ({ uid: nextUid(), pid, c, z })) : []
  )
  const [dims, setDims] = useState(() =>
    initialRoom && initialRoom.d ? { w: initialRoom.d[0], l: initialRoom.d[1] } : { w: 12, l: 14 }
  )
  const [fitOn, setFitOn] = useState(false)
  const [sheetUid, setSheetUid] = useState(null)
  const [drag, setDrag] = useState(null) // {pid,c,uid?,x,y}
  const [hoverZone, setHoverZone] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)

  const canvasRef = useRef(null)
  const dragRef = useRef(null)
  const toastTimer = useRef(null)

  const presets = PRESETS.filter((p) => p.collection === collection)
  // Photographed SKUs only — the tray is a storefront surface, so it holds the
  // same product the grid above it does rather than falling back to grey tiles.
  const tray = gridProducts(collection)

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  const applyPreset = useCallback((preset) => {
    setPlaced(preset.items.map(([pid, c, z]) => ({ uid: nextUid(), pid, c, z })))
    showToast(`“${preset.name}” loaded — make it yours.`)
  }, [showToast])

  useEffect(() => {
    if (!presetReq) return
    const preset = PRESETS.find((p) => p.id === presetReq.presetId)
    if (preset) applyPreset(preset)
  }, [presetReq])

  const fit = useMemo(
    () => (fitOn ? computeFit(placed, dims) : { flags: {}, notes: [] }),
    [fitOn, placed, dims]
  )
  const scale = fitOn
    ? Math.max(0.72, Math.min(1.12, Math.sqrt((dims.w * dims.l) / 168)))
    : 1

  // ------- room totals (bundle preview) -------
  const roomTotal = useMemo(() => {
    const sub = placed.reduce((s, it) => s + (byId(it.pid)?.price || 0), 0)
    const byColl = {}
    placed.forEach((it) => {
      const c = byId(it.pid)?.collection
      byColl[c] = (byColl[c] || 0) + 1
    })
    let discount = 0
    placed.forEach((it) => {
      const p = byId(it.pid)
      if (p && byColl[p.collection] >= BUNDLE_MIN) discount += p.price * BUNDLE_PCT
    })
    return { sub, discount, total: sub - discount, bundled: Object.values(byColl).some((n) => n >= BUNDLE_MIN) }
  }, [placed])

  // ------- drag + tap (pointer events; works for touch + mouse) -------
  const zoneFromPoint = useCallback((x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const els = canvas.querySelectorAll('[data-zone]')
    for (const el of els) {
      const r = el.getBoundingClientRect()
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return el.dataset.zone
    }
    return null
  }, [])

  const startPointer = useCallback((e, payload) => {
    if (e.button !== undefined && e.button !== 0) return
    const startX = e.clientX
    const startY = e.clientY
    dragRef.current = { ...payload, started: false, startX, startY }

    const onMove = (ev) => {
      const d = dragRef.current
      if (!d) return
      if (!d.started && Math.hypot(ev.clientX - d.startX, ev.clientY - d.startY) < 7) return
      d.started = true
      setDrag({ pid: d.pid, c: d.c, x: ev.clientX, y: ev.clientY })
      setHoverZone(zoneFromPoint(ev.clientX, ev.clientY))
    }
    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointercancel', onUp)
      const d = dragRef.current
      dragRef.current = null
      setDrag(null)
      setHoverZone(null)
      if (!d) return
      if (d.started) {
        const zone = zoneFromPoint(ev.clientX, ev.clientY)
        if (zone) {
          if (d.uid) {
            setPlaced((ps) => ps.map((it) => (it.uid === d.uid ? { ...it, z: zone } : it)))
            showToast(`Moved to ${ZONE_META[zone].label.toLowerCase()}`)
          } else {
            setPlaced((ps) => [...ps, { uid: nextUid(), pid: d.pid, c: d.c, z: zone }])
            showToast(`${byId(d.pid).short} snapped to ${ZONE_META[zone].label.toLowerCase()}`)
          }
        }
      } else {
        // treat as a tap
        if (d.uid) setSheetUid(d.uid)
        else {
          const p = byId(d.pid)
          setPlaced((ps) => [...ps, { uid: nextUid(), pid: d.pid, c: d.c, z: p.zone }])
          showToast(`${p.short} added to ${ZONE_META[p.zone].label.toLowerCase()} — or drag it next time`)
        }
      }
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
    window.addEventListener('pointercancel', onUp, { once: true })
  }, [zoneFromPoint, showToast])

  // ------- share -------
  const shareUrl = useMemo(() => {
    const payload = { c: collection, d: [dims.w, dims.l], i: placed.map((it) => [it.pid, it.c, it.z]) }
    const code = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return `${location.origin}${location.pathname}#r=${code}`
  }, [placed, dims, collection])

  const copyShare = () => {
    history.replaceState(null, '', shareUrl)
    const done = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(done, done)
    } else done()
  }

  // ------- sheet target -------
  const sheetItem = placed.find((it) => it.uid === sheetUid)
  const sheetProduct = sheetItem && byId(sheetItem.pid)

  // chips = everything that isn't painted into the SVG
  const chips = placed.filter((it) => visualFor(it) === 'chip')
  const chipIndex = {}

  return (
    <div className="section builder">
      <p className="section-kicker">02 — Build your room</p>
      <h2 className="section-title">Drag it. Style it. Live in it.</h2>
      <p className="section-sub">
        Drag products onto the bed, walls, desk or floor. Tap anything placed to swap its colorway.
      </p>

      {/* presets */}
      <div className="preset-row">
        <span className="preset-label">Starter rooms:</span>
        {presets.map((p) => (
          <button key={p.id} className="preset-chip" onClick={() => applyPreset(p)}>
            {p.name}
          </button>
        ))}
        {placed.length > 0 && (
          <button className="preset-chip preset-clear" onClick={() => setPlaced([])}>
            ✕ Clear room
          </button>
        )}
      </div>

      {/* AI fit check */}
      <div className={'fit-panel' + (fitOn ? ' is-on' : '')}>
        <button className="fit-toggle" onClick={() => setFitOn((v) => !v)}>
          AI Fit Check
          <span className={'fit-switch' + (fitOn ? ' on' : '')} aria-hidden="true" />
        </button>
        {fitOn && (
          <div className="fit-body">
            <div className="fit-dims">
              <label>
                W
                <input
                  type="number" min="6" max="30" value={dims.w}
                  onChange={(e) => setDims((d) => ({ ...d, w: +e.target.value || d.w }))}
                />
              </label>
              <span>×</span>
              <label>
                L
                <input
                  type="number" min="6" max="30" value={dims.l}
                  onChange={(e) => setDims((d) => ({ ...d, l: +e.target.value || d.l }))}
                />
              </label>
              <span className="fit-ft">ft</span>
              {ROOM_PRESETS.map((r) => (
                <button
                  key={r.label}
                  className={'fit-preset' + (dims.w === r.w && dims.l === r.l ? ' is-on' : '')}
                  onClick={() => setDims({ w: r.w, l: r.l })}
                >
                  {r.label} {r.w}×{r.l}
                </button>
              ))}
            </div>
            <ul className="fit-notes">
              {fit.notes.length === 0 && <li className="fit-note-ok">Place some items and we'll check the math.</li>}
              {fit.notes.map((n, i) => (
                <li key={i} className={'fit-note-' + n.level}>{n.text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* canvas */}
      <div className={'canvas-wrap' + (drag ? ' is-dragging' : '')} ref={canvasRef}>
        <RoomSVG placed={placed} scale={scale} flags={fit.flags} onTapItem={setSheetUid} />

        {fitOn && <span className="canvas-dims">{dims.w} × {dims.l} ft</span>}

        {ZONES.map((z) => {
          const m = ZONE_META[z]
          return (
            <div
              key={z}
              data-zone={z}
              className={'zone' + (hoverZone === z ? ' is-hot' : '') + (drag ? ' is-visible' : '')}
              style={{ left: m.box.x + '%', top: m.box.y + '%', width: m.box.w + '%', height: m.box.h + '%' }}
            >
              <span>{m.label}</span>
            </div>
          )
        })}

        {chips.map((it) => {
          const p = byId(it.pid)
          const idx = (chipIndex[it.z] = (chipIndex[it.z] ?? -1) + 1)
          const [dx, dy] = CHIP_OFFSETS[idx % CHIP_OFFSETS.length]
          const m = ZONE_META[it.z]
          const img = p.colorways[it.c]?.image || p.image
          const crop = p.crop && img ? p.crop : null
          const style = { zIndex: 5 + idx }
          if (crop) {
            // Show the crop at its own aspect ratio by blowing the background
            // up until that sub-rect is the whole tile.
            const [x0, y0, x1, y1] = crop
            const w = x1 - x0
            const h = y1 - y0
            style.left = `${m.px + dx * 0.5}%`
            style.top = `${m.py + dy * 0.5}%`
            style.width = `${m.pw}%`
            style.backgroundImage = `url(${img})`
            style.backgroundPosition = `${(x0 / (1 - w)) * 100}% ${(y0 / (1 - h)) * 100}%`
            style.backgroundSize = `${100 / w}% ${100 / h}%`
            style.aspectRatio = `${w * MOCKUP_W} / ${h * MOCKUP_H}`
          } else {
            style.left = `${m.cx + dx}%`
            style.top = `${m.cy + dy}%`
            style.background = p.colorways[it.c]?.hex
          }
          return (
            <button
              key={it.uid}
              className={
                'room-chip' +
                (crop ? ' room-chip-photo' : '') +
                (crop && m.surface ? ' on-surface' : '') +
                (fit.flags[it.uid] ? ' flagged' : '')
              }
              style={style}
              onPointerDown={(e) => startPointer(e, { pid: it.pid, c: it.c, uid: it.uid })}
              title={p.name + ' — tap to edit, drag to move'}
            >
              {crop ? <span className="sr-only">{p.name}</span> : p.short}
            </button>
          )
        })}

        {placed.length === 0 && (
          <div className="canvas-empty">
            <p>Drag a product up from the tray,<br />or tap a starter room.</p>
          </div>
        )}
      </div>

      {/* live cart HUD */}
      <div className="room-hud">
        <div className="room-hud-total">
          <span className="room-hud-label">{placed.length} item{placed.length !== 1 ? 's' : ''} in room</span>
          <strong>
            {fmt(roomTotal.total)}
            {roomTotal.discount > 0 && <s>{fmt(roomTotal.sub)}</s>}
          </strong>
          {roomTotal.bundled && <span className="room-hud-bundle">Bundle −15% applied</span>}
        </div>
        <button className="btn btn-primary" disabled={placed.length === 0} onClick={() => { onShopRoom(placed); showToast('Room added to bag.') }}>
          Shop This Room
        </button>
        <button className="btn btn-ghost" disabled={placed.length === 0} onClick={() => setShareOpen(true)}>
          Share My Room
        </button>
      </div>

      {/* catalog tray */}
      <div className="tray">
        <p className="tray-label">
          {COLLECTIONS[collection].short} catalog — hold + drag into the room
        </p>
        <div className="tray-scroll">
          {tray.map((p) => (
            <div
              key={p.id}
              className="tray-card"
              onPointerDown={(e) => startPointer(e, { pid: p.id, c: 0 })}
            >
              <ProductThumb product={p} size={64} />
              <span className="tray-name">{p.name}</span>
              <span className="tray-price">{fmt(p.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* drag ghost */}
      {drag && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
          <span style={{ background: byId(drag.pid).colorways[drag.c]?.hex }}>{byId(drag.pid).short}</span>
        </div>
      )}

      {/* toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* bottom sheet: swap colorway / move / remove */}
      {sheetItem && sheetProduct && (
        <div className="sheet-scrim" onClick={() => setSheetUid(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <ProductThumb product={sheetProduct} colorIdx={sheetItem.c} size={52} />
              <div>
                <h4>{sheetProduct.name}</h4>
                <p>{fmt(sheetProduct.price)} · in {ZONE_META[sheetItem.z].label.toLowerCase()}</p>
              </div>
            </div>
            <p className="sheet-sub">Colorway</p>
            <div className="sheet-swatches">
              {sheetProduct.colorways.map((cw, i) => (
                <button
                  key={cw.name}
                  className={'sheet-swatch' + (i === sheetItem.c ? ' is-on' : '')}
                  onClick={() => setPlaced((ps) => ps.map((it) => (it.uid === sheetUid ? { ...it, c: i } : it)))}
                >
                  <span style={{ background: cw.hex }} />
                  {cw.name}
                </button>
              ))}
            </div>
            <p className="sheet-sub">Move to</p>
            <div className="sheet-zones">
              {ZONES.map((z) => (
                <button
                  key={z}
                  className={'sheet-zone' + (sheetItem.z === z ? ' is-on' : '')}
                  onClick={() => setPlaced((ps) => ps.map((it) => (it.uid === sheetUid ? { ...it, z } : it)))}
                >
                  {ZONE_META[z].label}
                </button>
              ))}
            </div>
            <button
              className="btn btn-ghost sheet-ar"
              onClick={() => { setSheetUid(null); onViewInRoom(sheetItem.pid, sheetItem.c) }}
            >
              View in Your Room — true scale
            </button>
            <div className="sheet-actions">
              <button
                className="btn btn-danger"
                onClick={() => { setPlaced((ps) => ps.filter((it) => it.uid !== sheetUid)); setSheetUid(null) }}
              >
                Remove from room
              </button>
              <button className="btn btn-primary" onClick={() => setSheetUid(null)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* share modal */}
      {shareOpen && (
        <div className="sheet-scrim" onClick={() => setShareOpen(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-card">
              <p className="share-brand">PACSUN HOME</p>
              <div className="share-items">
                {placed.slice(0, 6).map((it) => (
                  <ProductThumb key={it.uid} product={byId(it.pid)} colorIdx={it.c} size={52} />
                ))}
              </div>
              <p className="share-caption">my @pacsun home era</p>
              <p className="share-tags">#PacSunHome #RoomTour #{COLLECTIONS[collection].short.replace(/\s/g, '')}</p>
            </div>
            <p className="share-hint">This link reopens your exact room — drop it in your TikTok or IG bio.</p>
            <div className="share-link">
              <input readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
              <button className="btn btn-primary" onClick={copyShare}>
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <button className="btn btn-ghost" onClick={() => setShareOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

window.RoomBuilder = RoomBuilder
