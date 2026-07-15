const { useState: useStateC } = React

// Grey placeholder tile — stands in for product mockups until real
// imagery is dropped in. Shows the category + selected colorway strip.
function ProductThumb({ product, colorIdx = 0, size, ratio }) {
  const hex = product.colorways[colorIdx]?.hex || '#eee'
  const style = size ? { width: size, height: size } : { aspectRatio: ratio || '3 / 4', width: '100%' }
  return (
    <span className="ph-tile" style={style} aria-hidden="true">
      <span className="ph-label">{product.category.replace('-', ' ')}</span>
      <span className="ph-swatch" style={{ background: hex }} />
    </span>
  )
}

function BundleBanner({ count, collectionName }) {
  const { BUNDLE_MIN } = window.DATA
  const unlocked = count >= BUNDLE_MIN
  return (
    <div className={'bundle-banner' + (unlocked ? ' is-unlocked' : '')}>
      {unlocked ? (
        <><strong>Bundle unlocked.</strong> 15% off your {collectionName} picks — applied in your bag.</>
      ) : (
        <><strong>Bundle &amp; Save:</strong> {BUNDLE_MIN}+ {collectionName} items = 15% off. ({count}/{BUNDLE_MIN})</>
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
      <h2 className="section-title">Pick your collection.</h2>
      <p className="section-sub">Choosing a collection filters the whole site — catalog, room presets, quiz results and bundles.</p>

      <div className="coll-cards">
        {Object.values(COLLECTIONS).map((c) => (
          <button
            key={c.id}
            className={'coll-card' + (collection === c.id ? ' is-selected' : '')}
            onClick={() => onSelect(c.id)}
          >
            <span className="coll-media ph-tile">
              <span className="ph-label">{c.short} lookbook</span>
            </span>
            <span className="coll-meta">
              <span className="coll-ages">
                Ages {c.ages}
                {c.flagship && <em className="coll-flag">Flagship</em>}
              </span>
              <span className="coll-name">{c.name}</span>
              <span className="coll-tagline">{c.tagline}</span>
              <span className="coll-vibes">{c.vibe.join(' · ')}</span>
              <span className="coll-cta">{collection === c.id ? 'Selected' : 'Shop this collection'}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="coll-grid-head">
        <h3>The {active.short} collection</h3>
        <BundleBanner count={cartCollectionCount} collectionName={active.short} />
      </div>

      <div className="product-grid">
        {products.map((p) => {
          const ci = colorSel[p.id] || 0
          return (
            <article key={p.id} className="product-card">
              <div className="product-media">
                {p.category === 'kit' && <span className="product-tag">Complete Kit</span>}
                <ProductThumb product={p} colorIdx={ci} />
              </div>
              <div className="product-info">
                <h4>{p.name}</h4>
                <p className="product-price">{fmt(p.price)}</p>
                <p className="product-colorway">{p.colorways[ci]?.name}</p>
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
                  Add to Bag
                </button>
                <button className="link-btn" onClick={() => onViewInRoom(p.id, ci)}>
                  View in Your Room
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
