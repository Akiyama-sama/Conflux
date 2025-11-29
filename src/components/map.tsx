import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import './App.css'

const accessKey = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken = accessKey
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!, 
      center: [-77.03915, 38.90025], // Washington DC
      zoom: 12.5,
      config: {
        basemap: { theme: 'faded'}
      }
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  return (
    <div className="flex absolute top-0 left-0 right-0 bottom-0 h-full w-full">
      {/* Sidebar placeholder */}
      <div className="w-1/4 p-4 bg-sg-light-green">
        <h2 className="text-sg-green text-xl font-bold">
          Stores nearby:
        </h2>
      </div>
      
      {/* Map container */}
      <div className="w-3/4">
        <div className="h-full w-full" ref={mapContainerRef} />
      </div>
    </div>
  )
}

export default App