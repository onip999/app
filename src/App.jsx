import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase.js'
import { demoProducts } from './demoData.js'
import ProductCard from './components/ProductCard.jsx'
import ProductVisual from './components/ProductVisual.jsx'
import OfferCard from './components/OfferCard.jsx'
import SetupNotice from './components/SetupNotice.jsx'

function totalPrice(offer) {
  return Number(offer.price || 0) + Number(offer.shipping_cost || 0)
}

function sortOffers(products) {
  return products.map((product) => ({
    ...product,
    offers: [...(product.offers || [])].sort((a, b) => totalPrice(a) - totalPrice(b)),
  }))
}

function convenienceScore(offer, offers) {
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

export default function App() {
  const [products, setProducts] = useState(sortOffers(demoProducts))
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tutte')
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  async function loadProducts() {
    if (!isSupabaseConfigured || !supabase) {
      setProducts(sortOffers(demoProducts))
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('products')
      .select(`
        id,
        brand,
        name,
        category,
        description,
        image_url,
        offers (
          id,
          price,
          shipping_cost,
          availability,
          product_url,
          updated_at,
          stores (
            id,
            name,
            website_url,
            return_days,
            warranty_months,
            shipping_notes
          )
        )
      `)
      .order('brand', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
      setProducts(sortOffers(demoProducts))
    } else {
      setProducts(sortOffers(data || []))
    }

    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category).filter(Boolean))]
    return ['Tutte', ...unique]
  }, [products])

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = category === 'Tutte' || product.category === category
      const haystack = `${product.brand} ${product.name} ${product.category}`.toLowerCase()
      return matchesCategory && (!term || haystack.includes(term))
    })
  }, [products, query, category])

  async function trackClick(offerId) {
    if (!supabase || String(offerId).startsWith('demo-')) return

    const { error: clickError } = await supabase
      .from('clicks')
      .insert({ offer_id: offerId })

    if (clickError) {
      console.warn('Tracking click non riuscito:', clickError.message)
    }
  }

  function openStore(offer) {
    window.open(offer.product_url, '_blank', 'noopener,noreferrer')
    trackClick(offer.id)
  }

  if (selectedProduct) {
    const offers = selectedProduct.offers || []
    const scoredOffers = offers.map((offer) => ({ offer, score: convenienceScore(offer, offers) }))
    const recommendedId = scoredOffers.sort((a, b) => b.score - a.score)[0]?.offer?.id

    return (
      <div className="app-shell">
        <header className="topbar">
          <button className="brand-button" onClick={() => setSelectedProduct(null)}>
            <span className="brand-mark">C</span> Comparing
          </button>
          <span className="demo-pill">BETA</span>
        </header>

        <main className="container">
          <button className="back-button" onClick={() => setSelectedProduct(null)}>
            ← Torna ai prodotti
          </button>

          <section className="product-hero">
            <ProductVisual product={selectedProduct} />
            <div>
              <span className="category-chip">{selectedProduct.category}</span>
              <h1>{selectedProduct.brand} {selectedProduct.name}</h1>
              <p>{selectedProduct.description || 'Confronta le offerte disponibili.'}</p>
            </div>
          </section>

          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">CONFRONTA DAVVERO</p>
                <h2>Prezzo più basso e miglior acquisto</h2>
              </div>
              <span>{offers.length} offerte</span>
            </div>

            {!offers.length ? (
              <div className="empty-state">Nessuna offerta disponibile.</div>
            ) : (
              <div className="offers-list">
                {offers.map((offer, index) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    isCheapest={index === 0}
                    isRecommended={offer.id === recommendedId}
                    score={convenienceScore(offer, offers)}
                    onOpenStore={openStore}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">C</span> Comparing</div>
        <span className="demo-pill">BETA</span>
      </header>

      <main className="container">
        <section className="intro">
          <p className="eyebrow">CONFRONTA. CAPISCI. SCEGLI.</p>
          <h1>Non trovare solo il prezzo più basso. Trova l'acquisto migliore.</h1>
          <p>
            Comparing mette insieme prezzo, spedizione, reso e garanzia per mostrarti sia l'offerta più economica sia quella che conviene davvero.
          </p>
          <div className="value-pills">
            <div><span>💰</span><strong>Prezzo più basso</strong><small>Il massimo risparmio</small></div>
            <div><span>⭐</span><strong>Miglior acquisto</strong><small>La convenienza complessiva</small></div>
          </div>
        </section>

        {!isSupabaseConfigured && <SetupNotice />}

        {error && (
          <section className="error-state">
            <strong>Supabase non ha risposto correttamente.</strong>
            <span>{error}</span>
            <span>Sto mostrando i dati demo, quindi il sito resta utilizzabile.</span>
            <button onClick={loadProducts}>Riprova</button>
          </section>
        )}

        <section className="toolbar">
          <input
            type="search"
            placeholder="Cerca smartphone, TV, scarpe, marca…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </section>

        {loading && <div className="empty-state">Caricamento prodotti…</div>}

        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">Nessun prodotto trovato.</div>
        )}

        {!loading && (
          <section className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCompare={setSelectedProduct}
              />
            ))}
          </section>
        )}
      </main>

      <footer>
        Comparing · Confronta meglio, scegli meglio
      </footer>
    </div>
  )
}
