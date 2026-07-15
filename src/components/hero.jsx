function Hero({ onBuild, onQuiz }) {
  return (
    <section className="hero" id="top">
      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>
              ✦ NEW DROP — PACSUN HOME ✦ BEDDING ✦ RUGS ✦ LED GLOW ✦ MATCHA SETS ✦ RECORD PLAYERS ✦
              DORM KITS ✦ F1 ROOMS&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="hero-inner">
        <p className="hero-kicker">The home collection by PacSun</p>
        <h1 className="hero-title">
          WEAR
          <br />
          YOUR
          <br />
          <span className="hero-title-outline">ROOM.</span>
        </h1>
        <p className="hero-sub">Your fit. Your space. Same energy.</p>
        <div className="hero-ctas">
          <button className="btn btn-primary btn-lg" onClick={onBuild}>
            Build Your Room 🛠️
          </button>
          <button className="btn btn-ghost btn-lg" onClick={onQuiz}>
            Take the Style Quiz →
          </button>
        </div>
        <div className="hero-stars" aria-hidden="true">
          <span className="s1">✦</span>
          <span className="s2">✧</span>
          <span className="s3">✦</span>
          <span className="s4">★</span>
        </div>
      </div>

      <div className="hero-checker" aria-hidden="true" />
    </section>
  )
}

window.Hero = Hero
