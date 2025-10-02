
import { Combobox } from './combobox'
import { Separator } from "@/components/ui/separator"
import useSensor from '../../../hooks/sensor-store'
import SensorDetails from './sensor-details'


const Sidebar = () => {
  const { selectedSensor } = useSensor();
  
  return (
    <div className="w-1/4 h-full bg-background shadow-lg border-l border-sidebar-border flex flex-col overflow-hidden">
      <div className="p-5">
        <Combobox />
      </div>
      <Separator className="opacity-20" />
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {selectedSensor ? (
          <SensorDetails sensor={selectedSensor} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-sm text-center ">
            
            <p>请选择一个传感器以查看详细信息</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
