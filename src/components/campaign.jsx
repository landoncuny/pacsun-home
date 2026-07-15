const LOOKS = [
  { preset: 'y2k-glow', title: 'Y2K Glow', bg: 'linear-gradient(135deg,#ff4fd8,#d4ff3f)', emoji: '✨' },
  { preset: 'poster-wall', title: 'Poster Wall', bg: 'linear-gradient(135deg,#9cc4ff,#ff8fd6)', emoji: '🖼️' },
  { preset: 'neutral-era', title: 'Neutral Era', bg: 'linear-gradient(135deg,#e3d5bd,#c67d54)', emoji: '🤍' },
  { preset: 'coffee-bar', title: 'Coffee Bar Corner', bg: 'linear-gradient(135deg,#b7c9a1,#efe6d6)', emoji: '🍵' },
  { preset: 'f1-racer', title: 'F1 Racer', bg: 'linear-gradient(135deg,#ff4d4d,#17171a)', emoji: '🏁' },
]

const DROPS = [
  { date: 'JUL 18 · 7PM PT', theme: 'Dorm Kit restock + live room build' },
  { date: 'JUL 25 · 7PM PT', theme: 'Neutral Era: bedding + blanket drop' },
  { date: 'AUG 01 · 6PM PT', theme: 'F1 Racer kids room — full reveal' },
]

function Campaign({ onShopLook }) {
  const { PRESETS } = window.DATA
  return (
    <div className="section campaign">
      <p className="section-kicker">04 — Campaign &amp; community</p>
      <h2 className="section-title">IRL + on your feed.</h2>

      <div className="camp-cards">
        <article className="camp-card camp-popup">
          <span className="camp-tag">ON CAMPUS</span>
          <h3>Move-In Day Pop-Up</h3>
          <p>
            We're taking over 20 campuses this August. Pull up for <strong>free Cloud blankets</strong> (first
            200), a photo room, and an entry into the <strong>full dorm-makeover raffle</strong>.
          </p>
          <a className="btn btn-ghost" href="https://www.pacsun.com" target="_blank" rel="noreferrer">
            See the campus list →
          </a>
        </article>

        <article className="camp-card camp-looks">
          <span className="camp-tag">SWIPE</span>
          <h3>Shop the Look</h3>
          <p>Five room vibes, each one tap-to-shop.</p>
          <div className="looks-scroll">
            {LOOKS.map((l) => {
              const preset = PRESETS.find((p) => p.id === l.preset)
              return (
                <button
                  key={l.preset}
                  className="look-card"
                  style={{ background: l.bg }}
                  onClick={() => onShopLook(preset.collection, preset.id)}
                >
                  <span className="look-emoji">{l.emoji}</span>
                  <span className="look-title">{l.title}</span>
                  <span className="look-cta">Tap to shop ↗</span>
                </button>
              )
            })}
          </div>
        </article>

        <article className="camp-card camp-live">
          <span className="camp-tag">LIVE</span>
          <h3>Live Room Drops on TikTok Shop</h3>
          <ul className="drop-list">
            {DROPS.map((d) => (
              <li key={d.date}>
                <span className="drop-date">{d.date}</span>
                <span>{d.theme}</span>
              </li>
            ))}
          </ul>
          <a className="btn btn-primary" href="https://www.tiktok.com/@pacsun" target="_blank" rel="noreferrer">
            Follow @pacsun for drop alerts
          </a>
        </article>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-brand">PACSUN HOME</p>
      <div className="footer-cal">
        <p className="footer-cal-title">Seasonal drop calendar</p>
        <div className="footer-cal-row">
          <span className="footer-season">SS DROP · JAN–MAR</span>
          <span>“Refresh” — new year, new room energy</span>
        </div>
        <div className="footer-cal-row is-now">
          <span className="footer-season">FW DROP · JUL–AUG</span>
          <span>“Back to School + Holiday Hosting” — live now 🔥</span>
        </div>
      </div>
      <p className="footer-fine">
        PacSun Home concept demo. Not affiliated with actual PacSun inventory. Built for vibes.
      </p>
    </footer>
  )
}

window.Campaign = Campaign
window.Footer = Footer
