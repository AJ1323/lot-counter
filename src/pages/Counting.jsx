import { useState, useRef } from 'react'

const REGULAR_CLASSES = ['A/B', 'C', 'D/E','G','H', 'F', 'W', 'S', 'Z', 'L', 'V', 'P/XV', 'K',
  'XC', 'XB', 'XF', 'XG', 'XH', 'XD', 'XP', 'XK', 'XW', 'XS', 'XL', 'XA', 'XE', 'XZ']

const UNIVERSAL_CLASSES = ['PM', 'REG', 'DETAIL', 'WHSL/SELL/TRBK', 'OOS/Recall',
  'SOLD', 'TIRE', 'PARTS/BD/GLASS', 'NO KEY']

export default function Counting({ lotName, onFinish }) {
  const [counts, setCounts] = useState({ clean: {}, dirty: {}, universal: {} })
  const [lastTapped, setLastTapped] = useState(null)
  const [lastSwiped, setLastSwiped] = useState(null)

  const totalClean = Object.values(counts.clean).reduce((a, b) => a + b, 0)
  const totalDirty = Object.values(counts.dirty).reduce((a, b) => a + b, 0)
  const totalUniversal = Object.values(counts.universal).reduce((a, b) => a + b, 0)

  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
  const swipeTriggered = useRef(false)

  

  function handleTouchStart(e) {
    swipeTriggered.current = false
    const touch = e.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }

function handleTouchEnd(e, col, carClass) {
  e.preventDefault() // stops onClick from also firing
  const touch = e.changedTouches[0]
  const dx = touch.clientX - touchStartX.current
  const dy = Math.abs(touch.clientY - touchStartY.current)

  if (dx < -40 && dy < 30) {
    // Swipe left — subtract
    setCounts(prev => ({
      ...prev,
      [col]: {
        ...prev[col],
        [carClass]: Math.max(0, (prev[col][carClass] ?? 0) - 1)
      }
    }))
    setLastSwiped(`${col}-${carClass}`)
    setTimeout(() => setLastSwiped(null), 150)
    if (navigator.vibrate) navigator.vibrate(10)
  } else if (Math.abs(dx) < 10 && dy < 10) {
    // Tap — add 1
    setCounts(prev => ({
      ...prev,
      [col]: { ...prev[col], [carClass]: (prev[col][carClass] ?? 0) + 1 }
    }))
    setLastTapped(`${col}-${carClass}`)
    setTimeout(() => setLastTapped(null), 150)
    if (navigator.vibrate) navigator.vibrate(10)
  }
}

  return (
    <div className="page counting-page">
      <div className="counting-header">
        <span className="lot-badge">{lotName}</span>
        <div className="total-chip">
          <span className="total-num">{totalClean + totalDirty + totalUniversal}</span>
          <span className="total-lbl">total</span>
        </div>
      </div>

      <div className="col-headers">
        <span className="col-header">Clean</span>
        <span className="col-header">Dirty</span>
      </div>

      <div className="carClass-list">
        {/* Regular classes — two buttons per row */}
        {REGULAR_CLASSES.map((carClass) => (
          <div key={carClass} className="class-row">
            <button
              className={`class-btn clean-btn ${lastTapped === `clean-${carClass}` ? 'tapped' : ''} 
              ${lastSwiped === `clean-${carClass}` ? 'swiped' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, 'clean', carClass)}
            >
              <span className="class-name">{carClass}</span>
              <span className="class-count">{counts.clean[carClass] ?? 0}</span>
            </button>
            <button
              className={`class-btn dirty-btn ${lastTapped === `dirty-${carClass}` ? 'tapped' : ''} 
              ${lastSwiped === `dirty-${carClass}` ? 'swiped' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, 'dirty', carClass)}
            >
              <span className="class-name">{carClass}</span>
              <span className="class-count">{counts.dirty[carClass] ?? 0}</span>
            </button>
          </div>
        ))}

        {/* Universal classes — single button spanning both columns */}
        {UNIVERSAL_CLASSES.map((carClass) => (
          <div key={carClass} className="class-row">
            <button
              className={`class-btn universal-btn ${lastTapped === `universal-${carClass}` ? 'tapped' : ''}`}
              onClick={() => handleTap('universal', carClass)}
            >
              <span className="class-name">{carClass}</span>
              <span className="class-count">{counts.universal[carClass] ?? 0}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="counting-footer">
        <button className="btn btn-finish" onClick={() => onFinish(counts)}>
          Finished ✓
        </button>
      </div>
    </div>
  )
}


