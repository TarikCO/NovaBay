import { useEffect, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './MapView.css'

function MapView() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tampaCenter = [-82.4572, 27.9506]

    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
      center: tampaCenter,
      zoom: 11,
      maxBounds: [[-83.5, 27.2], [-81.8, 28.5]],
      minZoom: 9,
      maxZoom: 18,
      pitch: 0,
      bearing: 0,
    })

    map.addControl(new maplibregl.NavigationControl(), 'bottom-right')
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      'bottom-right',
    )
    map.addControl(new maplibregl.ScaleControl({ unit: 'imperial' }), 'bottom-left')
    map.dragRotate.disable()

    map.jumpTo({ center: tampaCenter, zoom: 8, pitch: 0, bearing: 0 })

    const handleLoad = () => {
      setIsLoading(false)

      map.flyTo({
        center: tampaCenter,
        zoom: 11,
        pitch: 0,
        bearing: 0,
        duration: 2000,
        essential: true,
      })

      setTimeout(() => {
        map.resize()
      }, 100)
    }

    map.on('load', handleLoad)

    let activeMarker = null

    map.on('click', (event) => {
      const { lng, lat } = event.lngLat
      console.log('Clicked coordinates:', { lng, lat })

      if (activeMarker) {
        activeMarker.remove()
      }

      const markerElement = document.createElement('div')
      markerElement.className = 'map-marker'
      markerElement.innerHTML = '<span class="map-marker-core"></span><span class="map-marker-pulse"></span>'

      activeMarker = new maplibregl.Marker({ element: markerElement, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map)
    })

    return () => {
      map.off('load', handleLoad)
      map.remove()
    }
  }, [])

  return (
    <div className="map-view">
      {isLoading && <div className="map-loading">Loading map...</div>}
      <div id="map" />
      <div className="map-hint">Click to drop a pin · Scroll to zoom</div>
    </div>
  )
}

export default MapView
