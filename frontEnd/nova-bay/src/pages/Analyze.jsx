import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/Map/MapView'
import RiskMapSidebar from '../components/RiskMap/RiskMapSidebar'
import './Analyze.css'

function Analyze() {
  // NEW: This state holds the parcel data when you click on the map
  const [selectedParcel, setSelectedParcel] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Tarik's original resize logic to fix map alignment on load
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

      {/* NEW: Using the standalone Sidebar component and passing it the data */}
      <RiskMapSidebar 
        selectedParcel={selectedParcel} 
      />

      <div className="analyze-main">
        <main className="analyze-map-area">
          {/* NEW: Passing the setter function so the map can "send" data back up */}
          <MapView onParcelSelect={setSelectedParcel} />
        </main>
      </div>
    </div>
  )
}

export default Analyze
