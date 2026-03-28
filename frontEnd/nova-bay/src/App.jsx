import MapView from './components/Map/MapView'

function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar" />
      <main className="map-panel">
        <MapView />
      </main>
    </div>
  )
}

export default App
