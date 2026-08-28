import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase.js'
import { demoProducts } from './demoData.js'
import ProductCard from './components/ProductCard.jsx'
import ProductVisual from './components/ProductVisual.jsx'
import OfferCard from './components/OfferCard.jsx'
import SetupNotice from './components/SetupNotice.jsx'
import PriceHistoryChart from './components/PriceHistoryChart.jsx'

const money = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
function totalPrice(offer) { return Number(offer.price || 0) + Number(offer.shipping_cost || 0) }
function sortOffers(products) { return products.map((product) => ({ ...product, offers: [...(product.offers || [])].sort((a,b) => totalPrice(a)-totalPrice(b)) })) }
function convenienceScore(offer, offers) {
  const totals=offers.map(totalPrice), min=Math.min(...totals), max=Math.max(...totals), total=totalPrice(offer)
  const priceScore=max===min?10:10-((total-min)/(max-min))*3, store=offer.stores||{}
  const returnScore=Math.min(Number(store.return_days||0)/30,1)*1.2
  const warrantyScore=Math.min(Number(store.warranty_months||0)/24,1)*1.2
  const shippingScore=Number(offer.shipping_cost||0)===0?0.6:0
  const availabilityScore=/disponibile|pronta|immediata/i.test(offer.availability||'')?0.4:0
  return Math.min(10,Math.round((priceScore*.66+returnScore+warrantyScore+shippingScore+availabilityScore)*10)/10)
}
function productHistory(product) {
  return (product.offers || [])
    .flatMap(offer => offer.price_history || [])
    .map(point => ({ ...point, total_price: Number(point.total_price ?? (Number(point.price || 0) + Number(point.shipping_cost || 0))) }))
    .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at))
}
function priceInsight(product) {
  const history=productHistory(product).map(point => point.total_price)
  const current=product.offers?.[0]?totalPrice(product.offers[0]):null
  if (!current || history.length<2) return null
  const average=history.reduce((a,b)=>a+Number(b),0)/history.length
  const historicalMin=Math.min(...history)
  const difference=((current-average)/average)*100
  let label='Buon prezzo', tone='good', message='Il prezzo attuale è vicino alla media recente.'
  if (difference<=-8) { label='Ottimo prezzo'; tone='great'; message='Il prezzo attuale è nettamente sotto la media recente.' }
  else if (difference>6) { label='Aspetta'; tone='wait'; message='Il prezzo attuale è sopra la media recente.' }
  return { current, average, historicalMin, difference, label, tone, message }
}

export default function App(){
 const [products,setProducts]=useState(sortOffers(demoProducts)),[selectedProduct,setSelectedProduct]=useState(null),[query,setQuery]=useState(''),[category,setCategory]=useState('Tutte'),[loading,setLoading]=useState(isSupabaseConfigured),[error,setError]=useState('')
 async function loadProducts(){
  if(!isSupabaseConfigured||!supabase){setProducts(sortOffers(demoProducts));setLoading(false);return}
  setLoading(true);setError('')
  const {data,error:fetchError}=await supabase.from('products').select(`id,brand,name,category,description,image_url,offers(id,price,shipping_cost,availability,product_url,updated_at,price_history(price,shipping_cost,total_price,recorded_at),stores(id,name,website_url,return_days,warranty_months,shipping_notes))`).order('brand',{ascending:true})
  if(fetchError){setError(fetchError.message);setProducts(sortOffers(demoProducts))}else setProducts(sortOffers(data||[]));setLoading(false)
 }
 useEffect(()=>{loadProducts()},[])
 const categories=useMemo(()=>['Tutte',...new Set(products.map(p=>p.category).filter(Boolean))],[products])
 const filteredProducts=useMemo(()=>{const term=query.trim().toLowerCase();return products.filter(p=>(category==='Tutte'||p.category===category)&&(!term||`${p.brand} ${p.name} ${p.category}`.toLowerCase().includes(term)))},[products,query,category])
 async function trackClick(offerId){if(!supabase||String(offerId).startsWith('demo-'))return;const{error:clickError}=await supabase.from('clicks').insert({offer_id:offerId});if(clickError)console.warn('Tracking click non riuscito:',clickError.message)}
 function openStore(offer){window.open(offer.product_url,'_blank','noopener,noreferrer');trackClick(offer.id)}
 if(selectedProduct){
  const offers=selectedProduct.offers||[],history=productHistory(selectedProduct),scoredOffers=offers.map(offer=>({offer,score:convenienceScore(offer,offers)})),recommendedId=[...scoredOffers].sort((a,b)=>b.score-a.score)[0]?.offer?.id,insight=priceInsight(selectedProduct)
  return <div className="app-shell"><header className="topbar"><button className="brand-button" onClick={()=>setSelectedProduct(null)}><span className="brand-mark">C</span> Comparing</button><span className="demo-pill">BETA</span></header><main className="container">
   <button className="back-button" onClick={()=>setSelectedProduct(null)}>← Torna ai prodotti</button>
   <section className="product-hero"><ProductVisual product={selectedProduct}/><div><span className="category-chip">{selectedProduct.category}</span><h1>{selectedProduct.brand} {selectedProduct.name}</h1><p>{selectedProduct.description||'Confronta le offerte disponibili.'}</p></div></section>
   {insight&&<section className={`price-insight ${insight.tone}`}><div><span className="insight-label">PREZZO OGGI</span><strong>{insight.label}</strong><p>{insight.message}</p></div><div className="price-stats"><div><span>Attuale</span><b>{money.format(insight.current)}</b></div><div><span>Media recente</span><b>{money.format(insight.average)}</b></div><div><span>Minimo storico</span><b>{money.format(insight.historicalMin)}</b></div></div></section>}
   {history.length>0&&<PriceHistoryChart history={history} currentPrice={offers[0]?totalPrice(offers[0]):null}/>} 
   <section><div className="section-heading"><div><p className="eyebrow">CONFRONTA DAVVERO</p><h2>Prezzo più basso e miglior acquisto</h2></div><span>{offers.length} offerte</span></div>
   {!offers.length?<div className="empty-state">Nessuna offerta disponibile.</div>:<div className="offers-list">{offers.map((offer,index)=><OfferCard key={offer.id} offer={offer} isCheapest={index===0} isRecommended={offer.id===recommendedId} score={convenienceScore(offer,offers)} onOpenStore={openStore}/>)}</div>}</section>
  </main></div>
 }
 return <div className="app-shell"><header className="topbar"><div className="brand"><span className="brand-mark">C</span> Comparing</div><span className="demo-pill">BETA</span></header><main className="container">
  <section className="intro"><p className="eyebrow">CONFRONTA. CAPISCI. SCEGLI.</p><h1>Non trovare solo il prezzo più basso. Trova l'acquisto migliore.</h1><p>Comparing mette insieme prezzo, spedizione, reso e garanzia per mostrarti sia l'offerta più economica sia quella che conviene davvero.</p><div className="value-pills"><div><span>💰</span><strong>Prezzo più basso</strong><small>Il massimo risparmio</small></div><div><span>⭐</span><strong>Miglior acquisto</strong><small>La convenienza complessiva</small></div></div></section>
  {!isSupabaseConfigured&&<SetupNotice/>}{error&&<section className="error-state"><strong>Supabase non ha risposto correttamente.</strong><span>{error}</span><span>Sto mostrando i dati demo, quindi il sito resta utilizzabile.</span><button onClick={loadProducts}>Riprova</button></section>}
  <section className="toolbar"><input type="search" placeholder="Cerca smartphone, TV, scarpe, marca…" value={query} onChange={e=>setQuery(e.target.value)}/><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(item=><option key={item}>{item}</option>)}</select></section>
  {loading&&<div className="empty-state">Caricamento prodotti…</div>}{!loading&&filteredProducts.length===0&&<div className="empty-state">Nessun prodotto trovato.</div>}{!loading&&<section className="product-grid">{filteredProducts.map(product=><ProductCard key={product.id} product={product} onCompare={setSelectedProduct}/>)}</section>}
 </main><footer>Comparing · Confronta meglio, scegli meglio</footer></div>
}

