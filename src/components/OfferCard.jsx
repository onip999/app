const money = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const dateTime = new Intl.DateTimeFormat('it-IT', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })

function totalPrice(offer) { return Number(offer.price || 0) + Number(offer.shipping_cost || 0) }

function recommendationReason(offer, isCheapest, isRecommended, cheapestTotal) {
  if (!isRecommended) return ''
  const store = offer.stores || {}
  const reasons = []
  if (Number(offer.shipping_cost || 0) === 0) reasons.push('spedizione gratuita')
  if (Number(store.return_days || 0) >= 30) reasons.push(`reso di ${store.return_days} giorni`)
  if (Number(store.warranty_months || 0) >= 24) reasons.push(`garanzia di ${store.warranty_months} mesi`)
  if (isCheapest) return reasons.length ? `È anche la più economica e include ${reasons.join(', ')}.` : 'È l’offerta più economica e ottiene anche il miglior punteggio complessivo.'
  const difference = Math.max(0, totalPrice(offer) - Number(cheapestTotal || 0))
  return reasons.length ? `Costa ${money.format(difference)} in più dell’offerta più economica, ma offre ${reasons.join(', ')}.` : `Costa ${money.format(difference)} in più, ma offre il miglior equilibrio complessivo tra prezzo e condizioni.`
}

export default function OfferCard({ offer, isCheapest, isRecommended, score, cheapestTotal, onOpenStore }) {
  const store = offer.stores
  const isAmazon = /amazon/i.test(store?.name || '')
  const shipping = Number(offer.shipping_cost || 0)
  const reason = recommendationReason(offer, isCheapest, isRecommended, cheapestTotal)
  const updatedAt = offer.updated_at ? dateTime.format(new Date(offer.updated_at)) : null

  return <article className={`offer-card ${isRecommended ? 'recommended' : ''}`}>
    <div className="offer-main"><div>
      <div className="offer-title-row"><div className="store-avatar">{(store?.name || 'N').charAt(0)}</div><h3>{store?.name || 'Negozio'}</h3>{isCheapest&&<span className="cheap-badge">💰 Prezzo più basso</span>}{isRecommended&&<span className="best-badge">⭐ Miglior acquisto</span>}</div>
      <p className="availability">● {offer.availability || 'Disponibilità non indicata'}</p>{updatedAt&&<p className="updated-at">Aggiornato {updatedAt}</p>}
    </div><div className="price-box"><strong>{money.format(totalPrice(offer))}</strong><span>{money.format(Number(offer.price))}{shipping>0?` + ${money.format(shipping)} sped.`:' · spedizione inclusa'}</span><span className="score">Convenienza <b>{score}/10</b></span></div></div>
    {reason&&<div className="recommendation-reason"><span>PERCHÉ CONVIENE</span><strong>{reason}</strong></div>}
    <div className="policy-grid"><div><span>↩ Reso</span><strong>{store?.return_days?`${store.return_days} giorni`:'N/D'}</strong></div><div><span>🛡 Garanzia</span><strong>{store?.warranty_months?`${store.warranty_months} mesi`:'N/D'}</strong></div><div><span>🚚 Spedizione</span><strong>{store?.shipping_notes||'N/D'}</strong></div></div>
    <button className="primary-button" onClick={()=>onOpenStore(offer)}>Vai al negozio →</button><p className="affiliate-note">{isAmazon ? 'Link a pagamento Amazon: Comparing può ricevere una commissione dagli acquisti idonei.' : 'Link affiliato: Comparing potrebbe ricevere una commissione, senza costi aggiuntivi per te.'}</p>
  </article>
}
