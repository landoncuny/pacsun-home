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

// Routes: "#/home" | "#/dorm" | "#/kids" are collection storefronts, with an
// optional "/<category>" segment preselecting a filter chip. Anything else is
// the landing page. A shared room link lands on its own collection.
function parseRoute(room) {
  const { ID_BY_SLUG, COLLECTIONS } = window.DATA
  const m = (location.hash || '').match(/^#\/(home|dorm|kids)(?:\/([a-z-]+))?/)
  if (m) return { view: 'collection', collection: ID_BY_SLUG[m[1]], category: m[2] || null }
  if (room && room.c && COLLECTIONS[room.c]) return { view: 'collection', collection: room.c, category: null }
  return { view: 'landing', collection: null, category: null }
}

function App() {
  const { COLLECTIONS, SLUG_BY_ID } = window.DATA
  const [initialRoom] = useStateA(parseRoomHash)
  const [route, setRoute] = useStateA(() => parseRoute(initialRoom))
  const [cart, setCart] = useStateA({})
  const [cartOpen, setCartOpen] = useStateA(false)
  const [presetReq, setPresetReq] = useStateA(null)
  const [activeSection, setActiveSection] = useStateA(null)
  const [arView, setArView] = useStateA(null) // {pid, colorIdx, sizeIdx}
  // Section to scroll to once the next view has rendered.
  const [pendingScroll, setPendingScroll] = useStateA(initialRoom ? 'build' : null)

  const refs = { shop: useRefA(null), build: useRefA(null), quiz: useRefA(null), community: useRefA(null) }
  // Lives inside the community section, so it gets its own ref rather than a nav id.
  const campusRef = useRefA(null)

  const scrollTo = (target) => {
    window.scrollTo({ top: target, behavior: 'smooth' })
    setTimeout(() => {
      if (Math.abs(window.scrollY - target) > 40) window.scrollTo({ top: target, behavior: 'instant' })
    }, 700)
  }

  // Smooth scroll with an instant fallback — some embedded webviews never run
  // rAF-driven smooth scrolling, so verify we moved and jump if not.
  const scrollToSection = (id) => {
    if (id === 'top') return scrollTo(0)
    const el = refs[id] && refs[id].current
    if (!el) return
    scrollTo(el.getBoundingClientRect().top + window.scrollY - 100)
  }

  // ---- routing ----
  const openCollection = (cid, section, category) => {
    if (!COLLECTIONS[cid]) return
    if (section) setPendingScroll(section)
    const next = '#/' + SLUG_BY_ID[cid] + (category ? '/' + category : '')
    // Same-hash assignment fires no hashchange, so re-sync by hand.
    if (location.hash === next) setRoute(parseRoute(null))
    else location.hash = next
  }

  const goHome = (section) => {
    if (section) setPendingScroll(section)
    location.hash = '#/'
  }

  useEffectA(() => {
    const onHash = () => setRoute(parseRoute(null))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // New page starts at the top unless something asked for a section.
  // Repeated because scroll anchoring nudges us back down as the page's
  // images settle and change the layout height.
  useEffectA(() => {
    if (pendingScroll) return
    const top = () => window.scrollTo({ top: 0, behavior: 'instant' })
    top()
    const frame = requestAnimationFrame(top)
    const t = setTimeout(top, 200)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(t)
    }
  }, [route.view, route.collection])

  // Run a queued scroll after the destination view has painted.
  useEffectA(() => {
    if (!pendingScroll) return
    const t = setTimeout(() => {
      scrollToSection(pendingScroll)
      setPendingScroll(null)
    }, 120)
    return () => clearTimeout(t)
  }, [pendingScroll, route.view, route.collection])

  // Nav dispatch: section ids scroll, "collection-<id>" opens a storefront.
  const navigate = (id) => {
    if (typeof id === 'string' && id.indexOf('collection-') === 0) {
      const [cid, category] = id.slice('collection-'.length).split('/')
      return openCollection(cid, null, category)
    }
    if (id === 'top') return goHome()
    if (id === 'build') {
      // The builder lives on the collection pages now.
      return route.view === 'collection'
        ? scrollToSection('build')
        : openCollection('essentials', 'build')
    }
    // quiz + community live on the landing page
    if (route.view !== 'landing') return goHome(id)
    scrollToSection(id)
  }

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
  }, [route.view, route.collection])

  // Key is product|colorway|size — a Twin and a King of the same print are
  // separate lines in the bag, like any size-run storefront.
  const addToCart = (pid, cIdx = 0, sIdx = 0, qty = 1) =>
    setCart((c) => {
      const key = `${pid}|${cIdx}|${sIdx}`
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
        // The room canvas has no size picker, so a room bags the default size.
        const key = `${it.pid}|${it.c}|0`
        next[key] = (next[key] || 0) + 1
      })
      return next
    })
    setCartOpen(true)
  }

  // Quiz + campaign hand you into a collection page with the builder primed.
  const startPresetRoom = (coll, presetId) => {
    setPresetReq({ presetId, ts: Date.now() })
    openCollection(coll, 'build')
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  // Per-collection counts drive the bundle banner on each collection page.
  const cartCountsByCollection = useMemoA(() => {
    const { byId } = window.DATA
    return Object.entries(cart).reduce((acc, [key, qty]) => {
      const p = byId(key.split('|')[0])
      if (p) acc[p.collection] = (acc[p.collection] || 0) + qty
      return acc
    }, {})
  }, [cart])

  const themeId = route.collection || 'essentials'
  const theme = COLLECTIONS[themeId]

  return (
    <div className={'app theme-' + themeId} style={{ '--acc': theme.accent }}>
      <Nav
        onNavigate={navigate}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        activeSection={activeSection}
        route={route}
      />

      {route.view === 'collection' ? (
        <CollectionPage
          collection={route.collection}
          category={route.category}
          bundleCount={cartCountsByCollection[route.collection] || 0}
          presetReq={presetReq}
          initialRoom={initialRoom}
          buildRef={refs.build}
          onOpenCollection={openCollection}
          onHome={() => goHome()}
          onAddToCart={addToCart}
          onViewInRoom={(pid, colorIdx, sizeIdx) => setArView({ pid, colorIdx, sizeIdx })}
          onShopRoom={shopRoom}
        />
      ) : (
        <React.Fragment>
          <Hero
            onShop={() => scrollToSection('shop')}
            onQuiz={() => scrollToSection('quiz')}
            onOpenCollection={openCollection}
          />

          <section ref={refs.shop} data-section="shop">
            <CollectionPicker onOpen={openCollection} />
          </section>

          <section ref={refs.quiz} data-section="quiz">
            <Quiz onStartRoom={startPresetRoom} />
          </section>

          <section ref={refs.community} data-section="community">
            <Campaign
              onSeeCampuses={() =>
                campusRef.current &&
                scrollTo(campusRef.current.getBoundingClientRect().top + window.scrollY - 100)
              }
            />
            <CampusList innerRef={campusRef} />
          </section>
        </React.Fragment>
      )}

      <Footer />
      <CartDrawer open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} onChangeQty={changeQty} />
      {arView && (
        <ViewInRoom
          pid={arView.pid}
          colorIdx={arView.colorIdx}
          sizeIdx={arView.sizeIdx || 0}
          onClose={() => setArView(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
