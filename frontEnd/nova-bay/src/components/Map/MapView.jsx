import { useEffect } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

function MapView() {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',
      center: [-82.4572, 27.9506],
      zoom: 11,
    })

    let activeMarker = null

    map.on('click', (event) => {
      const { lng, lat } = event.lngLat
      console.log('Clicked coordinates:', { lng, lat })

      if (activeMarker) {
        activeMarker.remove()
      }

      activeMarker = new maplibregl.Marker().setLngLat([lng, lat]).addTo(map)
    })

    return () => {
      map.remove()
    }
  }, [])

  return <div id="map" />
}

export default MapView
