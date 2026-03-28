import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/Map/MapView'
import './Analyze.css'

function Analyze() {
  const navigate = useNavigate()

  useEffect(() => {
    // MapView encapsulates the MapLibre instance; trigger a resize after mount
    // so the map recalculates inside the padded rounded dashboard container.
    const resizeTimer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 100)

    return () => clearTimeout(resizeTimer)
  }, [])

  return (
    <div className="analyze-page">
      <header className="analyze-topbar">
        <div className="topbar-left">
          <button type="button" className="analyze-back" onClick={() => navigate('/')}>
            ← Back
          </button>
          <div className="analyze-brand">NovaBay</div>
        </div>
        <div className="topbar-right">
          <div className="region-badge">
            <span className="region-dot" aria-hidden="true" />
            <span>Tampa Bay Region</span>
          </div>
          <span className="sources-text">FEMA · NOAA · USGS</span>
        </div>
      </header>

      <aside className="analyze-sidebar">
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
      </aside>

      <div className="analyze-main">
        <main className="analyze-map-area">
          <div className="map-frame">
            <MapView />
          </div>
        </main>

        <section className="info-strip">
          <div className="info-col">
            <span className="info-label">FLOOD ZONE</span>
            <span className="info-value">—</span>
            <span className="info-label">ELEVATION</span>
            <span className="info-value">—</span>
          </div>

          <div className="info-col">
            <span className="info-label">SURGE ZONE</span>
            <span className="info-value">—</span>
            <span className="info-label">DISTANCE TO COAST</span>
            <span className="info-value">—</span>
          </div>

          <div className="info-col score-col">
            <span className="score-placeholder">?</span>
            <span className="score-note">Score appears after analysis</span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Analyze
