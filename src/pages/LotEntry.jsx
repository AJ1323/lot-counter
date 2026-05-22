import { useState } from 'react'

// PAGE 1 — shown on first load and after "Next Lot" is pressed.
// Collects the lot name and passes it up to App via onStart().
export default function LotEntry({ onStart, countedLots, onViewLot, onFinishedCounting }) {
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
        
         {/* ── Counted Lots ── */}
        {countedLots.map((lot, i) => {
          const total =
            Object.values(lot.counts.clean ?? {}).reduce((a, b) => a + b, 0) +
            Object.values(lot.counts.dirty ?? {}).reduce((a, b) => a + b, 0) +
            Object.values(lot.counts.universal ?? {}).reduce((a, b) => a + b, 0)

          return (
            <button key={i} className="btn counted-lot-btn" onClick={() => onViewLot(lot)}>
              <span className="counted-lot-name">{lot.name}</span>
              <span className="counted-lot-total">{total}</span>
            </button>
          )
          })}
           

            <button className="btn btn-finish" onClick={onFinishedCounting}>
              Finished Counting
            </button>
      
      </div>      
    </div>
  )
}
