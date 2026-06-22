import { useState } from 'react'
 
const REGULAR_CLASSES = ['A/B', 'C', 'D/E','G','H', 'F', 'W', 'S', 'Z', 'L', 'V', 'P/XV', 'K',
  'XC', 'XB', 'XF', 'XG', 'XH', 'XD', 'XP', 'XK', 'XW', 'XS', 'XL', 'XA', 'XE', 'XZ']
 
const UNIVERSAL_CLASSES = ['PM', 'REG', 'DETAIL', 'WHSL/SELL/TRBK', 'OOS/Recall',
  'SOLD', 'TIRE', 'PARTS/BD/GLASS', 'NO KEY']
 
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
  'REG':        '#a53b75',
  'DETAIL':     '#ad4b77',
  'WHSL/SELL/TRBK': '#f10909',
  'OOS/RECALL': '#0df109',
  'SOLD':       '#f472b6',
  'TIRE':       '#e879f9',
  'PARTS/BD/GLASS': '#0df109',
  'NO KEY':     '#0df109',
}
 
function ResultRows({ classes, data, maxVal }) {
  return classes.map((carClass, i) => {
    const count = data[carClass] ?? 0
    const fillPct = count === 0 ? 0 : (count / maxVal) * 100
    return (
      <div
        key={carClass}
        className="result-row"
        style={{
          animationDelay: `${i * 30}ms`,
          '--fill-color': CLASS_COLORS[carClass],
          '--fill-pct': `${fillPct}%`
        }}
      >
        <span className="result-fill" />
        <span className="result-grade">{carClass}</span>
        <span className={`result-value ${count === 0 ? 'zero' : ''}`}>{count}</span>
      </div>
    )
  })
}

 
export default function Results({ lotName, counts, newCarCounts, onNextLot, isReviewing, startOnNewCars = false }) {
  const [showNewCars, setShowNewCars] = useState(startOnNewCars)

  //To handle the share button by encoding it into a URL.
function handleShare() {
  console.log('origin:', window.location.origin)
  console.log('share available:', !!navigator.share)

  const payload = btoa(JSON.stringify({
    name: lotName,
    counts,
    newCarCounts
  }))
  const url = `${window.location.origin}?import=${payload}`
  console.log('url length:', url.length)
  if (navigator.share) {
    navigator.share({ title: `LotCounter — ${lotName}`, url })
     
     .catch((err) => console.log('share error:', err))
  } else {
    console.log('navigator.share not available')
    //In case it's used on desktop.
    navigator.clipboard.writeText(url)
    
  }
}
 
  const clean = counts.clean ?? {}
  const dirty = counts.dirty ?? {}
  const universal = counts.universal ?? {}
 
  const cleanTotal = Object.values(clean).reduce((a, b) => a + b, 0)
  const dirtyTotal = Object.values(dirty).reduce((a, b) => a + b, 0)
  const universalTotal = Object.values(universal).reduce((a, b) => a + b, 0)
  const nc = newCarCounts ?? {}
  const ncTotal = Object.values(nc).reduce((a, b) => a + b, 0)
  const hasNewCars = ncTotal > 0
  const maxNc = Math.max(...REGULAR_CLASSES.map(g => nc[g] ?? 0), 1)
 
  const grandTotal = cleanTotal + dirtyTotal + universalTotal + ncTotal
 
  const maxClean = Math.max(...REGULAR_CLASSES.map(g => clean[g] ?? 0), 1)
  const maxDirty = Math.max(...REGULAR_CLASSES.map(g => dirty[g] ?? 0), 1)
  const maxUniversal = Math.max(...UNIVERSAL_CLASSES.map(g => universal[g] ?? 0), 1)
 
  return (
    <div className="page results-page">
      <div className="results-inner">
 
        {/* ── HEADER ── */}
        <div className="results-header">
          {showNewCars ? (
            <>
              <p className="results-meta">New Cars at:</p>
              <h2 className="results-lot">{lotName}</h2>
              <span className="newcar-sublot-pill">NEW CARS · {ncTotal} total</span>
            </>
          ) : (
            <>
              <p className="results-meta">Results for:</p>
              <h2 className="results-lot">{lotName}</h2>
            </>
          )}
        </div>
 
        {/* ── MAIN LOT RESULTS ── */}
        {!showNewCars && (
          <div className="results-body">
            <div className="results-columns">
              <div className="results-section">
                <p className="results-section-title clean-title">Clean</p>
                <ResultRows classes={REGULAR_CLASSES} data={clean} maxVal={maxClean} />
                <div className="result-row result-subtotal">
                  <span className="result-grade">Clean Total</span>
                  <span className="result-value">{cleanTotal}</span>
                </div>
              </div>
              <div className="results-section">
                <p className="results-section-title dirty-title">Dirty</p>
                <ResultRows classes={REGULAR_CLASSES} data={dirty} maxVal={maxDirty} />
                <div className="result-row result-subtotal">
                  <span className="result-grade">Dirty Total</span>
                  <span className="result-value">{dirtyTotal}</span>
                </div>
              </div>
            </div>
 
            <div className="results-section">
              <ResultRows classes={UNIVERSAL_CLASSES} data={universal} maxVal={maxUniversal} />
            </div>
 
            <div className="result-row result-grandtotal">
              <span className="result-grade">Grand Total</span>
              <span className="result-value">{grandTotal}</span>
            </div>
          </div>
        )}
 
        {/* ── NEW CARS SUB-LOT RESULTS — single column, no clean/dirty ── */}
        {showNewCars && (
          <div className="results-body">
            <div className="results-section results-section--newcars">
              <ResultRows classes={REGULAR_CLASSES} data={nc} maxVal={maxNc} />
            </div>
            <div className="result-row result-grandtotal">
              <span className="result-grade">New Cars Total</span>
              <span className="result-value">{ncTotal}</span>
            </div>
          </div>
        )}
 
        {/* ── FOOTER BUTTONS ── */}
        <div className="results-footer-btns">
          <button
            className={`btn btn-newcars-toggle ${showNewCars ? 'btn-newcars-toggle--active' : ''}`}
            onClick={() => setShowNewCars(v => !v)}
          >
            {showNewCars ? '← Full Lot Results' : 'New Cars Results:'}
          </button>
          <button className="btn btn-primary btn-next" onClick={onNextLot}>
            {isReviewing ? 'Done' : 'Next Lot →'}
          </button>

          <button className="btn btn-share" onClick={handleShare}>
            Share Lot ↗
          </button>
        </div>
 
      </div>
    </div>
  )
}



