const money = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
})

function totalPrice(offer) {
  return Number(offer.price || 0) + Number(offer.shipping_cost || 0)
}

export default function OfferCard({ offer, isBest, onOpenStore }) {
  const store = offer.stores
  const shipping = Number(offer.shipping_cost || 0)

  return (
    <article className={`offer-card ${isBest ? 'best' : ''}`}>
      <div className="offer-main">
        <div>
          <div className="offer-title-row">
            <h3>{store?.name || 'Negozio'}</h3>
            {isBest && <span className="best-badge">Migliore offerta</span>}
          </div>
          <p className="availability">
            {offer.availability || 'Disponibilità non indicata'}
          </p>
        </div>

        <div className="price-box">
          <strong>{money.format(totalPrice(offer))}</strong>
          <span>
            {money.format(Number(offer.price))}
            {shipping > 0
              ? ` + ${money.format(shipping)} sped.`
              : ' · spedizione inclusa'}
          </span>
        </div>
      </div>

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
        Vai al negozio
      </button>
    </article>
  )
}

