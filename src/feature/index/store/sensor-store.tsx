import type { AnySensor } from '@/data/sensor'
import {sensorData} from '@/feature/index/data/sensor-data'
import {create} from 'zustand'

interface SensorState {
  sensors: AnySensor[];
  selectedSensor:AnySensor|null;
  setSensors: (sensors: AnySensor[]) => void;
  setSelectedSensor:(sensor:AnySensor)=>void
}

const useSensor = create<SensorState>((set) => ({
  sensors: sensorData,
  selectedSensor:null,
  setSensors: (sensors) => set({ sensors }),
  setSelectedSensor:(sensor)=>set({ selectedSensor: sensor })
}))

export default useSensor;