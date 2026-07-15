// Cart drawer. Cart shape: { "productId|colorwayIndex": quantity }
// Bundle & Save: 3+ items (by qty) from one collection = 15% off those items.

function cartTotals(cart) {
  const { byId, BUNDLE_MIN, BUNDLE_PCT } = window.DATA
  const lines = Object.entries(cart)
    .map(([key, qty]) => {
      const [pid, cIdx] = key.split('|')
      const p = byId(pid)
      return p ? { key, p, cIdx: +cIdx, qty } : null
    })
    .filter(Boolean)

  const collCount = {}
  lines.forEach((l) => (collCount[l.p.collection] = (collCount[l.p.collection] || 0) + l.qty))

  let sub = 0
  const discounts = {}
  lines.forEach((l) => {
    sub += l.p.price * l.qty
    if (collCount[l.p.collection] >= BUNDLE_MIN) {
      discounts[l.p.collection] = (discounts[l.p.collection] || 0) + l.p.price * l.qty * BUNDLE_PCT
    }
  })
  const discount = Object.values(discounts).reduce((a, b) => a + b, 0)
  return { lines, sub, discounts, discount, total: sub - discount, collCount }
}

function CartDrawer({ open, cart, onClose, onChangeQty }) {
  const { COLLECTIONS, fmt, BUNDLE_MIN } = window.DATA
  if (!open) return null
  const t = cartTotals(cart)

  return (
    <div className="sheet-scrim cart-scrim" onClick={onClose}>
      <aside className="cart" onClick={(e) => e.stopPropagation()} aria-label="Shopping cart">
        <div className="cart-head">
          <h3>Shopping Bag</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {t.lines.length === 0 ? (
          <p className="cart-empty">Your bag is empty. Build a room and shop the whole thing in one tap.</p>
        ) : (
          <>
            <ul className="cart-lines">
              {t.lines.map((l) => (
                <li key={l.key}>
                  <ProductThumb product={l.p} colorIdx={l.cIdx} size={44} />
                  <div className="cart-line-info">
                    <strong>{l.p.name}</strong>
                    <span>{l.p.colorways[l.cIdx]?.name} · {fmt(l.p.price)}</span>
                  </div>
                  <div className="cart-qty">
                    <button onClick={() => onChangeQty(l.key, -1)}>−</button>
                    <span>{l.qty}</span>
                    <button onClick={() => onChangeQty(l.key, +1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>

            {Object.entries(t.collCount)
              .filter(([, n]) => n > 0 && n < BUNDLE_MIN)
              .map(([cid, n]) => (
                <p key={cid} className="cart-nudge">
                  {BUNDLE_MIN - n} more {COLLECTIONS[cid].short} item{BUNDLE_MIN - n > 1 ? 's' : ''} unlocks 15% off.
                </p>
              ))}

            <div className="cart-totals">
              <div><span>Subtotal</span><span>{fmt(t.sub)}</span></div>
              {Object.entries(t.discounts).map(([cid, amt]) => (
                <div key={cid} className="cart-discount">
                  <span>{COLLECTIONS[cid].short} bundle −15%</span>
                  <span>−{fmt(Math.round(amt * 100) / 100)}</span>
                </div>
              ))}
              <div className="cart-grand"><span>Total</span><span>{fmt(Math.round(t.total * 100) / 100)}</span></div>
            </div>
            <button className="btn btn-primary btn-lg cart-checkout" onClick={() => alert('Demo only — checkout not wired up.')}>
              Checkout
            </button>
          </>
        )}
      </aside>
    </div>
  )
}

window.CartDrawer = CartDrawer
window.cartTotals = cartTotals
