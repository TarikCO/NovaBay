function RiskMapSidebar({ showBack = false, onBack = null, className = '' }) {
  const classes = ['risk-map-sidebar-shell', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {showBack && (
        <header className="risk-map-sidebar-header">
          <button
            type="button"
            className="risk-map-back"
            onClick={onBack}
          >
            ← Back
          </button>
        </header>
      )}

      <section className="sidebar-section">
        <h2 className="section-label">LOCATION</h2>
        <div className="placeholder-card">
          <span className="placeholder-icon icon-location">◎</span>
          <p>Drop a pin on the map to begin</p>
        </div>
      </section>

      <section className="sidebar-section">
        <h2 className="section-label">MATERIALS</h2>
        <div className="placeholder-card placeholder-disabled">
          <span className="placeholder-icon icon-materials">⬡</span>
          <p>Location required first</p>
        </div>
      </section>

      <section className="sidebar-section">
        <h2 className="section-label">ANALYSIS</h2>
        <div className="placeholder-card placeholder-waiting">
          <span className="placeholder-icon icon-analysis">◈</span>
          <p>Awaiting input</p>
        </div>
      </section>
    </div>
  )
}

export default RiskMapSidebar