
import {create} from 'zustand'

interface Circle {
    level: number;
    hour: number;
    depth: number;
    population: number;
    property: number;
    coordinates: [number, number];
}


interface CircleState {
  circle: Circle | null;
  setCircle: (circle: Circle | null) => void;
}

const useCircle = create<CircleState>((set) => ({
  circle: null,
  setCircle: (circle) => set({ circle }),
}))

export default useCircle;