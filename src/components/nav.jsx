const NAV_LINKS = [
  { id: 'shop', label: 'Shop' },
  { id: 'build', label: 'Build Your Room' },
  { id: 'quiz', label: 'Style Quiz' },
  { id: 'community', label: 'Community' },
]

function Nav({ onNavigate, cartCount, onCartOpen, activeSection }) {
  return (
    <header className="nav">
      <div className="nav-top">
        <button className="nav-brand" onClick={() => onNavigate('top')}>
          PACSUN <span className="nav-brand-home">HOME</span>
        </button>
        <button className="nav-cart" onClick={onCartOpen} aria-label="Open cart">
          🛍️
          {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </button>
      </div>
      <nav className="nav-pills" aria-label="Sections">
        {NAV_LINKS.map((l) => (
          <button
            key={l.id}
            className={'nav-pill' + (activeSection === l.id ? ' is-active' : '')}
            onClick={() => onNavigate(l.id)}
          >
            {l.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

window.Nav = Nav
