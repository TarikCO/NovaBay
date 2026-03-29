import React from 'react'

function RiskMapSidebar({ selectedParcel, onAnalyzeClick }) {
  return (
    <aside className="analyze-sidebar">
      {/* LOCATION SECTION */}
      <section className="sidebar-section">
        <h2 className="section-label">LOCATION</h2>
        {!selectedParcel ? (
          <div className="placeholder-card">
            <span className="placeholder-icon icon-location">◎</span>
            <p>Click a parcel on the map to begin</p>
          </div>
        ) : (
          <div className="data-card">
            <h3>{selectedParcel.site_addr}</h3>
            <p className="folio-text">Folio: {selectedParcel.folio}</p>
            <div className="stats-row">
              <div className="stat"><span>Year:</span> {selectedParcel.year_built}</div>
              <div className="stat"><span>Stories:</span> {selectedParcel.stories}</div>
            </div>
          </div>
        )}
      </section>

      {/* MATERIALS SECTION */}
      <section className="sidebar-section">
        <h2 className="section-label">MATERIALS</h2>
        {!selectedParcel ? (
          <div className="placeholder-card placeholder-disabled">
            <span className="placeholder-icon icon-materials">⬡</span>
            <p>Location required first</p>
          </div>
        ) : (
          <div className="data-card waiting">
            <p>AI analyzing building codes...</p>
          </div>
        )}
      </section>

      {/* ANALYSIS SECTION */}
      <section className="sidebar-section">
        <h2 className="section-label">RESILIENCE ANALYSIS</h2>
        {!selectedParcel ? (
          <div className="placeholder-card placeholder-waiting">
            <span className="placeholder-icon icon-analysis">◈</span>
            <p>Awaiting input</p>
          </div>
        ) : (
          <button className="analyze-trigger-btn" onClick={onAnalyzeClick}>
            Generate AI Report
          </button>
        )}
      </section>
    </aside>
  )
}

export default RiskMapSidebar