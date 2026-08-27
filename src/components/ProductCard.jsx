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

  return (
    <article className="product-card">
      <ProductVisual product={product} />

      <div className="product-content">
        <span className="category-chip">{product.category}</span>
        <h2>{product.brand} {product.name}</h2>
        <p>{product.description || 'Confronta tutte le offerte disponibili.'}</p>

        <div className="product-footer">
          <div>
            <span className="from-label">A partire da</span>
            <strong>{bestOffer ? money.format(totalPrice(bestOffer)) : 'N/D'}</strong>
            {bestOffer?.stores?.name && <small>{bestOffer.stores.name}</small>}
          </div>

          <button
            className="secondary-button"
            onClick={() => onCompare(product)}
            disabled={!bestOffer}
          >
            Confronta
          </button>
        </div>
      </div>
    </article>
  )
}

