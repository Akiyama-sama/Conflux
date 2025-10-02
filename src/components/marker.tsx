import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import mapboxgl from 'mapbox-gl'
import { sensorIconData } from '@/feature/index/data/sensor-icon-data'
import { SensorStatus, type AnySensor } from '@/data/sensor'
interface MarkerProps {
  feature: AnySensor
  map: mapboxgl.Map
  selectedSensor: AnySensor | null
  setSelectedSensor: Function
}

const Marker = ({
  map,
  feature,
  selectedSensor,
  setSelectedSensor,
}: MarkerProps) => {
  const { geometry , status } = feature
  const { icon, color } = sensorIconData[feature.type]
  const contentRef = useRef(document.createElement('div'))
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const isSelected = feature.id === selectedSensor?.id
  useEffect(() => {
    markerRef.current = new mapboxgl.Marker(contentRef.current)
      .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
      .addTo(map)

    return () => {
      markerRef.current?.remove()
    }
  }, [])

  return (
    <>
      {createPortal(
        <div
          onClick={() => setSelectedSensor(feature)}
          className={`${isSelected ? 'bg-primary text-background hover:bg-primary' : 
            (status != SensorStatus.WARNING) ? 'bg-background hover:bg-secondary shadow-md' : 'bg-destructive hover:bg-destructive' } 
            
            rounded-full p-2  border-2 border-ring/50    bg-contain bg-no-repeat cursor-pointer transition w-[37px] h-[40px]`}
        >
          <div className="size-full flex items-center justify-center">
            {icon}
          </div>
        </div>,
        contentRef.current,
      )}
    </>
  )
}

export default Marker
