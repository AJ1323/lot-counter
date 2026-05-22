import { useState } from 'react'
 
const CarClasses = ['A/B', 'C', 'D/E', 'F', 'W', 'S', 'Z', 'L','V','P/XV','K',
  'XC', 'XB','XF','XG','XH','XD','XP','XK','XW','XS','XL','XA','XE','XZ',
  'PM','REG','DETAIL','WHSL/SELL/TRBK','OOS/Recall', 'SOLD','TIRE','PARTS/BD/GLASS',
'NO KEY']
 

 
export default function Counting({ lotName, onFinish }) {
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(CarClasses.map((g) => [g, 0]))
  )
  const [lastTapped, setLastTapped] = useState(null)
 
  const increment = (carClass) => {
    setCounts((prev) => ({ ...prev, [carClass]: prev[carClass] + 1 }))
    setLastTapped(carClass)
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
 
      {/* Type buttons — single column, vertical list */}
      <div className="carClass-list">
        {CarClasses.map((carClass) => {
          const count = counts[carClass]
 
          return (
            <button
              key={carClass}
              className={`class-btn ${lastTapped === carClass ? 'tapped' : ''}`}
              onClick={() => increment(carClass)}
            >
              {/* Label sits on top of the fill */}
              <span className="class-name">{carClass}</span>
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


