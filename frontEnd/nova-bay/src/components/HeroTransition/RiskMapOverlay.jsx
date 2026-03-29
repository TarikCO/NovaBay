import { useEffect, useRef } from 'react'
import MapView from '../Map/MapView'
import RiskMapSidebar from '../RiskMap/RiskMapSidebar'
import './RiskMapOverlay.css'

export default function RiskMapOverlay({ isActive, onClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('map-transition-show', {
          detail: { mapId: 'hero-transition-map' },
        }))
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <>
      <div className={`hero-transition-map-container${isActive ? ' map-visible' : ''}`}>
        <MapView mapId="hero-transition-map" />
      </div>

      <aside className={`hero-transition-panel${isActive ? ' is-active' : ''}`} ref={panelRef}>
        <RiskMapSidebar showBack onBack={onClose} className="hero-transition-sidebar" />
      </aside>
    </>
  )
}
