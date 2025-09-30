import { useEffect, useRef } from "react"
import { createPortal } from "react-dom";
import mapboxgl from 'mapbox-gl'

import type { Location } from '@/data/location'
interface MarkerProps {
  feature: Location
  map: mapboxgl.Map
  selectedLocation: Location | null
  setSelectedLocation: Function
}

const Marker = ({ map, feature ,selectedLocation,setSelectedLocation}: MarkerProps) => {
    const { geometry } = feature

    const contentRef = useRef(document.createElement("div"));
    const markerRef = useRef<mapboxgl.Marker | null>(null)
    const isSelected = feature.properties.name === selectedLocation?.properties.name;
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
                    onClick={() => setSelectedLocation(feature)}
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