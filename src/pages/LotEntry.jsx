import { useState } from 'react'
 
// PAGE 1 — shown on first load and after "Next Lot" is pressed.
export default function LotEntry({ onStart, countedLots, onViewLot, onViewNewCars, onFinishedCounting }) {
  const [value, setValue] = useState('')
 
  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onStart(trimmed)
  }
  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }
 
  return (
    <div className="page entry-page">
      <div className="entry-card">
        <div className="logo-block">
          <span className="logo-icon">
            <img src="/Avis_Budget_Group_logo.svg.png" alt="Logo" />
          </span>
          <h1 className="logo-title">LotCounter</h1>
        </div>
 
        <p className="entry-label">Start a new count</p>
        <input
          className="lot-input"
          type="text"
          placeholder="Enter lot name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          maxLength={40}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!value.trim()}
        >
          Submit
        </button>
 
        <div className="counted-block">
          <h2 className="counted-title">Counted Lots</h2>
 
          {countedLots.map((lot, i) => {
            const total =
              Object.values(lot.counts.clean ?? {}).reduce((a, b) => a + b, 0) +
              Object.values(lot.counts.dirty ?? {}).reduce((a, b) => a + b, 0) +
              Object.values(lot.counts.universal ?? {}).reduce((a, b) => a + b, 0)
 
            const ncTotal = lot.newCarCounts
              ? Object.values(lot.newCarCounts).reduce((a, b) => a + b, 0)
              : 0
            const hasNewCars = ncTotal > 0
 
            return (
              <div key={i} className="counted-lot-group">
                {/* Main lot button */}
                <button className="btn counted-lot-btn" onClick={() => onViewLot(lot)}>
                  <span className="counted-lot-name">{lot.name}</span>
                  <span className="counted-lot-total">{total}</span>
                </button>
 
                {/* New cars sub-row — indented, only shown if new cars were entered */}
                {hasNewCars && (
                  <button
                    className="btn counted-lot-btn counted-newcar-btn"
                    onClick={() => onViewNewCars(lot)}
                  >
                    <span className="counted-newcar-indicator">↳</span>
                    <span className="counted-lot-name counted-newcar-name">🚘 New Cars</span>
                    <span className="counted-lot-total counted-newcar-total">{ncTotal}</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
 
        <button className="btn btn-finish" onClick={onFinishedCounting}>
          Finished Counting
        </button>
      </div>
    </div>
  )
}

