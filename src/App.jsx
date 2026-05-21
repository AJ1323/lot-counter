import { useState } from 'react'
import LotEntry from './pages/LotEntry'
import Counting from './pages/Counting'
import Results from './pages/Results'

// The three "pages" of the app. We handle navigation with simple state
// instead of a router since this is a small single-page app.
export default function App() {
  const [page, setPage] = useState('entry')       // 'entry' | 'counting' | 'results'
  const [lotName, setLotName] = useState('')
  const [counts, setCounts] = useState({})

  const handleStart = (name) => {
    setLotName(name)
    setCounts({})
    setPage('counting')
  }

  const handleFinish = (finalCounts) => {
    setCounts(finalCounts)
    setPage('results')
  }

  const handleNextLot = () => {
    setLotName('')
    setCounts({})
    setPage('entry')
  }

  return (
    <div className="app-shell">
      {page === 'entry'    && <LotEntry onStart={handleStart} />}
      {page === 'counting' && <Counting lotName={lotName} onFinish={handleFinish} />}
      {page === 'results'  && <Results lotName={lotName} counts={counts} onNextLot={handleNextLot} />}
    </div>
  )
}

