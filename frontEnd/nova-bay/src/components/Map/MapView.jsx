import { useEffect, useState, useRef } from 'react'
import DeckGL from '@deck.gl/react'
import { GeoJsonLayer } from '@deck.gl/layers'
import { Map, NavigationControl, GeolocateControl, ScaleControl } from 'react-map-gl/maplibre'
import { supabase } from '../../supabaseClient'
import 'maplibre-gl/dist/maplibre-gl.css'
import './MapView.css'

const INITIAL_VIEW_STATE = {
  longitude: -82.4572,
  latitude: 27.9506,
  zoom: 11,
  pitch: 0,
  bearing: 0
}

function MapView({ mapId = 'risk-map' }) {
  const [parcels, setParcels] = useState(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)

  // 1. Your Data Engine: Fetch the 30k parcels from Supabase
  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase.rpc('get_parcels_geojson')
      if (!error) setParcels(data)
      setLoading(false)
    }
    loadData()
  }, [])

  // 2. Tarik's Transition Logic: Handles the "Fly In" from the Home Page
  useEffect(() => {
    const handleTransitionShow = (event) => {
      if (event.detail?.mapId && event.detail.mapId !== mapId) return
      if (mapRef.current) {
        mapRef.current.getMap().resize()
      }
    }
    window.addEventListener('map-transition-show', handleTransitionShow)
    return () => window.removeEventListener('map-transition-show', handleTransitionShow)
  }, [mapId])

  const layers = [
    new GeoJsonLayer({
      id: 'parcels-layer',
      data: parcels,
      pickable: true,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 1,
      getFillColor: [31, 192, 216, 100], // NovaBay Cyan
      getLineColor: [255, 255, 255, 150],
      onClick: (info) => {
        if (info.object) {
          console.log('Parcel Data:', info.object.properties)
          // This folio is what Tarik's AI logic will use later
        }
      }
    })
  ]

  return (
    <div className="map-view">
      {loading && <div className="map-loading">Querying 30,000 Parcels...</div>}
      
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getCursor={({isHovering}) => isHovering ? 'pointer' : 'grab'}
      >
        <Map 
          ref={mapRef}
          mapStyle="https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json" 
          attributionControl={false}
        >
          {/* Tarik's UI Controls */}
          <NavigationControl position="bottom-right" />
          <GeolocateControl position="bottom-right" />
          <ScaleControl position="bottom-left" />
        </Map>
      </DeckGL>

      <div className="map-hint">Click a parcel to analyze resilience</div>
    </div>
  )
}

export default MapView
