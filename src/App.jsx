import { useState } from 'react'
import LotEntry from './pages/LotEntry'
import Counting from './pages/Counting'
import Results from './pages/Results'

// Use states instead of a router as this is a fairly simple app.
// 3 main pages while "Storing" in an array the states of "past" results
//pages that can be viewed.
const [page, setPage] = useState('entry')       
const [lotName, setLotName] = useState('')
const [counts, setCounts] = useState({})
const [countedLots, setCountedLots] = useState([])
const [viewingLot, setViewingLot] = useState(null) 

const handleStart = (name) => {
  setLotName(name)
  setCounts({})
  setPage('counting')
}

const handleFinish = (finalCounts) => {
  setCounts(finalCounts)
  setCountedLots(prev => [...prev, { name: lotName, counts: finalCounts }])
  setPage('results')
}

function handleNextLot() {
  setLotName('')
  setCounts({})
  setPage('entry')
}

function handleViewLot(lot) {
  setViewingLot(lot)
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
      onFinishedCounting={handleFinishedCounting}
      />
      )}
      {page === 'counting' && <Counting lotName={lotName} onFinish={handleFinish} />}

      {page === 'results' && (
        <Results
          lotName={viewingLot ? viewingLot.name : lotName}
          counts={viewingLot ? viewingLot.counts : counts}
          onNextLot={viewingLot
            ? () => { setViewingLot(null); setPage('entry') }
            : handleNextLot
          }
        />
      )}
    </div>
  )


