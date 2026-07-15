const NAV_LINKS = [
  { id: 'shop', label: 'Shop' },
  { id: 'build', label: 'Build Your Room' },
  { id: 'quiz', label: 'Style Quiz' },
  { id: 'community', label: 'Community' },
]

function Nav({ onNavigate, cartCount, onCartOpen, activeSection }) {
  return (
    <header className="nav">
      <div className="nav-promo">Limited time: PacSun Home launch — free shipping on orders $50+</div>
      <div className="nav-top">
        <button className="nav-brand" onClick={() => onNavigate('top')}>
          PACSUN <span className="nav-brand-home">HOME</span>
        </button>
        <button className="nav-cart" onClick={onCartOpen} aria-label="Open shopping bag">
          Bag ({cartCount})
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
