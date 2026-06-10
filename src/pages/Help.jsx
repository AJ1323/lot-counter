export default function HelpModal({ onClose }) {
  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <button className="help-close" onClick={onClose}>✕</button>
        <h2 className="help-title">How to Use LotCounter</h2>

        <div className="help-section">
          <h3>Counting</h3>
          <p><strong>Tap</strong> a class button to add one. <strong>Swipe left</strong> on a button to subtract one.</p>
        </div>

        <div className="help-section">
          <h3>Clean / Dirty</h3>
          <p>Each car class has two buttons: left for Clean, right for Dirty. Count each car in the correct column.</p>
        </div>

        <div className="help-section">
          <h3>Non-Rentable</h3>
          <p>PM, REG, SOLD, etc. appear at the bottom and don't have a clean/dirty split, just tap to count.</p>
        </div>

        <div className="help-section">
          <h3>New Cars</h3>
          <p>Tap <strong>New Cars</strong> at the bottom to count new inventory as a separate sub-lot. The total carries back into the main count automatically.</p>
        </div>

        <div className="help-section">
          <h3>Finishing a Lot</h3>
          <p>Tap <strong>Finished ✓</strong> to save the lot and see results. Then start the next lot or tap a saved lot below to review it.</p>
        </div>

        <div className="help-section">
          <h3>Finished Counting</h3>
          <p>Once all lots are done, tap <strong>Finished Counting</strong> on the entry page to clear everything and start fresh.</p>
        </div>

        <button className="btn btn-primary help-got-it" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  )
}