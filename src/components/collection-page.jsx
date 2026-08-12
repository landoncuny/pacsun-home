const { useState: useStateP, useMemo: useMemoP, useEffect: useEffectP } = React

// A single collection's storefront — the PacSun Mens/Womens split applied here.
// Landing shows only entry points; all product for a collection lives on this page.
function CollectionPage({
  collection,
  category,
  bundleCount,
  presetReq,
  initialRoom,
  onOpenCollection,
  onHome,
  onAddToCart,
  onViewInRoom,
  onShopRoom,
  buildRef,
}) {
  const { COLLECTIONS, gridProducts, categoriesFor, collectionList } = window.DATA
  const c = COLLECTIONS[collection]
  const [cat, setCat] = useStateP(category || null)

  // The URL owns the filter: it changes on collection switch and on a
  // category link from the Shop dropdown.
  useEffectP(() => setCat(category || null), [collection, category])

  const all = useMemoP(() => gridProducts(collection), [collection])
  const cats = useMemoP(() => categoriesFor(collection), [collection])
  const shown = cat ? all.filter((p) => p.category === cat) : all
  const others = collectionList().filter((x) => x.id !== collection)

  return (
    <div className="coll-page">
      <div className="coll-page-head">
        <div className="coll-page-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <button className="link-btn" onClick={onHome}>PacSun Home</button>
            <span aria-hidden="true">/</span>
            <span className="crumbs-here">{c.name}</span>
          </nav>

          <div className="coll-page-id">
            <h1 className="coll-page-title">{c.name}</h1>
            <p className="coll-page-tagline">{c.tagline}</p>
            <p className="coll-page-meta">
              {all.length} {all.length === 1 ? 'piece' : 'pieces'}
              {c.flagship && <em className="coll-flag">Flagship</em>}
            </p>
          </div>

          {/* Palette only — Pantone codes stay internal, per the storefront
              decision in the previous release. */}
          <div className="coll-page-palette" aria-hidden="true">
            {c.pantone.map((p) => (
              <span key={p.code} className="palette-swatch" style={{ background: p.hex }} title={p.name} />
            ))}
          </div>
        </div>
      </div>

      <div className="coll-page-inner coll-page-body">
        {cats.length > 1 && (
          <div className="cat-filter" role="group" aria-label="Filter by category">
            <button
              className={'cat-chip' + (cat === null ? ' is-on' : '')}
              onClick={() => setCat(null)}
            >
              All ({all.length})
            </button>
            {cats.map((x) => (
              <button
                key={x.category}
                className={'cat-chip' + (cat === x.category ? ' is-on' : '')}
                onClick={() => setCat(x.category)}
              >
                {x.label} ({all.filter((p) => p.category === x.category).length})
              </button>
            ))}
          </div>
        )}

        {bundleCount > 0 && (
          <div className="coll-page-bundle">
            <BundleBanner count={bundleCount} collectionName={c.short} />
          </div>
        )}

        <div className="product-grid">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onViewInRoom={onViewInRoom} />
          ))}
        </div>
      </div>

      <section ref={buildRef} data-section="build" className="coll-page-build">
        <RoomBuilder
          collection={collection}
          presetReq={presetReq}
          initialRoom={initialRoom}
          onShopRoom={onShopRoom}
          onViewInRoom={onViewInRoom}
        />
      </section>

      <div className="coll-page-inner coll-page-next">
        <p className="section-kicker">Keep shopping</p>
        <div className="next-cards">
          {others.map((o) => (
            <button key={o.id} className="next-card" onClick={() => onOpenCollection(o.id)}>
              <span className="next-card-name">{o.name}</span>
              <span className="next-card-tag">{o.tagline}</span>
              <span className="next-card-cta">Shop {o.short} →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

window.CollectionPage = CollectionPage
