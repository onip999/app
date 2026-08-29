import { useState } from 'react'
import ProductVisual from './ProductVisual.jsx'

const money = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

function totalPrice(offer) {
  return Number(offer.price || 0) + Number(offer.shipping_cost || 0)
}

function quickScore(offer, offers) {
  if (!offer || !offers?.length) return null
  const totals = offers.map(totalPrice)
  const min = Math.min(...totals)
  const max = Math.max(...totals)
  const total = totalPrice(offer)
  const priceScore = max === min ? 10 : 10 - ((total - min) / (max - min)) * 3
  const store = offer.stores || {}
  const returnScore = Math.min(Number(store.return_days || 0) / 30, 1) * 1.2
  const warrantyScore = Math.min(Number(store.warranty_months || 0) / 24, 1) * 1.2
  const shippingScore = Number(offer.shipping_cost || 0) === 0 ? 0.6 : 0
  const availabilityScore = /disponibile|pronta|immediata/i.test(offer.availability || '') ? 0.4 : 0
  return Math.min(10, Math.round((priceScore * 0.66 + returnScore + warrantyScore + shippingScore + availabilityScore) * 10) / 10)
}

export default function ProductCard({ product, onCompare, isFavorite = false, onToggleFavorite }) {
  const [pressed, setPressed] = useState(false)
  const offers = product.offers || []
  const bestOffer = offers[0]
  const offerCount = offers.length
  const scored = offers.map((offer) => ({ offer, score: quickScore(offer, offers) }))
  const recommended = [...scored].sort((a, b) => (b.score || 0) - (a.score || 0))[0]

  function toggleFavorite(event) {
    event.stopPropagation()
    setPressed(true)
    setTimeout(() => setPressed(false), 180)
    onToggleFavorite?.(product.id)
  }

  return (
    <article className="product-card">
      <div className="product-media">
        <ProductVisual product={product} />
        <button
          className={`favorite-button ${isFavorite ? 'active' : ''} ${pressed ? 'pressed' : ''}`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <div className="product-content">
        <div className="card-meta">
          <span className="category-chip">{product.category}</span>
          {offerCount > 0 && <span className="offer-count">{offerCount} offerte</span>}
        </div>
        <h2>{product.brand} {product.name}</h2>
        <p>{product.description || 'Confronta tutte le offerte disponibili.'}</p>

        <div className="card-signals">
          <div>
            <span>💰 Da</span>
            <strong>{bestOffer ? money.format(totalPrice(bestOffer)) : 'N/D'}</strong>
          </div>
          {recommended?.score && (
            <div className="score-signal">
              <span>⭐ Miglior acquisto</span>
              <strong>{recommended.score}/10</strong>
            </div>
          )}
        </div>

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
