import { useState } from 'react'
import LotEntry from './pages/LotEntry'
import Counting from './pages/Counting'
import Results from './pages/Results'

// The three "pages" of the app. We handle navigation with simple state
// instead of a router since this is a small single-page app.
export default function App() {
  // 'entry' | 'counting' | 'results | ' 
  const [page, setPage] = useState('entry')       
  const [lotName, setLotName] = useState('')
  const [counts, setCounts] = useState({})
  const [countedLots, setCountedLots] = useState([])
  // for viewing past lots
  const [viewingLot, setViewingLot] = useState(null) 

  const handleStart = (name) => {
    setLotName(name)
    setCounts({})
    setPage('counting')
  }

  const handleFinish = (finalCounts) => {
    setCounts(finalCounts)
    setPage('results')
  }

  function handleFinishCounting() {
  setCountedLots(prev => [...prev, { name: lotName, counts }])
  setPage('entry')
}

function handleNextLot() {
  // already saved, just reset for new entry
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
      {page === 'entry'    && <LotEntry onStart={handleStart} />}
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
}

