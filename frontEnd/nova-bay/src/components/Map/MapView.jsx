import { useEffect, useState, useRef, useMemo} from 'react'
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

// Added onParcelSelect prop to communicate with the Sidebar
function MapView({ mapId = 'risk-map', onParcelSelect }) {
  const [parcels, setParcels] = useState(null)
  const [floodZones, setFloodZones] = useState(null) // FLOOD ZONE ADDITION: New state
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)

  // 1. Your Data Engine: Updated to fetch both parcels and flood zones
  useEffect(() => {
    async function loadMapData() {
      // Parallel fetch to load both layers simultaneously for better performance
      const [parcelRes, floodRes] = await Promise.all([
        supabase.rpc('get_parcels_geojson'),
        supabase.rpc('get_flood_zones_geojson') // FLOOD ZONE ADDITION: Fetching risk data
      ])
      
      if (!parcelRes.error) setParcels(parcelRes.data)
      if (!floodRes.error) setFloodZones(floodRes.data) // FLOOD ZONE ADDITION: Storing data
      
      setLoading(false)
    }
    loadMapData()
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

  const layers = useMemo(() => [
    // FLOOD ZONE ADDITION: The risk polygons layer (placed first so it's beneath parcels)
    new GeoJsonLayer({
      id: 'flood-zones-layer',
      data: floodZones || { type: 'FeatureCollection', features: [] }, // Fallback to empty
      filled: true,
      getFillColor: (f) => f.properties.zone_name === 'X' 
        ? [46, 204, 113, 80] // Green-ish for moderate risk (Zone X)
        : [231, 76, 60, 80],  // Red-ish for high risk (AE/VE zones)
      pickable: false, // We don't need to click the flood zones themselves
    }),

    new GeoJsonLayer({
      id: 'parcels-layer',
      data: parcels || { type: 'FeatureCollection', features: [] }, // Fallback to empty
      pickable: true,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 1,
      getFillColor: [31, 192, 216, 100], // NovaBay Cyan
      getLineColor: [255, 255, 255, 150],
      onClick: (info) => {
        if (info.object) {
          const props = info.object.properties;
          console.log('Parcel Data:', info.object.properties);
          // NEW: Triggers the sidebar update in Analyze.jsx
          if (typeof onParcelSelect === 'function') {
            setTimeout(() => {
              onParcelSelect(info.object.properties);
            }, 0);
          } else {
            console.warn('onParcelSelect prop is missing or not a function!');
          }
        }
      }
    })
  ], [parcels, floodZones, onParcelSelect]);

  return (
    <div className="map-view">
      {loading && <div className="map-loading">Querying GIS Records...</div>}
      
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