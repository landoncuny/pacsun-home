// The eight stops on the move-in day pop-up tour, west to east, matching the
// campus map in the launch deck. Each school gets its own two official colors —
// they paint the bar on that school's card.
const CAMPUSES = [
  { name: 'UC Berkeley', city: 'Berkeley, CA', colors: ['#003262', '#FDB515'] },
  { name: 'USC', city: 'Los Angeles, CA', colors: ['#990000', '#FFC72C'] },
  { name: 'University of Arizona', city: 'Tucson, AZ', colors: ['#AB0520', '#0C234B'] },
  { name: 'Arizona State University', city: 'Tempe, AZ', colors: ['#8C1D40', '#FFC627'] },
  { name: 'CU Boulder', city: 'Boulder, CO', colors: ['#CFB87C', '#111111'] },
  { name: 'UT Austin', city: 'Austin, TX', colors: ['#BF5700', '#333F48'] },
  { name: 'Florida State University', city: 'Tallahassee, FL', colors: ['#782F40', '#CEB888'] },
  { name: 'University of Miami', city: 'Miami, FL', colors: ['#F47321', '#005030'] },
]

const PERKS = [
  { stat: '8', label: 'Campus stops' },
  { stat: '200', label: 'Free throw blankets per stop' },
  { stat: '1', label: 'Full dorm-makeover raffle' },
]

function Campaign({ onSeeCampuses }) {
  return (
    <div className="section campaign">
      <p className="section-kicker">04 — Campaign &amp; community</p>
      <h2 className="section-title">On campus.</h2>

      <article className="camp-lede">
        <div className="camp-lede-copy">
          <span className="camp-tag">On Campus</span>
          <h3>Move-In Day Pop-Up</h3>
          <p>
            We're taking over eight campuses this August. Pull up for <strong>free throw blankets</strong> (first
            200), a photo room, and an entry into the <strong>full dorm-makeover raffle</strong>.
          </p>
          <button className="btn btn-ghost" onClick={onSeeCampuses}>
            See the campus list
          </button>
        </div>
        <ul className="camp-perks">
          {PERKS.map((p) => (
            <li key={p.label}>
              <span className="camp-perk-stat">{p.stat}</span>
              <span className="camp-perk-label">{p.label}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  )
}

function CampusList({ innerRef }) {
  return (
    <div className="section campus" ref={innerRef}>
      <span className="campus-badge">Coming Jul–Aug</span>
      <p className="section-kicker">05 — Campus tour</p>
      <h2 className="section-title">Where we're popping up.</h2>
      <p className="section-sub">
        Eight schools, one move-in week each. Find your campus below — we'll post exact dates and booth
        locations closer to the drop.
      </p>

      <ul className="campus-grid">
        {CAMPUSES.map((c) => (
          <li
            key={c.name}
            className="campus-card"
            style={{ '--c1': c.colors[0], '--c2': c.colors[1] }}
          >
            <span className="campus-bar" aria-hidden="true" />
            <span className="campus-name">{c.name}</span>
            <span className="campus-city">{c.city}</span>
          </li>
        ))}
      </ul>
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
window.CampusList = CampusList
window.Footer = Footer
