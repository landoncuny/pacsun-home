// One shot per collection — the hero doubles as the first entry point.
const HERO_SHOTS = [
  { id: 'essentials', src: './src/assets/home-bedding-oat.png', label: 'Home' },
  { id: 'dorm', src: './src/assets/dorm-goodnight-plaid-blue.png', label: 'Dorm' },
  { id: 'kids', src: './src/assets/kids-bedding-sun.png', label: 'Kids' },
]

function Hero({ onShop, onQuiz, onOpenCollection }) {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-kicker">Introducing PacSun Home</p>
        <h1 className="hero-title">Wear your room.</h1>
        <p className="hero-sub">Your fit. Your space. Same energy.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={onShop}>
            Shop the Collections
          </button>
          <button className="btn btn-ghost btn-lg" onClick={onQuiz}>
            Take the Style Quiz
          </button>
        </div>
      </div>
      <div className="hero-shots">
        {HERO_SHOTS.map((s) => (
          <button className="hero-shot" key={s.id} onClick={() => onOpenCollection(s.id)}>
            <img src={s.src} alt={s.label + ' collection'} />
            <span className="hero-shot-cap">{s.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

window.Hero = Hero
