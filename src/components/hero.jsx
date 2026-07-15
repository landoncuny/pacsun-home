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
      <div className="ph-hero" role="img" aria-label="Campaign imagery placeholder">
        <span className="ph-label">Campaign imagery — coming soon</span>
      </div>
    </section>
  )
}

window.Hero = Hero
