
import { useEffect, useRef } from 'react'
import useLocation from '../store/location-store'
import {Combobox} from './combobox'
import { Separator } from "@/components/ui/separator"
const Sidebar = () => {
  
  return (
    <div className="w-2/7 p-4  h-full bg-sidebar-primary-foreground shadow-xl flex flex-col gap-4 ">
      
      <div className='flex justify-center'>
      <Combobox />
      </div>
      <Separator  className='w-full'/>
      
     
    </div>
  )
}

export default Sidebar
