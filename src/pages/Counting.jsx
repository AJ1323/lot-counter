import { useState, useRef } from 'react'
import NewCarCounting from './NewCarCounting'
 
const REGULAR_CLASSES = ['A/B', 'C', 'D/E','G','H', 'F', 'W', 'S', 'Z', 'L', 'V', 'P/XV', 'K',
  'XC', 'XB', 'XF', 'XG', 'XH', 'XD', 'XP', 'XK', 'XW', 'XS', 'XL', 'XA', 'XE', 'XZ']
 
const UNIVERSAL_CLASSES = ['PM', 'REG', 'DETAIL', 'WHSL/SELL/TRBK', 'OOS/Recall',
  'SOLD', 'TIRE', 'PARTS/BD/GLASS', 'NO KEY']
 
export default function Counting({ lotName, onFinish }) {
  const [counts, setCounts] = useState({ clean: {}, dirty: {}, universal: {} })
  // Flat map for new cars — no clean/dirty distinction
  const [newCarCounts, setNewCarCounts] = useState({})
  const [showNewCars, setShowNewCars] = useState(false)
  const [lastTapped, setLastTapped] = useState(null)
  const [lastSwiped, setLastSwiped] = useState(null)
 
  const totalClean = Object.values(counts.clean).reduce((a, b) => a + b, 0)
  const totalDirty = Object.values(counts.dirty).reduce((a, b) => a + b, 0)
  const totalUniversal = Object.values(counts.universal).reduce((a, b) => a + b, 0)
 
  const newCarTotal = Object.values(newCarCounts).reduce((a, b) => a + b, 0)
  const hasNewCars = newCarTotal > 0
 
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)
 
  function handleTouchStart(e) {
    const touch = e.touches[0]
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }
 
  function handleTouchEnd(e, col, carClass) {
    e.preventDefault()
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartX.current
    const dy = Math.abs(touch.clientY - touchStartY.current)
 
    if (dx < -40 && dy < 30) {
      setCounts(prev => ({
        ...prev,
        [col]: { ...prev[col], [carClass]: Math.max(0, (prev[col][carClass] ?? 0) - 1) }
      }))
      setLastSwiped(`${col}-${carClass}`)
      setTimeout(() => setLastSwiped(null), 150)
      if (navigator.vibrate) navigator.vibrate(10)
    } else if (Math.abs(dx) < 10 && dy < 10) {
      setCounts(prev => ({
        ...prev,
        [col]: { ...prev[col], [carClass]: (prev[col][carClass] ?? 0) + 1 }
      }))
      setLastTapped(`${col}-${carClass}`)
      setTimeout(() => setLastTapped(null), 150)
      if (navigator.vibrate) navigator.vibrate(10)
    }
  }
 
  function handleNewCarsBack(savedCounts) {
    setNewCarCounts(savedCounts)
    setShowNewCars(false)
  }
 
  function handleNewCarsFinalize(savedCounts) {
    setNewCarCounts(savedCounts)
    setShowNewCars(false)
  }
 
  if (showNewCars) {
    return (
      <NewCarCounting
        lotName={lotName}
        existingCounts={newCarCounts}
        onBack={handleNewCarsBack}
        onFinalize={handleNewCarsFinalize}
        onFinishCounting={(savedCounts) => { 
          onFinish(counts, savedCounts)
        }}
      />
    )
  }
 
  return (
    <div className="page counting-page">
      <div className="counting-header">
        <span className="lot-badge">{lotName}</span>
        <div className="total-chip">
          <span className="total-num">{totalClean + totalDirty + totalUniversal + newCarTotal}</span>
          <span className="total-lbl">total</span>
        </div>
      </div>
 
      <div className="col-headers">
        <span className="col-header">Clean</span>
        <span className="col-header">Dirty</span>
      </div>
 
      <div className="carClass-list">
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
 
        {UNIVERSAL_CLASSES.map((carClass) => (
          <div key={carClass} className="class-row">
            <button
              className={`class-btn universal-btn ${lastTapped === `universal-${carClass}` ? 'tapped' : ''}
              ${lastSwiped === `universal-${carClass}` ? 'swiped' : ''}`}
              onTouchStart={handleTouchStart}
              onTouchEnd={(e) => handleTouchEnd(e, 'universal', carClass)}
            >
              <span className="class-name">{carClass}</span>
              <span className="class-count">{counts.universal[carClass] ?? 0}</span>
            </button>
          </div>
        ))}
      </div>
 
      <div className="counting-footer">
        <button
          className={`btn btn-newcars ${hasNewCars ? 'btn-newcars--active' : ''}`}
          onClick={() => setShowNewCars(true)}
        >
          <span>New Cars</span>
          {hasNewCars && <span className="newcars-badge">{newCarTotal}</span>}
        </button>
        <button className="btn btn-finish" onClick={() => onFinish(counts, newCarCounts)}>
          Finished ✓
        </button>
      </div>
    </div>
  )
}



