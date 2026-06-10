import { useState, useRef } from 'react'
 
const REGULAR_CLASSES = ['A/B', 'C', 'D/E','G','H', 'F', 'W', 'S', 'Z', 'L', 'V', 'P/XV', 'K',
  'XC', 'XB', 'XF', 'XG', 'XH', 'XD', 'XP', 'XK', 'XW', 'XS', 'XL', 'XA', 'XE', 'XZ']
 
export default function NewCarCounting({ lotName, existingCounts, onBack, onFinalize, onFinishCounting }) {
  // Flat map: { [carClass]: count } — no clean/dirty distinction
  const [counts, setCounts] = useState(existingCounts ?? {})
  const [lastTapped, setLastTapped] = useState(null)
  const [lastSwiped, setLastSwiped] = useState(null)
 
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
 
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
 
  function handleTouchStart(e) {
    const touch = e.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }
 
  function handleTouchEnd(e, carClass) {
    e.preventDefault()
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartX.current
    const dy = Math.abs(touch.clientY - touchStartY.current)
 
    if (dx < -40 && dy < 30) {
      // Swipe left — subtract
      setCounts(prev => ({ ...prev, [carClass]: Math.max(0, (prev[carClass] ?? 0) - 1) }))
      setLastSwiped(carClass)
      setTimeout(() => setLastSwiped(null), 150)
      if (navigator.vibrate) navigator.vibrate(10)
    } else if (Math.abs(dx) < 10 && dy < 10) {
      // Tap — add
      setCounts(prev => ({ ...prev, [carClass]: (prev[carClass] ?? 0) + 1 }))
      setLastTapped(carClass)
      setTimeout(() => setLastTapped(null), 150)
      if (navigator.vibrate) navigator.vibrate(10)
    }
  }
 
  return (
    <div className="page counting-page newcar-page">
      <div className="counting-header newcar-header">
        <div className="newcar-header-left">
          <div className="newcar-title-block">
            <span className="newcar-badge">NEW CARS</span>
            <span className="lot-badge-sub">{lotName}</span>
          </div>
        </div>
        <div className="total-chip newcar-chip">
          <span className="total-num">{total}</span>
          <span className="total-lbl">total</span>
        </div>
      </div>
 
      <div className="carClass-list newcar-list">
        {REGULAR_CLASSES.map((carClass) => (
          <div key={carClass} className="class-row newcar-row">
            <button
              className={`class-btn newcar-btn ${lastTapped === carClass ? 'tapped' : ''} ${lastSwiped === carClass ? 'swiped' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, carClass)}
            >
              <span className="class-name">{carClass}</span>
              <span className="class-count">{counts[carClass] ?? 0}</span>
            </button>
          </div>
        ))}
      </div>
 
      <div className="counting-footer newcar-footer">
        <button className="btn btn-newcars" onClick={() => onBack(counts)}>
          ← Back
        </button>
        <button className="btn btn-primary" onClick={() => onFinishCounting(counts)}>
          Finished Counting Lot
        </button>
      </div>
    </div>
  )
}

