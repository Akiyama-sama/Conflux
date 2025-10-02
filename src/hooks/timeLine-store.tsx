
import {create} from 'zustand'

interface TimeLineState {
    time:number[]
    setTime:(time:number[])=>void
}

const useTimeLine = create<TimeLineState>((set) => ({
    time:[0],
    setTime:(time)=>set({time})
}))

export default useTimeLine;