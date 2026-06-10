import { useState } from 'react'
import LotEntry from './pages/LotEntry'
import Counting from './pages/Counting'
import Results from './pages/Results'


export default function App() {
// Use states instead of a router as this is a fairly simple app.
// 3 main pages while "Storing" in an array the states of "past" results
//pages that can be viewed.
const [page, setPage] = useState('entry')       
const [lotName, setLotName] = useState('')
const [counts, setCounts] = useState({})
const [newCarCounts, setNewCarCounts] = useState({})
const [countedLots, setCountedLots] = useState([])
const [viewingLot, setViewingLot] = useState(null)
const [viewNewCars, setViewNewCars] = useState(false) 

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
      {page === 'counting' && <Counting lotName={lotName} onFinish={handleFinish} />}

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
    </div>
  )
}

