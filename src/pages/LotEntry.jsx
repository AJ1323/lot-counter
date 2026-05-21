import { useState } from 'react'

// PAGE 1 — shown on first load and after "Next Lot" is pressed.
// Collects the lot name and passes it up to App via onStart().
export default function LotEntry({ onStart }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onStart(trimmed)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="page entry-page">
      <div className="entry-card">
        <div className="logo-block">
          <span className="logo-icon">⬡</span>
          <h1 className="logo-title">LotCounter</h1>
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
      </div>
    </div>
  )
}
