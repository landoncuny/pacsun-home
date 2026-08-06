const HERO_SHOTS = [
  { src: './src/assets/bedding-pink-heart.png', label: "Women's · Dorm" },
  { src: './src/assets/bedding-navy.png', label: "Men's · Dorm" },
  { src: './src/assets/bedding-plaid-blue.png', label: 'Kids' },
]

function Hero({ onBuild, onQuiz }) {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-kicker">Introducing PacSun Home</p>
        <h1 className="hero-title">Wear your room.</h1>
        <p className="hero-sub">Your fit. Your space. Same energy.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={onBuild}>
            Build Your Room
          </button>
          <button className="btn btn-ghost btn-lg" onClick={onQuiz}>
            Take the Style Quiz
          </button>
        </div>
      </div>
      <div className="hero-shots">
        {HERO_SHOTS.map((s) => (
          <figure className="hero-shot" key={s.label}>
            <img src={s.src} alt={s.label + ' bedding'} />
            <figcaption>{s.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

window.Hero = Hero
