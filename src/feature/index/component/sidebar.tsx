import { Combobox } from './combobox'
import { Separator } from '@/components/ui/separator'
import useSensor from '@/hooks/sensor-store'
import SensorDetails from './sensor-details'
import Chatbot from './chatbot/chatbot'
import { useSideBar } from '@/hooks/sidebar-store'

const Sidebar = () => {
  const { selectedSensor } = useSensor()
  const {sideBar,setSideBar}= useSideBar()


  return (
    
    <div className="w-1/4 h-full bg-background shadow-lg border-l border-sidebar-border flex flex-col overflow-hidden">
      <div className='sidebar-router w-full flex h-6 justify-center space-x-4 text-sm pt-2 ' >
        <div className='hover:cursor-pointer'
        onClick={()=>setSideBar('sensor')}
        >传感器详情</div>
        <Separator orientation='vertical' className='border-1'/>
        <div className='hover:cursor-pointer'
        onClick={()=>setSideBar('chatbot')}
        >Conflux智能体</div>
      </div>
      {
        sideBar == 'sensor'?(
<div className="sensor-container">
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
        ):(
          <div className="chatbot-container w-full h-full flex max-w-full">
        <Chatbot />
      </div>
        )
      }
     
      
    </div>
  )
}

export default Sidebar
