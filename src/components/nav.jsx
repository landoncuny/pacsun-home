const { useState: useStateN, useRef: useRefN, useEffect: useEffectN } = React

function Nav({ onNavigate, cartCount, onCartOpen, activeSection, route }) {
  const { shopMenu } = window.DATA
  const [openId, setOpenId] = useStateN(null)
  const closeTimer = useRefN(null)
  const menu = shopMenu()
  const onCollection = route && route.view === 'collection'

  // "Build Your Room" only appears where the builder lives.
  const links = [{ id: 'shop', label: 'Shop', hasMenu: true }]
    .concat(onCollection ? [{ id: 'build', label: 'Build Your Room' }] : [])
    .concat([{ id: 'quiz', label: 'Style Quiz' }, { id: 'community', label: 'Community' }])

  const open = (id) => {
    clearTimeout(closeTimer.current)
    setOpenId(id)
  }
  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenId(null), 140)
  }
  useEffectN(() => () => clearTimeout(closeTimer.current), [])

  const go = (id) => {
    setOpenId(null)
    onNavigate(id)
  }

  return (
    <header className="nav" onMouseLeave={scheduleClose}>
      <div className="nav-promo">Limited time: PacSun Home launch — free shipping on orders $50+</div>
      <div className="nav-top">
        <button className="nav-brand" onClick={() => go('top')}>
          PACSUN <span className="nav-brand-home">HOME</span>
        </button>
        <button className="nav-cart" onClick={onCartOpen} aria-label="Open shopping bag">
          Bag ({cartCount})
        </button>
      </div>
      <nav className="nav-pills" aria-label="Sections">
        {links.map((l) => {
          const active = l.id === 'shop' ? onCollection : activeSection === l.id
          return (
            <button
              key={l.id}
              className={'nav-pill' + (active ? ' is-active' : '') + (openId === l.id ? ' is-open' : '')}
              aria-expanded={l.hasMenu ? openId === l.id : undefined}
              onMouseEnter={() => (l.hasMenu ? open(l.id) : scheduleClose())}
              onFocus={() => (l.hasMenu ? open(l.id) : scheduleClose())}
              onClick={() => go(l.id)}
            >
              {l.label}
            </button>
          )
        })}
      </nav>

      {openId === 'shop' && (
        <div className="nav-menu" onMouseEnter={() => open('shop')}>
          <div className="nav-menu-inner">
            {menu.map((col) => (
              <div className="nav-menu-col" key={col.id}>
                <div className="nav-menu-title">
                  <span className="nav-menu-swatch" style={{ background: col.swatch }} />
                  {col.title}
                  <span className="nav-menu-count">{col.count}</span>
                </div>
                <div className="nav-menu-links">
                  {col.items.map((it) => (
                    <button
                      key={it.label}
                      className={'nav-menu-link' + (it.strong ? ' is-strong' : '')}
                      onClick={() => go('collection-' + col.id + (it.category ? '/' + it.category : ''))}
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

window.Nav = Nav
