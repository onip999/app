const money = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })
const shortDate = new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short' })

function dailyMinimums(history) {
  const days = new Map()
  for (const point of history) {
    const date = new Date(point.recorded_at)
    const key = date.toISOString().slice(0, 10)
    const value = Number(point.total_price)
    const saved = days.get(key)
    if (!saved || value < saved.value) days.set(key, { date, value })
  }
  return [...days.values()].sort((a, b) => a.date - b.date)
}

export default function PriceHistoryChart({ history, currentPrice }) {
  const points = dailyMinimums(history)
  const values = points.map(point => point.value)
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  const range = Math.max(maximum - minimum, 1)
  const width = 720
  const height = 210
  const padding = 24
  const x = index => points.length === 1 ? width / 2 : padding + index * ((width - padding * 2) / (points.length - 1))
  const y = value => height - padding - ((value - minimum) / range) * (height - padding * 2)
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(point.value)}`).join(' ')

  return (
    <section className="history-panel">
      <div className="history-heading">
        <div><p className="eyebrow">STORICO PREZZI</p><h2>Andamento del miglior prezzo</h2></div>
        <div className="history-summary"><span>Minimo registrato</span><strong>{money.format(minimum)}</strong></div>
      </div>
      <div className={`history-chart ${points.length === 1 ? 'single-point' : ''}`}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Grafico dello storico prezzi">
          <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} className="chart-axis" />
          {points.length > 1 && <path d={path} className="chart-line" />}
          {points.map((point, index) => <g key={point.date.toISOString()}><circle cx={x(index)} cy={y(point.value)} r="6" className="chart-dot" /><title>{shortDate.format(point.date)}: {money.format(point.value)}</title></g>)}
        </svg>
        <div className="chart-labels"><span>{shortDate.format(points[0].date)}</span>{points.length>1&&<span>{shortDate.format(points.at(-1).date)}</span>}</div>
      </div>
      <p className="history-note">{points.length === 1 ? 'Prima rilevazione registrata. Il grafico crescerà con i prossimi aggiornamenti di prezzo.' : `${points.length} rilevazioni giornaliere · prezzo attuale ${currentPrice ? money.format(currentPrice) : 'N/D'}`}</p>
    </section>
  )
}

