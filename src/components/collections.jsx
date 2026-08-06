const { useState: useStateC } = React

// Product media: real photography when the SKU (or its selected colorway)
// carries an image, otherwise the original grey placeholder tile.
function ProductThumb({ product, colorIdx = 0, size, ratio }) {
  const cw = product.colorways[colorIdx] || product.colorways[0]
  const img = (cw && cw.image) || product.image
  if (img) {
    return (
      <span className="product-photo">
        <img src={img} alt={product.name} loading="lazy" />
        {cw && <span className="ph-swatch" style={{ background: cw.hex }} />}
      </span>
    )
  }
  const hex = (cw && cw.hex) || '#eee'
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

// One full-width band per collection: its own rule and product grid.
function CollectionBand({ collection: c, index, products, bundleCount, onAddToCart, onViewInRoom, onBuildRoom }) {
  return (
    <section className={'coll-band' + (index % 2 === 1 ? ' is-shaded' : '')} id={'collection-' + c.id}>
      <div className="coll-band-inner">
        <header className="coll-band-head">
          <div className="coll-band-id">
            <p className="coll-band-kicker">
              Collection {String(index + 1).padStart(2, '0')}
              {c.flagship && <em className="coll-flag">Flagship</em>}
            </p>
            <h3 className="coll-band-title">{c.name}</h3>
            <p className="coll-band-tagline">{c.tagline}</p>
          </div>
          <div className="coll-band-colors">
            <button className="link-btn coll-band-build" onClick={onBuildRoom}>
              Build {/^[aeiou]/i.test(c.short) ? 'an' : 'a'} {c.short} room
            </button>
          </div>
        </header>

        {bundleCount > 0 && (
          <div className="coll-band-bundle">
            <BundleBanner count={bundleCount} collectionName={c.short} />
          </div>
        )}

        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onViewInRoom={onViewInRoom} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Collections({ collection, onSelect, onAddToCart, onViewInRoom, cartCountsByCollection = {} }) {
  const { PRODUCTS, collectionList } = window.DATA
  const list = collectionList()

  return (
    <div>
      <div className="section collections">
        <p className="section-kicker">01 — Shop by collection</p>
        <h2 className="section-title">Three collections. Three palettes.</h2>
        <p className="section-sub">
          Each collection has its own palette. Pick one to filter the room builder, presets and bundles.
        </p>

        <div className="coll-cards">
          {list.map((c) => (
            <button
              key={c.id}
              className={'coll-card' + (collection === c.id ? ' is-selected' : '')}
              onClick={() => onSelect(c.id)}
            >
              <span className="coll-media ph-tile">
                <span className="ph-label">{c.short} lookbook</span>
              </span>
              <span className="coll-meta">
                {c.flagship && (
                  <span className="coll-ages">
                    <em className="coll-flag">Flagship</em>
                  </span>
                )}
                <span className="coll-name">{c.name}</span>
                <span className="coll-tagline">{c.tagline}</span>
                <span className="coll-vibes">{c.vibe.join(' · ')}</span>
                <span className="coll-cta">{collection === c.id ? 'Selected' : 'Shop this collection'}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {list.map((c, i) => (
        <CollectionBand
          key={c.id}
          collection={c}
          index={i}
          products={PRODUCTS.filter((p) => p.collection === c.id)}
          bundleCount={cartCountsByCollection[c.id] || 0}
          onAddToCart={onAddToCart}
          onViewInRoom={onViewInRoom}
          onBuildRoom={() => onSelect(c.id, { build: true })}
        />
      ))}
    </div>
  )
}

window.Collections = Collections
window.CollectionBand = CollectionBand
window.ProductThumb = ProductThumb
window.BundleBanner = BundleBanner
