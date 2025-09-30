import type { Location } from '@/data/sensor'
import { storeAnySensors } from '@/data/sensor'
import { create } from 'zustand'

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  setLocations: (locations: Location[]) => void;
  setSelectedLocation: (location: Location) => void
}

const useLocation = create<LocationState>((set) => ({
  locations: storeAnySensors,
  selectedLocation: null,
  setLocations: (locations) => set({ locations }),
  setSelectedLocation: (location) => set({ selectedLocation: location })
}))

export default useLocation;