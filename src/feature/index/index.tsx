import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import Marker from '@/components/marker'
import Sidebar from '@/feature/index/component/sidebar'
import useSensor from '@/hooks/sensor-store'

import useTimeLine from '../../hooks/timeLine-store'
import showDangerToast from './component/danger-toast'
import { timeToastData } from './data/time-toast-data'
import { useNavigate } from '@tanstack/react-router'
import useCircle from '@/hooks/circle-store'
import HoverBlock from './component/hover-block'
import { HoverSlider } from './component/hover-slider'
import { useSideBar } from '@/hooks/sidebar-store'
import { useChat } from '@/hooks/use-chat'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

function App() {
  
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const {sendMessage}=useChat({})
  const { sensors, selectedSensor, setSelectedSensor } = useSensor()
  const { time, setTime } = useTimeLine()
  const {  setCircle } = useCircle()
  const [mapLoaded, setMapLoaded] = useState(false)
  const { setSideBar}=useSideBar()
  const navigate = useNavigate()
  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken =
      MAPBOX_ACCESS_TOKEN

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      // style:'mapbox://styles/mapbox/light-v11',
      center: [ 119.202876,26.034701], // fujian university
      zoom: 8.8,
      config: {
        basemap: { theme: 'faded' },
      },
    })
    mapRef.current.on('load', () => {
      if (!mapRef.current) return
      setMapLoaded(true)

      mapRef.current.addLayer({
        id: 'fujian',
        type: 'circle',
        source: {
          type: 'geojson',
          data: './src/feature/index/data/fuzhou-flood-risk-12-random-hours.geojson', // replace this with the url of your own geojson
        },
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['number', ['get', 'Level']],
            1,
            6,
            2,
            10,
            3,
            15,
            4,
            20,
            5,
            25,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['number', ['get', 'Level']],
            0,
            '#94a3b8',
            1,
            '#7dd3fc',
            2,
            '#669EC4',
            3,
            '#0c4a6e',
            4,
            '#fb923c',
            5,
            '#f87171',
          ],
          'circle-opacity': 0.75,
        },
      })
    })
    //鼠标悬停时拿到对应的geojson数据
    mapRef.current.on('mousemove', 'fujian', (e) => {
      if (!mapRef.current) return
      if (e.features && e.features.length > 0) {
        mapRef.current.getCanvas().style.cursor = 'pointer'
        const feature = e.features[0]
        if (feature.geometry && feature.geometry.type === 'Point') {
          const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice()
          setCircle({
            level: feature.properties?.Level,
            hour: feature.properties?.Hour,
            depth: feature.properties?.Depth,
            population: feature.properties?.Population,
            property: feature.properties?.Property,
            coordinates: coordinates as [number, number],
          })
        }
      }
    })

    mapRef.current.on('mouseleave', 'fujian', () => {
      if (!mapRef.current) return
      setCircle(null)
      mapRef.current.getCanvas().style.cursor = ''
    })
    return () => {
      mapRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    //给地图添加带有时间轴的图层
    if (!mapRef.current || !mapLoaded) return
    if (mapRef.current.getLayer('fujian')) {
      mapRef.current.setFilter('fujian', [
        '==',
        ['number', ['get', 'Hour']],
        time[0],
      ])
    }
    const timeToast = timeToastData.find(item => item.timeLine[0] === time[0])
    if(timeToast){
      const focusSensor = sensors.find(item => item.geometry.coordinates[0] === timeToast?.location[0] && item.geometry.coordinates[1] === timeToast?.location[1])
      focusSensor && setSelectedSensor(focusSensor)
      showDangerToast({ timeLine: time, message: timeToast?.message || "", onClickNavigate: () => navigate({ to: "/notification" }),onClickAgent:()=>{
        setSideBar('chatbot')
        console.log('0')
        if(timeToast.agentMessage){
          setTimeout(()=>{
            sendMessage({
              role: "user",
              parts: [
                {
                  type: "text",
                  text: timeToast.agentMessage,
                },
              ],
            })
          },500)
        }
      } })
    }
  }, [time[0], mapLoaded])

  useEffect(() => {
    if (!selectedSensor) return

    mapRef.current!.flyTo({
      center: [
        selectedSensor.geometry.coordinates[0],
        selectedSensor.geometry.coordinates[1],
      ],
      zoom: 9.8,
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
        <HoverSlider
          defaultValue={[0]}
          value={time}
          onValueChange={(t) => {
            setTime(t)
          }}
          max={23}
          step={1}
          className="absolute w-[50%] bottom-20 left-1/2  -translate-x-1/2"
        />
        <HoverBlock/>
      </div>
      
    </div>
  )
}

export default App
