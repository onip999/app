const money = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

const dateTime = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function totalPrice(offer) {
  return Number(offer.price || 0) + Number(offer.shipping_cost || 0)
}

function recommendationReason(offer, isCheapest, isRecommended) {
  if (!isRecommended) return ''

  const store = offer.stores || {}
  const reasons = []

  if (Number(offer.shipping_cost || 0) === 0) reasons.push('spedizione inclusa')
  if (Number(store.return_days || 0) >= 30) reasons.push(`reso ${store.return_days} giorni`)
  if (Number(store.warranty_months || 0) >= 24) reasons.push(`garanzia ${store.warranty_months} mesi`)

  if (isCheapest) {
    return reasons.length
      ? `È anche la più economica e offre ${reasons.join(', ')}.`
      : 'È l’offerta più economica e ottiene anche il miglior punteggio complessivo.'
  }

  return reasons.length
    ? `Costa un po’ di più, ma offre ${reasons.join(', ')}.`
    : 'Non è la più economica, ma offre il miglior equilibrio complessivo tra prezzo e condizioni.'
}

export default function OfferCard({ offer, isCheapest, isRecommended, score, onOpenStore }) {
  const store = offer.stores
  const shipping = Number(offer.shipping_cost || 0)
  const reason = recommendationReason(offer, isCheapest, isRecommended)
  const updatedAt = offer.updated_at ? dateTime.format(new Date(offer.updated_at)) : null

  return (
    <article className={`offer-card ${isRecommended ? 'recommended' : ''}`}>
      <div className="offer-main">
        <div>
          <div className="offer-title-row">
            <h3>{store?.name || 'Negozio'}</h3>
            {isCheapest && <span className="cheap-badge">💰 Prezzo più basso</span>}
            {isRecommended && <span className="best-badge">⭐ Miglior acquisto</span>}
          </div>
          <p className="availability">
            {offer.availability || 'Disponibilità non indicata'}
          </p>
          {updatedAt && <p className="updated-at">Prezzo aggiornato il {updatedAt}</p>}
        </div>

        <div className="price-box">
          <strong>{money.format(totalPrice(offer))}</strong>
          <span>
            {money.format(Number(offer.price))}
            {shipping > 0
              ? ` + ${money.format(shipping)} sped.`
              : ' · spedizione inclusa'}
          </span>
          <span className="score">Convenienza <b>{score}/10</b></span>
        </div>
      </div>

      {reason && (
        <div className="recommendation-reason">
          <span>Perché conviene</span>
          <strong>{reason}</strong>
        </div>
      )}

      <div className="policy-grid">
        <div>
          <span>Reso</span>
          <strong>{store?.return_days ? `${store.return_days} giorni` : 'N/D'}</strong>
        </div>
        <div>
          <span>Garanzia</span>
          <strong>{store?.warranty_months ? `${store.warranty_months} mesi` : 'N/D'}</strong>
        </div>
        <div>
          <span>Spedizione</span>
          <strong>{store?.shipping_notes || 'N/D'}</strong>
        </div>
      </div>

      <button className="primary-button" onClick={() => onOpenStore(offer)}>
        Vai al negozio →
      </button>
      <p className="affiliate-note">
        Link affiliato: Comparing potrebbe ricevere una commissione, senza costi aggiuntivi per te.
      </p>
    </article>
  )
}

