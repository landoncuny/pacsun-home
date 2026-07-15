const { useState: useStateA, useRef: useRefA, useEffect: useEffectA, useMemo: useMemoA } = React

// "#r=..." share links reopen the exact room (config lives in the URL, not storage).
function parseRoomHash() {
  try {
    const m = location.hash.match(/r=([A-Za-z0-9_-]+)/)
    if (!m) return null
    const json = atob(m[1].replace(/-/g, '+').replace(/_/g, '/'))
    const o = JSON.parse(json)
    if (!o || !Array.isArray(o.i)) return null
    return o
  } catch {
    return null
  }
}

function App() {
  const { COLLECTIONS } = window.DATA
  const [initialRoom] = useStateA(parseRoomHash)
  const [collection, setCollection] = useStateA(initialRoom?.c && COLLECTIONS[initialRoom.c] ? initialRoom.c : 'dorm')
  const [cart, setCart] = useStateA({})
  const [cartOpen, setCartOpen] = useStateA(false)
  const [presetReq, setPresetReq] = useStateA(null)
  const [activeSection, setActiveSection] = useStateA(null)
  const [arView, setArView] = useStateA(null) // {pid, colorIdx}

  const refs = { shop: useRefA(null), build: useRefA(null), quiz: useRefA(null), community: useRefA(null) }

  // Smooth scroll with an instant fallback — some embedded webviews
  // never run rAF-driven smooth scrolling, so verify we moved and jump if not.
  const navigate = (id) => {
    const el = id === 'top' ? null : refs[id]?.current
    if (id !== 'top' && !el) return
    const target = id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top: target, behavior: 'smooth' })
    setTimeout(() => {
      if (Math.abs(window.scrollY - target) > 40) window.scrollTo({ top: target, behavior: 'instant' })
    }, 700)
  }

  // shared room links land you right in the builder
  useEffectA(() => {
    if (initialRoom) setTimeout(() => navigate('build'), 400)
  }, [])

  // highlight the section you're in
  useEffectA(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.dataset.section))
      },
      { rootMargin: '-40% 0px -50% 0px' }
    )
    Object.values(refs).forEach((r) => r.current && obs.observe(r.current))
    return () => obs.disconnect()
  }, [])

  const addToCart = (pid, cIdx = 0, qty = 1) =>
    setCart((c) => {
      const key = `${pid}|${cIdx}`
      return { ...c, [key]: (c[key] || 0) + qty }
    })

  const changeQty = (key, delta) =>
    setCart((c) => {
      const next = { ...c }
      const q = (next[key] || 0) + delta
      if (q <= 0) delete next[key]
      else next[key] = q
      return next
    })

  const shopRoom = (placed) => {
    setCart((c) => {
      const next = { ...c }
      placed.forEach((it) => {
        const key = `${it.pid}|${it.c}`
        next[key] = (next[key] || 0) + 1
      })
      return next
    })
    setCartOpen(true)
  }

  const startPresetRoom = (coll, presetId) => {
    setCollection(coll)
    setPresetReq({ presetId, ts: Date.now() })
    navigate('build')
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartCollectionCount = useMemoA(() => {
    const { byId } = window.DATA
    return Object.entries(cart).reduce((n, [key, qty]) => {
      const p = byId(key.split('|')[0])
      return p && p.collection === collection ? n + qty : n
    }, 0)
  }, [cart, collection])

  const theme = COLLECTIONS[collection]

  return (
    <div
      className={'app theme-' + collection}
      style={{ '--acc': theme.accent, '--acc2': theme.accent2, '--onacc': theme.onAccent }}
    >
      <Nav onNavigate={navigate} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} activeSection={activeSection} />
      <Hero onBuild={() => navigate('build')} onQuiz={() => navigate('quiz')} />

      <section ref={refs.shop} data-section="shop">
        <Collections
          collection={collection}
          onSelect={setCollection}
          onAddToCart={addToCart}
          onViewInRoom={(pid, colorIdx) => setArView({ pid, colorIdx })}
          cartCollectionCount={cartCollectionCount}
        />
      </section>

      <section ref={refs.build} data-section="build">
        <RoomBuilder
          collection={collection}
          presetReq={presetReq}
          initialRoom={initialRoom}
          onShopRoom={shopRoom}
          onViewInRoom={(pid, colorIdx) => setArView({ pid, colorIdx })}
        />
      </section>

      <section ref={refs.quiz} data-section="quiz">
        <Quiz onStartRoom={startPresetRoom} />
      </section>

      <section ref={refs.community} data-section="community">
        <Campaign onShopLook={startPresetRoom} />
      </section>

      <Footer />
      <CartDrawer open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} onChangeQty={changeQty} />
      {arView && (
        <ViewInRoom
          pid={arView.pid}
          colorIdx={arView.colorIdx}
          onClose={() => setArView(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
