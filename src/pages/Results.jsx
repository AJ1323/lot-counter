// Must match Counting.jsx
const REGULAR_CLASSES = ['A/B', 'C', 'D/E', 'F', 'W', 'S', 'Z', 'L', 'V', 'P/XV', 'K',
  'XC', 'XB', 'XF', 'XG', 'XH', 'XD', 'XP', 'XK', 'XW', 'XS', 'XL', 'XA', 'XE', 'XZ']

const UNIVERSAL_CLASSES = ['PM', 'REG', 'DETAIL', 'WHSL/SELL/TRBK', 'OOS/Recall',
  'SOLD', 'TIRE', 'PARTS/BD/GLASS', 'NO KEY']

const ALL_CLASSES = [...REGULAR_CLASSES, ...UNIVERSAL_CLASSES]

const CLASS_COLORS = {
  'A/B':        '#4ade80',
  'C':          '#60a5fa',
  'D/E':        '#f59e0b',
  'F':          '#f87171',
  'W':          '#a78bfa',
  'S':          '#34d399',
  'Z':          '#fb923c',
  'L':          '#2ba4d7',
  'V':          '#024968',
  'K':          '#8f1923',
  'XC':         '#0962f1',
  'XB':         '#386038',
  'XF':         '#09f1de',
  'XG':         '#2009f1',
  'XH':         '#9009f1',
  'XD':         '#f1099c',
  'XP':         '#a7f109',
  'XK':         '#f1e509',
  'XW':         '#f1a709',
  'XS':         '#f18509',
  'XL':         '#f14b09',
  'XA':         '#153456',
  'XE':         '#126279',
  'XZ':         '#09f1ca',
  'PM':         '#f109c6',
  'REG':       '#a53b75',
  'DETAIL':       '#ad4b77',
  'WHSL/SELL/TRBK':       '#f10909',
  'OOS/RECALL':       '#0df109',
  'SOLD': '#f472b6',
  'TIRE':         '#e879f9',
  'PARTS/BD/GLASS':       '#0df109',
  'NO KEY':       '#0df109',
}
 
// PAGE 3 — results with color fill bars scaled relative to the highest count.
// The grade with the most presses = 100% fill. Every other grade is a
// percentage of that maximum, so proportions are visually obvious at a glance.
export default function Results({ lotName, counts, onNextLot, isReviewing }) {
  const clean = counts.clean ?? {}
  const dirty = counts.dirty ?? {}
  const universal = counts.universal ?? {}

  const cleanTotal = Object.values(clean).reduce((a, b) => a + b, 0)
  const dirtyTotal = Object.values(dirty).reduce((a, b) => a + b, 0)
  const universalTotal = Object.values(universal).reduce((a, b) => a + b, 0)
  const grandTotal = cleanTotal + dirtyTotal + universalTotal

  // Separate max baselines for each column so fills are relative within their own list
  const maxClean = Math.max(...REGULAR_CLASSES.map(g => clean[g] ?? 0), 1)
  const maxDirty = Math.max(...REGULAR_CLASSES.map(g => dirty[g] ?? 0), 1)
  const maxUniversal = Math.max(...UNIVERSAL_CLASSES.map(g => universal[g] ?? 0), 1)

  return (
    <div className="page results-page">
      <div className="results-inner">

        <div className="results-header">
          <p className="results-meta">Results for</p>
          <h2 className="results-lot">{lotName}</h2>
        </div>

        <div className="results-body">
           <div className="results-columns">
            {/* ── CLEAN SECTION ── */}
            <div className="results-section">
              <p className="results-section-title clean-title">Clean</p>
              {REGULAR_CLASSES.map((carClass, i) => {
                const count = clean[carClass] ?? 0
                const fillPct = count === 0 ? 0 : (count / maxClean) * 100
                return (
                  <div key={carClass} className="result-row"
                    style={{ animationDelay: `${i * 30}ms`, '--fill-color': CLASS_COLORS[carClass], '--fill-pct': `${fillPct}%` }}>
                    <span className="result-fill" />
                    <span className="result-grade">{carClass}</span>
                    <span className={`result-value ${count === 0 ? 'zero' : ''}`}>{count}</span>
                  </div>
                )
              })}
              <div className="result-row result-subtotal">
                <span className="result-grade">Clean Total</span>
                <span className="result-value">{cleanTotal}</span>
              </div>
            </div>

            {/* ── DIRTY SECTION ── */}
            <div className="results-section">
              <p className="results-section-title dirty-title">Dirty</p>
              {REGULAR_CLASSES.map((carClass, i) => {
                const count = dirty[carClass] ?? 0
                const fillPct = count === 0 ? 0 : (count / maxDirty) * 100
                return (
                  <div key={carClass} className="result-row"
                    style={{ animationDelay: `${i * 30}ms`, '--fill-color': CLASS_COLORS[carClass], '--fill-pct': `${fillPct}%` }}>
                    <span className="result-fill" />
                    <span className="result-grade">{carClass}</span>
                    <span className={`result-value ${count === 0 ? 'zero' : ''}`}>{count}</span>
                  </div>
                )
              })}
              <div className="result-row result-subtotal">
                <span className="result-grade">Dirty Total</span>
                <span className="result-value">{dirtyTotal}</span>
              </div>
            </div>
          </div>
            {/* ── OTHER / UNIVERSAL SECTION ── */}
            <div className="results-section">
              {UNIVERSAL_CLASSES.map((carClass, i) => {
                const count = universal[carClass] ?? 0
                const fillPct = count === 0 ? 0 : (count / maxUniversal) * 100
                return (
                  <div key={carClass} className="result-row"
                    style={{ animationDelay: `${i * 30}ms`, '--fill-color': CLASS_COLORS[carClass], '--fill-pct': `${fillPct}%` }}>
                    <span className="result-fill" />
                    <span className="result-grade">{carClass}</span>
                    <span className={`result-value ${count === 0 ? 'zero' : ''}`}>{count}</span>
                  </div>
                )
              })}
            </div>
          
            {/* ── GRAND TOTAL ── */}
            <div className="result-row result-grandtotal">
              <span className="result-grade">Grand Total</span>
              <span className="result-value">{grandTotal}</span>
            </div>

        </div>

        <button className="btn btn-primary btn-next" onClick={onNextLot}>
          {isReviewing ? 'Done' : 'Next Lot →'}
        </button>

      </div>
    </div>
  )
}
