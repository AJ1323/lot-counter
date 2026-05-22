// Must match Counting.jsx
const carClasses = ['A/B', 'C', 'D/E', 'F', 'W', 'S', 'Z', 'L','V','P/XV','K',
  'XC', 'XB','XF','XG','XH','XD','XP','XK','XW','XS','XL','XA','XE','XZ',
  'PM','REG','DETAIL','WHSL/SELL/TRBK','OOS/Recall', 'SOLD','TIRE','PARTS/BD/GLASS',
'NO KEY']
 

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
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
 
  // Find the highest single-grade count to use as the 100% baseline
  const maxCount = Math.max(...carClasses.map((g) => counts[g] ?? 0), 1)
 
  return (
    <div className="page results-page">
      <div className="results-inner">
        {/* Lot name header */}
        <div className="results-header">
          <p className="results-meta">Results for</p>
          <h2 className="results-lot">{lotName}</h2>
        </div>
 
        {/* Count rows */}
        <div className="results-list">
          {carClasses.map((carClass, i) => {
            const count = counts[carClass] ?? 0
            const color = CLASS_COLORS[carClass]
            // Percentage of the highest count; 0 count = no fill
            const fillPct = count === 0 ? 0 : (count / maxCount) * 100
 
            return (
              <div
                key={carClass}
                className="result-row"
                style={{
                  animationDelay: `${i * 45}ms`,
                  '--fill-color': color,
                  '--fill-pct': `${fillPct}%`,
                }}
              >
                {/* Color fill bar  */}
                <span className="result-fill" />
                <span className="result-grade">{carClass}</span>
                <span className={`result-value ${count === 0 ? 'zero' : ''}`}>
                  {count}
                </span>
              </div>
            )
          })}
 
          {/* Grand total row */}
          <div className="result-row result-total">
            <span className="result-grade">Grand Total</span>
            <span className="result-value">{total}</span>
          </div>
        </div>
 
        <button className="btn btn-primary btn-next" onClick={onNextLot}>
          {isReviewing ? 'Done' : 'Next Lot →'}
        </button>
      </div>
    </div>
  )
}

