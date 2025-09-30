
import { useEffect, useRef } from 'react'
import useLocation from '../store/location-store'


const Sidebar = () => {
  const { locations, selectedLocation, setSelectedLocation } = useLocation()

  const storeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  useEffect(() => {
    if (
      selectedLocation &&
      storeRefs.current &&
      storeRefs.current[selectedLocation.properties.name]
    ) {
      const element = storeRefs.current[selectedLocation.properties.name]
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth', // Optionally smooth scrolling
          block: 'start', // Align the element to the top of the container
        })
      }
    }
  }, [selectedLocation])

  return (
    <div className="w-2/5 p-4   overflow-y-auto bg-sidebar-primary-foreground shadow-xl  ">
      {locations.map((location) => {
        const isSelected = location.properties.name === selectedLocation?.properties.name;
        return (
          <div 
            key={location.properties.name} 
            ref={(el) => {storeRefs.current[location.properties.name] = el}}
            onClick={()=> setSelectedLocation(location)}
            className={`${isSelected ? 'bg-white' : 'bg-transparent'} hover:bg-white/50 relative flex flex-col my-4 border border-sg-green rounded-lg transition-all duration-200 cursor-pointer p-4`}>
            <h4 className="mb-2 text-sg-green text-xl font-semibold">{location.properties.name}</h4>
            <div className="text-sg-green leading-normal font-light">
                <div>
                    <span className="font-bold text-sm">Address: </span>{location.properties.address}
                </div>    
                <div>
                    <span className="font-bold text-sm">Phone: </span>{location.properties.phoneFormatted}
                </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Sidebar
