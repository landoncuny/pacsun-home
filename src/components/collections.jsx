const { useState: useStateC } = React

function ProductThumb({ product, colorIdx = 0, size = 64 }) {
  const hex = product.colorways[colorIdx]?.hex || '#eee'
  return (
    <span
      className="thumb"
      style={{ background: `linear-gradient(145deg, ${hex}, ${hex}cc)`, width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      {product.thumb}
    </span>
  )
}

function BundleBanner({ count, collectionName }) {
  const { BUNDLE_MIN } = window.DATA
  const unlocked = count >= BUNDLE_MIN
  return (
    <div className={'bundle-banner' + (unlocked ? ' is-unlocked' : '')}>
      {unlocked ? (
        <>🎉 <strong>Bundle unlocked!</strong> 15% off your {collectionName} picks — applied at cart.</>
      ) : (
        <>💰 <strong>Bundle &amp; Save:</strong> add {BUNDLE_MIN - count} more {collectionName} item{BUNDLE_MIN - count > 1 ? 's' : ''} for 15% off. ({count}/{BUNDLE_MIN})</>
      )}
    </div>
  )
}

function Collections({ collection, onSelect, onAddToCart, onViewInRoom, cartCollectionCount }) {
  const { COLLECTIONS, PRODUCTS, fmt } = window.DATA
  const [colorSel, setColorSel] = useStateC({}) // productId -> colorway index
  const products = PRODUCTS.filter((p) => p.collection === collection)
  const active = COLLECTIONS[collection]

  return (
    <div className="section collections">
      <p className="section-kicker">01 — Shop by collection</p>
      <h2 className="section-title">Pick your era.</h2>
      <p className="section-sub">Choosing a collection re-themes the whole site — catalog, room presets, quiz, bundles.</p>

      <div className="coll-cards">
        {Object.values(COLLECTIONS).map((c) => (
          <button
            key={c.id}
            className={'coll-card coll-' + c.id + (collection === c.id ? ' is-selected' : '')}
            onClick={() => onSelect(c.id)}
          >
            {c.flagship && <span className="coll-flag">★ FLAGSHIP</span>}
            <span className="coll-ages">ages {c.ages}</span>
            <span className="coll-name">{c.name}</span>
            <span className="coll-tagline">{c.tagline}</span>
            <span className="coll-vibes">
              {c.vibe.map((v) => (
                <em key={v}>{v}</em>
              ))}
            </span>
            <span className="coll-cta">{collection === c.id ? '✓ Selected' : 'Shop this →'}</span>
          </button>
        ))}
      </div>

      <div className="coll-grid-head">
        <h3>The {active.short} drop</h3>
        <BundleBanner count={cartCollectionCount} collectionName={active.short} />
      </div>

      <div className="product-grid">
        {products.map((p) => {
          const ci = colorSel[p.id] || 0
          return (
            <article key={p.id} className="product-card">
              {p.category === 'bundle' && <span className="product-tag">MOODBOARD IN A BOX</span>}
              <ProductThumb product={p} colorIdx={ci} size={72} />
              <div className="product-info">
                <h4>{p.name}</h4>
                <p className="product-price">{fmt(p.price)}</p>
                <div className="swatches">
                  {p.colorways.map((cw, i) => (
                    <button
                      key={cw.name}
                      className={'swatch' + (i === ci ? ' is-on' : '')}
                      style={{ background: cw.hex }}
                      title={cw.name}
                      onClick={() => setColorSel((s) => ({ ...s, [p.id]: i }))}
                    />
                  ))}
                </div>
              </div>
              <div className="product-actions">
                <button className="btn btn-mini" onClick={() => onAddToCart(p.id, ci)}>
                  + Add
                </button>
                <button className="btn btn-mini btn-ar" onClick={() => onViewInRoom(p.id, ci)} title="See it at true scale with your camera">
                  📷 View in room
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

window.Collections = Collections
window.ProductThumb = ProductThumb
window.BundleBanner = BundleBanner
