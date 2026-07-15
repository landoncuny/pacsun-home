const LOOKS = [
  { preset: 'y2k-glow', title: 'Glow Setup' },
  { preset: 'poster-wall', title: 'Poster Wall' },
  { preset: 'neutral-era', title: 'Neutral Era' },
  { preset: 'coffee-bar', title: 'Coffee Bar Corner' },
  { preset: 'f1-racer', title: 'Race Day' },
]

const DROPS = [
  { date: 'JUL 18 · 7PM PT', theme: 'Dorm Kit restock + live room build' },
  { date: 'JUL 25 · 7PM PT', theme: 'Neutral Era: bedding + throw drop' },
  { date: 'AUG 01 · 6PM PT', theme: 'Kids racing room — full reveal' },
]

function Campaign({ onShopLook }) {
  const { PRESETS } = window.DATA
  return (
    <div className="section campaign">
      <p className="section-kicker">04 — Campaign &amp; community</p>
      <h2 className="section-title">On campus + on your feed.</h2>

      <div className="camp-cards">
        <article className="camp-card">
          <span className="camp-tag">On Campus</span>
          <h3>Move-In Day Pop-Up</h3>
          <p>
            We're taking over 20 campuses this August. Pull up for <strong>free throw blankets</strong> (first
            200), a photo room, and an entry into the <strong>full dorm-makeover raffle</strong>.
          </p>
          <a className="btn btn-ghost" href="https://www.pacsun.com" target="_blank" rel="noreferrer">
            See the campus list
          </a>
        </article>

        <article className="camp-card camp-looks">
          <span className="camp-tag">Swipe</span>
          <h3>Shop the Look</h3>
          <p>Five room looks, each one tap-to-shop.</p>
          <div className="looks-scroll">
            {LOOKS.map((l) => {
              const preset = PRESETS.find((p) => p.id === l.preset)
              return (
                <button
                  key={l.preset}
                  className="look-card"
                  onClick={() => onShopLook(preset.collection, preset.id)}
                >
                  <span className="look-media ph-tile">
                    <span className="ph-label">Look photo</span>
                  </span>
                  <span className="look-title">{l.title}</span>
                  <span className="look-cta">Tap to shop</span>
                </button>
              )
            })}
          </div>
        </article>

        <article className="camp-card">
          <span className="camp-tag">Live</span>
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
          <span className="footer-season">SS Drop · Jan–Mar</span>
          <span>"Refresh" — new year, new room energy</span>
        </div>
        <div className="footer-cal-row is-now">
          <span className="footer-season">FW Drop · Jul–Aug</span>
          <span>"Back to School + Holiday Hosting" — live now</span>
        </div>
      </div>
      <p className="footer-fine">
        PacSun Home concept demo. Not affiliated with actual PacSun inventory.
      </p>
    </footer>
  )
}

window.Campaign = Campaign
window.Footer = Footer
