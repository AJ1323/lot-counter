import { useState, useEffect, useRef, useCallback } from 'react'
import HelpModal from './Help'


// Function for editing counted lots
function useLongPress( onLongPress, delay = 500 ){
  const timer = useRef( null )

  const start = useCallback( ( e ) => {
    e.preventDefault()
    timer.current = setTimeout( () => onLongPress(), delay )
  }, [ onLongPress, delay ])

  const cancel = useCallback( () => {
    clearTimeout( timer.current )
  }, [])

  return{
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchEnd: cancel,
    onTouchMove: cancel,
  }
}

// New counted lot buttons so the hook can be called properly
function CountedLotsButton( { lot, onViewLot, onEditLot, children } ) {
  const longPressProps = useLongPress( 
    () => onEditLot( lot ) )  
  return (
    <button className="btn counted-lot-btn" onClick={ () => onViewLot( lot )} {...longPressProps}>
      { children } 
    </button>
  )
}

// Page 1: Lot name entry.
export default function LotEntry({ onStart, countedLots, onViewLot, onViewNewCars, 
  onFinishedCounting, onEditLot }) {
  const [value, setValue] = useState('')
  const [showHelp, setShowHelp] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const hasSeen = localStorage.getItem('helpSeen')
    if (!hasSeen) setShowTooltip(true)
  }, [])

  function openHelp() {
    setShowHelp(true)
    setShowTooltip(false)
    localStorage.setItem('helpSeen', 'true')
  }

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onStart(trimmed)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  //To handle the share button by encoding it into a URL.
function handleShare() {
  
  const payload = btoa(JSON.stringify( countedLots) )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  const url = `${window.location.origin}?import=${payload}`
  
  if (navigator.share) {
    navigator.share({ title: `LotCounter — Counted Lots`, url })
     
     .catch((err) => console.log('share error:', err))
  } else {
    //In case it's used on desktop.
    navigator.clipboard.writeText(url)
    
  }
}

  return (
    <div className="page entry-page">
      <div className="entry-card">

        {/* ── HEADER ── */}
        <div className="entry-top-row">
          <div className="logo-block">
            <span className="logo-icon">
              <img src="/Avis_Budget_Group_logo.svg.png" alt="Logo" />
            </span>
            <h1 className="logo-title">LotCounter</h1>
          </div>

          <div className="help-btn-wrap">
            {showTooltip && (
              <div className="help-tooltip" onClick={() => setShowTooltip(false)}>
                <span>Not sure how this works? Tap here dummy.
                      Also, if you don't look at it this popup show up everytime you open the app.
                </span>
                <div className="help-tooltip-arrow" />
              </div>
            )}
            <button
              className={`btn btn-help ${showTooltip ? 'btn-help--pulse' : ''}`}
              onClick={openHelp}
            >
              ?
            </button>
          </div>
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
                <CountedLotsButton lot={ lot } onViewLot={ onViewLot } 
                onEditLot={ onEditLot }>

                  <span className='counted-lot-name'>{ lot.name }</span>
                  <span className='counted-lot-total'>{ total }</span>

                </CountedLotsButton>
                {hasNewCars && (
                  <CountedLotsButton lot={ lot } onViewLot={ onViewLot } 
                onEditLot={ onEditLot }>

                  <span className="counted-newcar-indicator">↳</span>
                  <span className='counted-lot-name counted-newcar-name'>
                    { lot.name }'s New Cars
                  </span>
                  <span className='counted-lot-total counted-newcar-total'>
                    { ncTotal }
                  </span>

                </CountedLotsButton>
                )}
              </div>
            )
          })}
        </div>

        {countedLots.length > 0 && (
        <button className="btn btn-share" onClick={handleShare}>
          Share Lot(s) ↗
        </button>
)}

        <button className="btn btn-finish" onClick={onFinishedCounting}>
          Delete Lot( s )
        </button>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  )
}

