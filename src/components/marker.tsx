import { useEffect, useRef } from "react"
import { createPortal } from "react-dom";
import mapboxgl from 'mapbox-gl'

import type { AnySensor } from '@/data/sensor'
interface MarkerProps {
  feature: AnySensor
  map: mapboxgl.Map
  selectedSensor: AnySensor | null
  setSelectedSensor: Function
}

const Marker = ({ map, feature ,selectedSensor,setSelectedSensor}: MarkerProps) => {
    const { geometry } = feature

    const contentRef = useRef(document.createElement("div"));
    const markerRef = useRef<mapboxgl.Marker | null>(null)
    const isSelected = feature.id === selectedSensor?.id;
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
                    className={'bg-contain bg-no-repeat cursor-pointer transition w-[37px] h-[40px]'}
                    style={{
                        backgroundImage: (
                            isSelected
                            ? 'url("./sg-marker-selected.svg")' 
                            : 'url("./sg-marker.svg")'),
                    }}>
                </div>,
                contentRef.current
            )}
        </>
    )
}

export default Marker