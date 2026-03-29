import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/Map/MapView'
import RiskMapSidebar from '../components/RiskMap/RiskMapSidebar'
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
        <RiskMapSidebar />
      </aside>

      <div className="analyze-main">
        <main className="analyze-map-area">
          <MapView mapId="risk-map" />
        </main>
      </div>
    </div>
  )
}

export default Analyze
