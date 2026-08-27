import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase.js'
import { demoProducts } from './demoData.js'
import ProductCard from './components/ProductCard.jsx'
import ProductVisual from './components/ProductVisual.jsx'
import OfferCard from './components/OfferCard.jsx'
import SetupNotice from './components/SetupNotice.jsx'

function sortOffers(products) {
  return products.map((product) => ({
    ...product,
    offers: [...(product.offers || [])].sort((a, b) => {
      const aTotal = Number(a.price || 0) + Number(a.shipping_cost || 0)
      const bTotal = Number(b.price || 0) + Number(b.shipping_cost || 0)
      return aTotal - bTotal
    }),
  }))
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
    return (
      <div className="app-shell">
        <header className="topbar">
          <button className="brand-button" onClick={() => setSelectedProduct(null)}>
            PricePilot
          </button>
          <span className="demo-pill">MVP</span>
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
                <p className="eyebrow">CONFRONTO</p>
                <h2>Prezzo e condizioni</h2>
              </div>
              <span>{selectedProduct.offers?.length || 0} offerte</span>
            </div>

            {!selectedProduct.offers?.length ? (
              <div className="empty-state">Nessuna offerta disponibile.</div>
            ) : (
              <div className="offers-list">
                {selectedProduct.offers.map((offer, index) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    isBest={index === 0}
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
        <div className="brand">PricePilot</div>
        <span className="demo-pill">MVP</span>
      </header>

      <main className="container">
        <section className="intro">
          <p className="eyebrow">PREZZO + CONDIZIONI</p>
          <h1>Scegli l'offerta che conviene davvero.</h1>
          <p>
            Confronta prezzo, spedizione, reso e garanzia in un'unica schermata.
          </p>
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
            placeholder="Cerca prodotto o marca…"
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
        MVP gratuito · I dati demo servono solo per testare l'app
      </footer>
    </div>
  )
}

