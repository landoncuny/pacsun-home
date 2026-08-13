const { useState: useStateAR, useEffect: useEffectAR, useRef: useRefAR, useMemo: useMemoAR, useCallback: useCallbackAR } = React

// ============================================================
// "View in Your Room" — camera-based AR preview.
// Live camera feed + a perspective-projected, to-scale dimension
// box (pinhole model, assumed ~55° vertical FOV). Real plane
// detection would need per-SKU 3D models + WebXR/Quick Look;
// this renders honest scale from catalog dims + a distance input.
// ============================================================

const AR_FOV_DEG = 55
const AR_MIN_FT = 2
const AR_MAX_FT = 25

// Perspective-project a camera-space point [x, y(down), z(forward)] to screen px.
function arProject(p, f, cx, cy) {
  return [cx + (f * p[0]) / p[2], cy + (f * p[1]) / p[2]]
}

// All geometry for the dimension box: projected corners, faces
// (painter-sorted), emoji anchor, and label anchors.
function arBoxGeometry({ dims, distFt, theta, sx, sy, w: stageW, h: stageH }) {
  const cx = stageW / 2
  const cy = stageH / 2
  const f = stageH / 2 / Math.tan(((AR_FOV_DEG / 2) * Math.PI) / 180)
  const wf = dims.w / 12
  const df = dims.d / 12
  const hf = dims.h / 12
  const Z = distFt
  const X = ((sx - cx) * Z) / f
  const Y = ((sy - cy) * Z) / f
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  const corner = (dx, dy, dz) => [X + dx * cos - dz * sin, Y + dy, Z + (dx * sin + dz * cos)]
  const c = [
    corner(-wf / 2, 0, -df / 2), corner(wf / 2, 0, -df / 2), corner(wf / 2, 0, df / 2), corner(-wf / 2, 0, df / 2),
    corner(-wf / 2, -hf, -df / 2), corner(wf / 2, -hf, -df / 2), corner(wf / 2, -hf, df / 2), corner(-wf / 2, -hf, df / 2),
  ]
  if (c.some((p) => p[2] < 0.5)) return null
  const pts = c.map((p) => arProject(p, f, cx, cy))
  const faceIdx = [
    { ix: [0, 1, 2, 3], kind: 'bottom' },
    { ix: [3, 0, 4, 7], kind: 'side' },
    { ix: [1, 2, 6, 5], kind: 'side' },
    { ix: [2, 3, 7, 6], kind: 'side' },
    { ix: [0, 1, 5, 4], kind: 'side' },
    { ix: [4, 5, 6, 7], kind: 'top' },
  ]
  const faces = faceIdx
    .map((fc) => ({ ...fc, z: fc.ix.reduce((s, i) => s + c[i][2], 0) / 4 }))
    .sort((a, b) => b.z - a.z)
  const mid = (i, j) => [(pts[i][0] + pts[j][0]) / 2, (pts[i][1] + pts[j][1]) / 2]
  // Push edge labels outward from the base center so they never
  // stack on each other, whatever the rotation.
  const baseCenter = arProject([X, Y, Z], f, cx, cy)
  const outward = (m, push) => {
    const vx = m[0] - baseCenter[0]
    const vy = m[1] - baseCenter[1]
    const len = Math.hypot(vx, vy) || 1
    return [m[0] + (vx / len) * push, m[1] + (vy / len) * push]
  }
  const emojiPt = arProject([X, Y - hf / 2, Z], f, cx, cy)
  const emojiSize = (f * hf * 0.5) / Z
  const pxPerFt = f / Z
  return {
    pts, faces, emojiPt, emojiSize, pxPerFt,
    labels: { w: outward(mid(0, 1), 38), d: outward(mid(1, 2), 38), h: mid(0, 4) },
    bboxHit: {
      minX: Math.min(...pts.map((p) => p[0])) - 20, maxX: Math.max(...pts.map((p) => p[0])) + 20,
      minY: Math.min(...pts.map((p) => p[1])) - 20, maxY: Math.max(...pts.map((p) => p[1])) + 20,
    },
  }
}

function ArLabel({ at, text, dx = 0, dy = 0 }) {
  const w = Math.max(56, text.length * 7 + 18)
  return (
    <g transform={`translate(${at[0] + dx} ${at[1] + dy})`}>
      <rect x={-w / 2} y="-13" width={w} height="26" rx="2" fill="#111111" opacity="0.9" />
      <text textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="12" fontWeight="600" fontFamily="Poppins, sans-serif">
        {text}
      </text>
    </g>
  )
}

function ViewInRoom({ pid, colorIdx, sizeIdx = 0, onClose, onAddToCart }) {
  const { byId, fmt, priceOf, sizeOf } = window.DATA
  const product = byId(pid)
  const [mode, setMode] = useStateAR('ask') // ask | camera | sample
  const [camError, setCamError] = useStateAR(null)
  const [facing, setFacing] = useStateAR('environment')
  const [cIdx, setCIdx] = useStateAR(colorIdx || 0)
  const [placed, setPlaced] = useStateAR(null) // {sx, sy}
  const [distFt, setDistFt] = useStateAR(8)
  const [theta, setTheta] = useStateAR((25 * Math.PI) / 180)
  const [stage, setStage] = useStateAR({ w: 0, h: 0 })
  const [added, setAdded] = useStateAR(false)
  const [saved, setSaved] = useStateAR(false)

  const stageRef = useRefAR(null)
  const videoRef = useRefAR(null)
  const streamRef = useRefAR(null)
  const dragRef = useRefAR(null)
  const pinchRef = useRefAR(null)

  const colorway = product.colorways[cIdx] || product.colorways[0]

  // ---- stage measurement ----
  useEffectAR(() => {
    const measure = () => {
      const r = stageRef.current?.getBoundingClientRect()
      if (r && r.width) setStage((s) => (s.w === r.width && s.h === r.height ? s : { w: r.width, h: r.height }))
    }
    measure()
    window.addEventListener('resize', measure)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (ro && stageRef.current) ro.observe(stageRef.current)
    return () => {
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [mode])

  // ---- camera ----
  const stopStream = useCallbackAR(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const enableCamera = useCallbackAR(async (face) => {
    setCamError(null)
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('This browser has no camera API — try the sample room instead.')
      return
    }
    try {
      stopStream()
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: face }, audio: false })
      streamRef.current = stream
      setMode('camera')
      setFacing(face)
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      })
    } catch (err) {
      setCamError(
        err && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
          ? 'Camera permission was denied. You can allow it in your browser settings, or preview in the sample room.'
          : 'Could not start the camera (' + (err?.name || 'unknown') + '). Try the sample room instead.'
      )
    }
  }, [stopStream])

  useEffectAR(() => () => stopStream(), [stopStream])

  // ---- geometry ----
  const geo = useMemoAR(() => {
    if (!placed || !stage.w) return null
    return arBoxGeometry({ dims: product.dims, distFt, theta, sx: placed.sx, sy: placed.sy, w: stage.w, h: stage.h })
  }, [placed, distFt, theta, stage, product])

  // ---- pointer interactions: tap to place, drag to move, pinch = distance ----
  const onStagePointerDown = (e) => {
    if (mode === 'ask') return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const r = stageRef.current.getBoundingClientRect()
    const sx = e.clientX - r.left
    const sy = e.clientY - r.top
    const pointers = (pinchRef.current = pinchRef.current || new Map())
    pointers.set(e.pointerId, [sx, sy])
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]
      pinchRef.current.startSpan = Math.hypot(a[0] - b[0], a[1] - b[1])
      pinchRef.current.startDist = distFt
      dragRef.current = null
      return
    }
    if (geo && sx >= geo.bboxHit.minX && sx <= geo.bboxHit.maxX && sy >= geo.bboxHit.minY && sy <= geo.bboxHit.maxY) {
      dragRef.current = { dx: placed.sx - sx, dy: placed.sy - sy }
    } else {
      setPlaced({ sx, sy })
      dragRef.current = { dx: 0, dy: 0 }
    }
  }
  const onStagePointerMove = (e) => {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r) return
    const sx = e.clientX - r.left
    const sy = e.clientY - r.top
    const pointers = pinchRef.current
    if (pointers && pointers.has(e.pointerId)) pointers.set(e.pointerId, [sx, sy])
    if (pointers && pointers.size === 2 && pointers.startSpan) {
      const [a, b] = [...pointers.values()]
      const span = Math.hypot(a[0] - b[0], a[1] - b[1])
      if (span > 10) setDistFt(Math.min(AR_MAX_FT, Math.max(AR_MIN_FT, (pointers.startDist * pointers.startSpan) / span)))
      return
    }
    if (dragRef.current) setPlaced({ sx: sx + dragRef.current.dx, sy: sy + dragRef.current.dy })
  }
  const onStagePointerUp = (e) => {
    pinchRef.current?.delete(e.pointerId)
    if (pinchRef.current) pinchRef.current.startSpan = null
    dragRef.current = null
  }
  const onStageWheel = (e) => {
    setDistFt((d) => Math.min(AR_MAX_FT, Math.max(AR_MIN_FT, d + e.deltaY * 0.01)))
  }

  // ---- snapshot: composite the frame + box onto a canvas ----
  const snapshot = () => {
    if (!geo || !stage.w) return
    const scale = 2
    const cw = stage.w * scale
    const ch = stage.h * scale
    const cv = document.createElement('canvas')
    cv.width = cw
    cv.height = ch
    const g = cv.getContext('2d')

    if (mode === 'camera' && videoRef.current && videoRef.current.videoWidth) {
      const v = videoRef.current
      const s = Math.max(cw / v.videoWidth, ch / v.videoHeight)
      const sw = cw / s
      const sh = ch / s
      g.drawImage(v, (v.videoWidth - sw) / 2, (v.videoHeight - sh) / 2, sw, sh, 0, 0, cw, ch)
    } else {
      const horizon = ch * 0.62
      const wall = g.createLinearGradient(0, 0, 0, horizon)
      wall.addColorStop(0, '#ece6da')
      wall.addColorStop(1, '#ddd5c6')
      g.fillStyle = wall
      g.fillRect(0, 0, cw, horizon)
      g.fillStyle = '#c8bda9'
      g.fillRect(0, horizon, cw, ch - horizon)
      g.fillStyle = '#f3ede0'
      g.strokeStyle = '#a89a82'
      g.lineWidth = 4
      g.fillRect(cw * 0.62, ch * 0.1, cw * 0.26, ch * 0.34)
      g.strokeRect(cw * 0.62, ch * 0.1, cw * 0.26, ch * 0.34)
    }

    const lineCol = mode === 'camera' ? '#ffffff' : '#111111'
    const P = geo.pts.map((p) => [p[0] * scale, p[1] * scale])
    const drawFace = (fc) => {
      g.beginPath()
      fc.ix.forEach((i, n) => (n ? g.lineTo(P[i][0], P[i][1]) : g.moveTo(P[i][0], P[i][1])))
      g.closePath()
      g.fillStyle = colorway.hex
      g.globalAlpha = fc.kind === 'bottom' ? 0.34 : fc.kind === 'top' ? 0.12 : 0.16
      g.fill()
      g.globalAlpha = 1
      g.strokeStyle = lineCol
      g.lineWidth = 2 * scale
      g.stroke()
    }
    geo.faces.forEach(drawFace)

    const pill = (x, y, text) => {
      g.font = `600 ${12 * scale}px Poppins, sans-serif`
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      const w = g.measureText(text).width + 18 * scale
      const h = 26 * scale
      g.fillStyle = 'rgba(17,17,17,0.9)'
      g.beginPath()
      g.roundRect(x - w / 2, y - h / 2, w, h, 2 * scale)
      g.fill()
      g.fillStyle = '#fff'
      g.fillText(text, x, y + scale)
    }
    pill(geo.emojiPt[0] * scale, (geo.emojiPt[1] - 24) * scale, `${product.short.toUpperCase()} — MOCKUP PENDING`)
    pill(geo.labels.w[0] * scale, geo.labels.w[1] * scale, `${product.dims.w}" W`)
    pill(geo.labels.d[0] * scale, geo.labels.d[1] * scale, `${product.dims.d}" D`)
    pill(geo.labels.h[0] * scale - 44 * scale, geo.labels.h[1] * scale, `${product.dims.h}" H`)

    g.fillStyle = 'rgba(17,17,17,0.9)'
    g.fillRect(0, ch - 52 * scale, cw, 52 * scale)
    g.fillStyle = '#fff'
    g.textAlign = 'left'
    g.textBaseline = 'alphabetic'
    g.font = `600 ${14 * scale}px Poppins, sans-serif`
    g.fillText(`PACSUN HOME  ·  ${product.name}`, 16 * scale, ch - 22 * scale)

    const a = document.createElement('a')
    a.href = cv.toDataURL('image/png')
    a.download = `pacsun-home-${product.id}-in-my-room.png`
    a.click()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const close = () => {
    stopStream()
    onClose()
  }

  return (
    <div className="ar-overlay">
      <div className="ar-topbar">
        <button className="ar-close" onClick={close}>✕</button>
        <div className="ar-title">
          <strong>{product.name}</strong>
          <span>
            {[
              `${product.dims.w}″W × ${product.dims.d}″D × ${product.dims.h}″H`,
              sizeOf(product, sizeIdx),
              fmt(priceOf(product, sizeIdx)),
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </div>
        {mode === 'camera' && (
          <button className="ar-flip" onClick={() => enableCamera(facing === 'environment' ? 'user' : 'environment')} title="Flip camera">
            Flip
          </button>
        )}
      </div>

      {mode === 'ask' ? (
        <div className="ar-ask">
          <svg className="ar-ask-icon" viewBox="0 0 48 48" width="56" height="56" aria-hidden="true">
            <rect x="4" y="12" width="40" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path d="M17 12l3-5h8l3 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="24" cy="26" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
          <h3>See it in your room</h3>
          <p>
            We'll use your camera to show the <strong>{product.name}</strong> at true scale — with its
            footprint and dimensions floating in your space. The feed stays on your device; nothing is
            recorded or uploaded.
          </p>
          {camError && <p className="ar-error">⚠️ {camError}</p>}
          <button className="btn btn-primary btn-lg" onClick={() => enableCamera('environment')}>
            Enable camera
          </button>
          <button className="btn btn-ghost" onClick={() => setMode('sample')}>
            Use a sample room instead
          </button>
        </div>
      ) : (
        <>
          <div
            ref={stageRef}
            className={'ar-stage' + (mode === 'sample' ? ' ar-sample' : '')}
            onPointerDown={onStagePointerDown}
            onPointerMove={onStagePointerMove}
            onPointerUp={onStagePointerUp}
            onPointerCancel={onStagePointerUp}
            onWheel={onStageWheel}
          >
            {mode === 'camera' && <video ref={videoRef} className="ar-video" autoPlay playsInline muted />}
            {mode === 'sample' && (
              <div className="ar-sample-room" aria-hidden="true">
                <div className="ar-sample-window" />
              </div>
            )}

            {geo && (
              <svg className="ar-svg" width={stage.w} height={stage.h}>
                {geo.faces.map((fc, i) => (
                  <polygon
                    key={i}
                    points={fc.ix.map((ix) => geo.pts[ix].join(',')).join(' ')}
                    fill={colorway.hex}
                    fillOpacity={fc.kind === 'bottom' ? 0.34 : fc.kind === 'top' ? 0.12 : 0.16}
                    stroke={mode === 'camera' ? '#ffffff' : '#111111'}
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                ))}
                <ArLabel at={geo.emojiPt} dy={-24} text={`${product.short.toUpperCase()} — MOCKUP PENDING`} />
                <ArLabel at={geo.labels.w} text={`${product.dims.w}" W`} />
                <ArLabel at={geo.labels.d} text={`${product.dims.d}" D`} />
                <ArLabel at={geo.labels.h} dx={-44} text={`${product.dims.h}" H`} />
              </svg>
            )}

            {!placed && (
              <div className="ar-hint">
                <p>Tap where you want it — then drag to move, scroll or pinch for distance.</p>
              </div>
            )}
            {placed && (
              <span className="ar-scale-chip">
                To scale at {distFt.toFixed(1)} ft · footprint {product.dims.w}″ × {product.dims.d}″
              </span>
            )}
          </div>

          <div className="ar-controls">
            <label className="ar-slider">
              <span>Distance {distFt.toFixed(1)} ft</span>
              <input
                type="range" min={AR_MIN_FT} max={AR_MAX_FT} step="0.5" value={distFt}
                onChange={(e) => setDistFt(+e.target.value)}
              />
            </label>
            <label className="ar-slider">
              <span>Rotate {Math.round((theta * 180) / Math.PI)}°</span>
              <input
                type="range" min="0" max="360" step="5" value={Math.round((theta * 180) / Math.PI)}
                onChange={(e) => setTheta((+e.target.value * Math.PI) / 180)}
              />
            </label>
            <div className="ar-swatches">
              {product.colorways.map((cw, i) => (
                <button
                  key={cw.name}
                  className={'swatch' + (i === cIdx ? ' is-on' : '')}
                  style={{ background: cw.hex }}
                  title={cw.name}
                  onClick={() => setCIdx(i)}
                />
              ))}
            </div>
            <div className="ar-actions">
              <button className="btn btn-ghost" disabled={!placed} onClick={snapshot}>
                {saved ? 'Saved' : 'Snapshot'}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => { onAddToCart(pid, cIdx, sizeIdx); setAdded(true); setTimeout(() => setAdded(false), 1800) }}
              >
                {added ? 'Added' : `Add to Bag · ${fmt(priceOf(product, sizeIdx))}`}
              </button>
            </div>
            <p className="ar-note">
              Preview is approximate — assumes a ~{AR_FOV_DEG}° camera. Set the distance to where the
              item would sit and the box renders at true size.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

window.ViewInRoom = ViewInRoom
