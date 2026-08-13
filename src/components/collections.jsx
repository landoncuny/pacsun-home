const { useState: useStateC } = React

// Product media: real photography when the SKU (or its selected colorway)
// carries an image, otherwise the original grey placeholder tile.
function ProductThumb({ product, colorIdx = 0, size, ratio }) {
  const cw = product.colorways[colorIdx] || product.colorways[0]
  const img = (cw && cw.image) || product.image
  // `size` is the caller pinning a small square — the cart line, the tray card,
  // the placed-item sheet. It has to bind on the photo too, or a photographed
  // SKU ignores it and the thumb grows to whatever the flex row will give it.
  // Unsized, the photo keeps the card crop the stylesheet gives it.
  const pinned = size ? { width: size, height: size, flex: '0 0 auto' } : undefined
  if (img) {
    return (
      <span className="product-photo" style={pinned}>
        <img src={img} alt={product.name} loading="lazy" />
        {cw && <span className="ph-swatch" style={{ background: cw.hex }} />}
      </span>
    )
  }
  const hex = (cw && cw.hex) || '#eee'
  const style = pinned || { aspectRatio: ratio || '3 / 4', width: '100%' }
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

function ProductCard({ product, onAddToCart, onViewInRoom }) {
  const { fmt } = window.DATA
  const [ci, setCi] = useStateC(0)
  const tag = product.line || (product.category === 'kit' ? 'Complete Kit' : null)
  return (
    <article className="product-card">
      <div className="product-media">
        {tag && <span className="product-tag product-line-tag">{tag}</span>}
        <ProductThumb product={product} colorIdx={ci} />
      </div>
      <div className="product-info">
        <h4>{product.name}</h4>
        <p className="product-price">{fmt(product.price)}</p>
        <p className="product-colorway">{product.colorways[ci] && product.colorways[ci].name}</p>
        <div className="swatches">
          {product.colorways.map((cw, i) => (
            <button
              key={cw.name}
              className={'swatch' + (i === ci ? ' is-on' : '')}
              style={{ background: cw.hex }}
              title={cw.name}
              onClick={() => setCi(i)}
            />
          ))}
        </div>
      </div>
      <div className="product-actions">
        <button className="btn btn-mini" onClick={() => onAddToCart(product.id, ci)}>
          Add to Bag
        </button>
        <button className="link-btn" onClick={() => onViewInRoom(product.id, ci)}>
          View in Your Room
        </button>
      </div>
    </article>
  )
}

// Landing page: the three collections as entry points only. No product grids —
// product lives on the collection pages at #/home, #/dorm and #/kids.
function CollectionPicker({ onOpen }) {
  const { collectionList, gridProducts } = window.DATA
  const list = collectionList()

  return (
    <div className="section collections">
      <p className="section-kicker">01 — Shop by collection</p>
      <h2 className="section-title">Three collections. Three palettes.</h2>
      <p className="section-sub">
        Each collection has its own palette, its own product and its own page. Pick where you're shopping.
      </p>

      <div className="coll-cards">
        {list.map((c) => {
          const products = gridProducts(c.id)
          const lead = products[0]
          return (
            <button key={c.id} className="coll-card" onClick={() => onOpen(c.id)}>
              <span className="coll-media">
                {lead ? (
                  <img src={lead.image} alt="" loading="lazy" />
                ) : (
                  <span className="ph-tile"><span className="ph-label">{c.short} lookbook</span></span>
                )}
                {c.flagship && <em className="coll-flag coll-flag-float">Flagship</em>}
              </span>
              <span className="coll-meta">
                <span className="coll-name">{c.name}</span>
                <span className="coll-tagline">{c.tagline}</span>
                <span className="coll-pantone">
                  {c.pantone.map((p) => (
                    <em key={p.code} className="coll-chip" style={{ background: p.hex }} title={p.name} />
                  ))}
                </span>
                <span className="coll-cta">
                  Shop {c.short} <span className="coll-count">{products.length} pieces</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

window.CollectionPicker = CollectionPicker
window.ProductCard = ProductCard
window.ProductThumb = ProductThumb
window.BundleBanner = BundleBanner
