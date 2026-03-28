import { useNavigate } from 'react-router-dom'
import MapView from '../components/Map/MapView'
import './Analyze.css'

function Analyze() {
  const navigate = useNavigate()

  return (
    <div className="analyze-page">
      <header className="analyze-topbar">
        <div className="analyze-brand">Stilts</div>
        <button type="button" className="analyze-home" onClick={() => navigate('/')}>
          ← Home
        </button>
      </header>

      <div className="analyze-layout">
        <main className="analyze-map-area">
          <MapView />
        </main>
        <aside className="analyze-sidebar" />
      </div>
    </div>
  )
}

export default Analyze
