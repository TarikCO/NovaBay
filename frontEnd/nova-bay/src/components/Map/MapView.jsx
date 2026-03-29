import { useEffect, useState } from 'react'
import DeckGL from '@deck.gl/react'
import { GeoJsonLayer } from '@deck.gl/layers'
import { Map } from 'maplibre-gl'
import { supabase } from '../../supabaseClient' // Adjust path as needed
import 'maplibre-gl/dist/maplibre-gl.css'
import './MapView.css'

const INITIAL_VIEW_STATE = {
  longitude: -82.4572,
  latitude: 27.9506,
  zoom: 11,
  pitch: 0,
  bearing: 0
}

function MapView() {
  const [parcels, setParcels] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      // Call the SQL function we just created
      const { data, error } = await supabase.rpc('get_parcels_geojson')
      if (!error) setParcels(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const layers = [
    new GeoJsonLayer({
      id: 'parcels-layer',
      data: parcels,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 1,
      getFillColor: [31, 192, 216, 100], // Matches your --color-accent
      getLineColor: [255, 255, 255, 150],
      getLineWidth: 1,
      onClick: (info) => {
        if (info.object) {
          console.log('Parcel Data:', info.object.properties)
          // Here is where you will trigger the AI Analysis using the folio
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
          mapStyle="https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json" 
          attributionControl={false}
        />
      </DeckGL>
      <div className="map-hint">Click a parcel to analyze resilience</div>
    </div>
  )
}

export default MapView
