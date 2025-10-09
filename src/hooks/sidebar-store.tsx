import { useState } from "react";
type SideBar='sensor'| 'chatbot'

export const useSideBar=()=>{
   const[sideBar,setSideBar] =useState<SideBar>('sensor')
   return {
    sideBar,
    setSideBar
   }
}