import { useState } from 'react'
 
const GRADES = ['A/B', 'C', 'D/E', 'F', 'W', 'S', 'Z', 'L', 'OOS/Recall', 'PM']
 

 
export default function Counting({ lotName, onFinish }) {
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(GRADES.map((g) => [g, 0]))
  )
  const [lastTapped, setLastTapped] = useState(null)
 
  const increment = (grade) => {
    setCounts((prev) => ({ ...prev, [grade]: prev[grade] + 1 }))
    setLastTapped(grade)
    setTimeout(() => setLastTapped(null), 150)
    if (navigator.vibrate) navigator.vibrate(10)
  }
 
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
 
  return (
    <div className="page counting-page">
      {/* Header */}
      <div className="counting-header">
        <div className="lot-badge">{lotName}</div>
        <div className="total-chip">
          <span className="total-num">{total}</span>
          <span className="total-lbl">total</span>
        </div>
      </div>
 
      {/* Grade buttons — single column, vertical list */}
      <div className="grade-list">
        {GRADES.map((grade) => {
          const count = counts[grade]
 
          return (
            <button
              key={grade}
              className={`grade-btn ${lastTapped === grade ? 'tapped' : ''}`}
              onClick={() => increment(grade)}
            >
              {/* Label sits on top of the fill */}
              <span className="grade-name">{grade}</span>
            </button>
          )
        })}
      </div>
 
      {/* Finished button */}
      <div className="counting-footer">
        <button className="btn btn-finish" onClick={() => onFinish(counts)}>
          Finished ✓
        </button>
      </div>
    </div>
  )
}


