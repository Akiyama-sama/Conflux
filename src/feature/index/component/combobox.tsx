"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import useLocation from "../store/location-store"



export function Combobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { locations, selectedLocation, setSelectedLocation } = useLocation()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[80%] justify-between"
        >
          {selectedLocation
            ? selectedLocation.properties.name
            : "选择一处传感器地点"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="搜索传感器地点..." />
          <CommandList>
            <CommandEmpty>没有找到传感器地点。</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.properties.name}
                  value={location.properties.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSelectedLocation(locations.find((location) => location.properties.name === currentValue)!)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location.properties.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location.properties.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}