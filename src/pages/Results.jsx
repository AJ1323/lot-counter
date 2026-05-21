// Must match Counting.jsx
const GRADES = ['A/B', 'C', 'D/E', 'F', 'W', 'S', 'Z', 'L', 'OOS/Recall', 'PM']
 
// Same color map as Counting.jsx so each grade is consistent across both pages
const GRADE_COLORS = {
  'A/B':        '#4ade80',
  'C':          '#60a5fa',
  'D/E':        '#f59e0b',
  'F':          '#f87171',
  'W':          '#a78bfa',
  'S':          '#34d399',
  'Z':          '#fb923c',
  'L':          '#38bdf8',
  'OOS/Recall': '#f472b6',
  'PM':         '#e879f9',
}
 
// PAGE 3 — results with color fill bars scaled relative to the highest count.
// The grade with the most presses = 100% fill. Every other grade is a
// percentage of that maximum, so proportions are visually obvious at a glance.
export default function Results({ lotName, counts, onNextLot }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
 
  // Find the highest single-grade count to use as the 100% baseline
  const maxCount = Math.max(...GRADES.map((g) => counts[g] ?? 0), 1)
 
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
          {GRADES.map((grade, i) => {
            const count = counts[grade] ?? 0
            const color = GRADE_COLORS[grade]
            // Percentage of the highest count; 0 count = no fill
            const fillPct = count === 0 ? 0 : (count / maxCount) * 100
 
            return (
              <div
                key={grade}
                className="result-row"
                style={{
                  animationDelay: `${i * 45}ms`,
                  '--fill-color': color,
                  '--fill-pct': `${fillPct}%`,
                }}
              >
                {/* Color fill bar — same mechanic as counting page */}
                <span className="result-fill" />
                <span className="result-grade">{grade}</span>
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
          Next Lot →
        </button>
      </div>
    </div>
  )
}

