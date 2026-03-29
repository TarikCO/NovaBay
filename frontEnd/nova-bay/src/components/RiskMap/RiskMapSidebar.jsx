import React from 'react'

function RiskMapSidebar({ selectedParcel, report, isAnalyzing, onAnalyzeClick }) {
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

      {/* MATERIALS & ANALYSIS SECTION */}
      <section className="sidebar-section">
        <h2 className="section-label">RESILIENCE ANALYSIS</h2>
        {!selectedParcel ? (
          <div className="placeholder-card placeholder-waiting">
            <span className="placeholder-icon icon-analysis">◈</span>
            <p>Awaiting input</p>
          </div>
        ) : isAnalyzing ? (
          <div className="data-card loading-state">
             {/* You can add a CSS spinner here */}
             <p>Consulting NovaBay AI Agent...</p>
          </div>
        ) : report ? (
          <div className="report-container">
            <div className="ai-report-text">
              {/* Using white-space pre-wrap to preserve AI formatting */}
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {report}
              </p>
            </div>
            <button className="secondary-btn" onClick={() => window.print()} style={{marginTop: '15px'}}>
              Download Report
            </button>
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