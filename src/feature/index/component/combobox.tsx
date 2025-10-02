"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, MapPinIcon, BarChart4Icon, ShieldAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import useSensor from "@/hooks/sensor-store"
import { SensorStatus } from "@/data/sensor"

export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState<SensorStatus | null>(null)
  
  const { sensors, selectedSensor, setSelectedSensor } = useSensor()

  const filteredSensors = React.useMemo(() => {
    if (!filterStatus) return sensors;
    return sensors.filter(sensor => sensor.status === filterStatus);
  }, [sensors, filterStatus]);

  const getStatusColor = (status: SensorStatus) => {
    switch(status) {
      case SensorStatus.NORMAL: return "text-chart-3";
      case SensorStatus.WARNING: return "text-chart-2";
      case SensorStatus.ERROR: return "text-chart-4";
      case SensorStatus.OFFLINE: return "text-chart-5";
      default: return "";
    }
  };
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between shadow-md text-sidebar-ring text-xl text-bold  hover:bg-sidebar-border/20 focus:ring-sidebar-ring focus-visible:ring-sidebar-ring"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPinIcon className="h-4 w-4 text-ring" />
            <span className="truncate">
              {selectedSensor
                ? selectedSensor.name
                : "选择传感器位置"}
            </span>
          </div>
          <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command className="rounded-lg border border-border">
          <CommandInput 
            placeholder="搜索传感器型号..." 
            className="h-9" 
          />
          
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              没有找到匹配的传感器
            </CommandEmpty>
            
            <div className="flex items-center px-2 py-1.5 sticky top-0 bg-popover z-10 border-b">
              <span className="text-xs font-medium text-muted-foreground mr-2">状态筛选:</span>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-7 px-2 text-xs rounded-full", 
                    !filterStatus ? "bg-primary/10 text-primary" : ""
                  )}
                  onClick={() => setFilterStatus(null)}
                >
                  全部
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-7 px-2 text-xs rounded-full", 
                    filterStatus === SensorStatus.WARNING ? "bg-sidebar-ring/10 text-sidebar-ring" : ""
                  )}
                  onClick={() => setFilterStatus(SensorStatus.WARNING)}
                >
                  <ShieldAlertIcon className="h-3 w-3 mr-1" />
                  告警
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-7 px-2 text-xs rounded-full", 
                    filterStatus === SensorStatus.NORMAL ? "bg-chart-3/10 text-chart-3" : ""
                  )}
                  onClick={() => setFilterStatus(SensorStatus.NORMAL)}
                >
                  正常
                </Button>
              </div>
            </div>
            
            <CommandGroup>
              {filteredSensors.map((sensor) => (
                <CommandItem
                  key={sensor.id}
                  value={sensor.name}
                  onSelect={() => {
                    setSelectedSensor(sensor);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between py-2 "
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full mr-2",
                      getStatusColor(sensor.status)
                    )} />
                    <span className="mr-2">{sensor.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-2">
                      {sensor.type}
                    </span>
                    <CheckIcon
                      className={cn(
                        "h-4 w-4",
                        selectedSensor?.id === sensor.id
                          ? "opacity-100 text-primary"
                          : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <div className="py-2 px-2 text-xs text-muted-foreground flex justify-between">
              <span>总计: {filteredSensors.length} 个传感器</span>
              <div className="flex items-center gap-1">
                <BarChart4Icon className="h-3 w-3" />
                <span>数据实时更新</span>
              </div>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}