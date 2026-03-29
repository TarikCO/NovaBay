import { useEffect, useRef, useState } from 'react'
import MapView from '../Map/MapView'
import './RiskMapOverlay.css'

export default function RiskMapOverlay({ isActive, onClose }) {
  const panelRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isActive) {
      setMounted(true)
      // Trigger reflow to apply animation
      setTimeout(() => {
        if (panelRef.current) {
          panelRef.current.classList.add('slide-in')
        }
      }, 10)
    } else if (mounted) {
      if (panelRef.current) {
        panelRef.current.classList.remove('slide-in')
      }
      const timer = setTimeout(() => setMounted(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isActive, mounted])

  if (!mounted) return null

  return (
    <>
      {/* Full-screen MapLibre container */}
      <div className="hero-transition-map-container">
        <MapView />
      </div>

      {/* Left panel overlay */}
      <aside className="hero-transition-panel" ref={panelRef}>
        <header className="transition-panel-header">
          <button
            type="button"
            className="transition-back-btn"
            onClick={onClose}
            aria-label="Back to home"
          >
            ← Back
          </button>
        </header>

        <div className="transition-panel-content">
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
      </aside>
    </>
  )
}
