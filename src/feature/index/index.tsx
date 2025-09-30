import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import Marker from '@/components/marker'
import Sidebar from '@/feature/index/component/sidebar'
import useSensor from '@/feature/index/store/sensor-store'
import { Slider } from '@/components/ui/slider'
import useTimeLine from './store/timeLine-store'
function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { sensors, selectedSensor, setSelectedSensor } = useSensor()
  const { time, setTime } = useTimeLine()
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken =
      'pk.eyJ1IjoiMjA5MTQzMzI4MSIsImEiOiJjbWc0a3hlOTgxazY3MmxvaXo1OW9nam1vIn0.qetux1BMTZnSoVIR9Q47qQ'

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      // style:'mapbox://styles/mapbox/light-v11',
      center: [-74.0059, 40.7128] /*  [ 119.202876,26.034701], */, // fujian university
      zoom: 12.5,
      config: {
        basemap: { theme: 'faded' },
      },
    })
    mapRef.current.on('load', () => {
      if (!mapRef.current) return
      setMapLoaded(true)
      mapRef.current.addLayer({
        id: 'collisions',
        type: 'circle',
        source: {
          type: 'geojson',
          data: './src/feature/index/data/collisions1601.geojson', // replace this with the url of your own geojson
        },
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['number', ['get', 'Casualty']],
            0,
            4,
            5,
            24,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['number', ['get', 'Casualty']],
            0,
            '#2DC4B2',
            1,
            '#3BB3C3',
            2,
            '#669EC4',
            3,
            '#8B88B6',
            4,
            '#A2719B',
            5,
            '#AA5E79',
          ],
          'circle-opacity': 0.8,
        },
      })
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return
    if (mapRef.current.getLayer('collisions')) {
      mapRef.current.setFilter('collisions', [
        '==',
        ['number', ['get', 'Hour']],
        time[0],
      ])
    }
  }, [time[0], mapLoaded])

  useEffect(() => {
    if (!selectedSensor) return

    mapRef.current!.flyTo({
      center: [
        selectedSensor.geometry.coordinates[0],
        selectedSensor.geometry.coordinates[1],
      ],
      zoom: 13,
      duration: 1000,
    })
  }, [selectedSensor])

  return (
    <div className="flex absolute top-0 left-0 right-0 bottom-0 h-full w-full">
      {/* Sidebar placeholder */}
      <Sidebar />

      {/* Map container */}
      <div className="flex-1 relative">
        <div className="h-full w-full" ref={mapContainerRef} />
        {mapLoaded &&
          sensors.map((sensor) => (
            <Marker
              key={sensor.id}
              feature={sensor}
              map={mapRef.current!}
              setSelectedSensor={setSelectedSensor}
              selectedSensor={selectedSensor}
            />
          ))}
        <Slider
          defaultValue={[0]}
          value={time}
          onValueChange={(t) => {
            setTime(t)
          }}
          max={23}
          step={1}
          className="absolute w-[50%] bottom-20 left-1/2  -translate-x-1/2"
        />
      </div>
    </div>
  )
}

export default App
