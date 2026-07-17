import { useState, useEffect } from 'react'
import LotEntry from './pages/LotEntry'
import Counting from './pages/Counting'
import Results from './pages/Results'


export default function App() {
// Use states instead of a router as this is a fairly simple app.
// 3 main pages while "Storing" in an array the states of "past" results
//pages that can be viewed.
const [page, setPage] = useState( 'entry' )       
const [lotName, setLotName] = useState( '' )
const [counts, setCounts] = useState( {} )
const [newCarCounts, setNewCarCounts] = useState( {} )
const [countedLots, setCountedLots] = useState( [] )
const [viewingLot, setViewingLot] = useState( null )
const [viewNewCars, setViewNewCars] = useState( false ) 
const [importPrompt, setImportPrompt] = useState( null )
const [initialShowNewCars, setInitialShowNewCars] = useState( false )

useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('import')
  if (!raw) return
  try {
    const parsed = JSON.parse(atob(raw))
    // Handle both single-lot and array payloads
    const lots = Array.isArray(parsed) ? parsed : [parsed]
    setImportPrompt(lots)
    window.history.replaceState({}, '', window.location.pathname)
  } catch {
    // malformed payload — silently ignore
  }
}, [])

const handleStart = (name) => {
  setLotName(name)
  setCounts({})
  setPage('counting')
}

const handleFinish = (finalCounts, finalNewCarCounts) => {
  setCounts(finalCounts)
  setNewCarCounts(finalNewCarCounts)
  setCountedLots(prev => [...prev, { 
    name: lotName, 
    counts: finalCounts, 
    newCarCounts: finalNewCarCounts 
  }])
  setPage('results')
}

function handleNextLot() {
  setLotName('')
  setCounts({})
  setNewCarCounts({})
  setPage('entry')
}

function handleViewLot(lot) {
  setViewingLot(lot)
  setPage('results')
}

function handleViewNewCars(lot) {
  setViewingLot({ ...lot, startOnNewCars: true })
  setPage('results')
}

function handleFinishedCounting() {
  setCountedLots([])
  setViewingLot(null)
}

function handleEditLot( lot ){
  const unEditedLots = countedLots.filter( l => l.name !== lot.name )
  setCountedLots( unEditedLots )
  setLotName( lot.name )
  setCounts( lot.counts )
  setNewCarCounts( lot.newCarCounts ?? {} )
  setInitialShowNewCars( false )
  setPage( 'counting' )
}

function handleEditNewCars( lot ){
  const unEditedLots = countedLots.filter( l => l.name !== lot.name )
  setCountedLots( unEditedLots )
  setLotName( lot.name )
  setCounts( lot.counts )
  setNewCarCounts( lot.newCarCounts ?? {} )
  setInitialShowNewCars( true )
  setPage( 'counting' )
}

  return (
    <div className="app-shell">
      {page === 'entry' && (
       <LotEntry
      onStart={handleStart}
      countedLots={countedLots}
      onViewLot={handleViewLot}
      onViewNewCars={handleViewNewCars}
      onFinishedCounting={handleFinishedCounting}
      />
      )}
      {page === 'counting' && 
      <Counting 
      lotName={ lotName } 
      intitialCounts={ counts }
      intitialNewCarCounts={ newCarCounts }
      initialShowNewCars={ initialShowNewCars }
      onFinish={ handleFinish }
      />}

      {page === 'results' && (
        <Results
          key={`${viewingLot?.name}-${viewingLot?.startOnNewCars}`}
          lotName={viewingLot ? viewingLot.name : lotName}
          counts={viewingLot ? viewingLot.counts : counts}
          newCarCounts={viewingLot ? viewingLot.newCarCounts : newCarCounts }
          startOnNewCars={viewingLot?.startOnNewCars ?? false}
          isReviewing={!!viewingLot}
          onNextLot={viewingLot
            ? () => { setViewingLot(null); setPage('entry') }
            : handleNextLot
          }
        />
      )}
      
      {importPrompt && (
  <div className="import-overlay">
    <div className="import-modal">
      <p className="import-label">Lot(s) received</p>
      <h2 className="import-lot-name">
        {importPrompt.map(l => l.name).join(', ')}
      </h2>
      <p className="import-sub">Add this/these to your counted lots?</p>
      <button className="btn btn-primary" onClick={() => {
        setCountedLots(prev => [...prev, ...importPrompt]) 
        setImportPrompt(null)
            }}>
        Add to My Lots
      </button>
      <button className="btn btn-finish" onClick={() => setImportPrompt(null)}>
        Dismiss
      </button>
    </div>
  </div>
)}
    </div>
  )
}

