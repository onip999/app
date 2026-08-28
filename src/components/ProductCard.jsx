import ProductVisual from './ProductVisual.jsx'

const money = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

function totalPrice(offer) {
  return Number(offer.price || 0) + Number(offer.shipping_cost || 0)
}

export default function ProductCard({ product, onCompare }) {
  const bestOffer = product.offers?.[0]
  const offerCount = product.offers?.length || 0

  return (
    <article className="product-card">
      <ProductVisual product={product} />

      <div className="product-content">
        <div className="card-meta">
          <span className="category-chip">{product.category}</span>
          {offerCount > 0 && <span className="offer-count">{offerCount} offerte</span>}
        </div>
        <h2>{product.brand} {product.name}</h2>
        <p>{product.description || 'Confronta tutte le offerte disponibili.'}</p>

        <div className="product-footer">
          <div>
            <span className="from-label">Prezzo più basso</span>
            <strong>{bestOffer ? money.format(totalPrice(bestOffer)) : 'N/D'}</strong>
            {bestOffer?.stores?.name && <small>su {bestOffer.stores.name}</small>}
          </div>

          <button
            className="secondary-button"
            onClick={() => onCompare(product)}
            disabled={!bestOffer}
          >
            Vedi confronto →
          </button>
        </div>
      </div>
    </article>
  )
}
