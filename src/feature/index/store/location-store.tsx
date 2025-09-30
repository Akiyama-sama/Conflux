import type { Location } from '@/data/location'
import {storeLocations} from '@/data/location'
import {create} from 'zustand'

interface LocationState {
  locations: Location[];
  selectedLocation:Location|null;
  setLocations: (locations: Location[]) => void;
  setSelectedLocation:(location:Location)=>void
}

const useLocation = create<LocationState>((set) => ({
  locations: storeLocations,
  selectedLocation:null,
  setLocations: (locations) => set({ locations }),
  setSelectedLocation:(location)=>set({ selectedLocation: location })
}))

export default useLocation;