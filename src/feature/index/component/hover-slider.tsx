import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
// 1. 引入 Tooltip 相关的组件
import * as Tooltip from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function HoverSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    // 2. 使用 TooltipProvider 包裹整个组件，这是使用 Tooltip 的必要前提
    <Tooltip.Provider>
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-muted-foreground relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
            )}
          />
        </SliderPrimitive.Track>

        {/* 3. 在循环渲染 Thumb 的地方进行修改 */}
        {_values.map((val, index) => (
          <Tooltip.Root key={index}>
            <Tooltip.Trigger asChild>
              <SliderPrimitive.Thumb
                data-slot="slider-thumb"
                className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              />
            </Tooltip.Trigger>
            <Tooltip.Content
              // sideOffset 可以在 Thumb 和 Tooltip 之间增加一点间距
              sideOffset={5}
              // 添加一些基础样式让 Tooltip 更美观
              className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs"
            >
              {/* 4. 显示当前 Thumb 对应的值 */}
              {val}
            </Tooltip.Content>
          </Tooltip.Root>
        ))}
      </SliderPrimitive.Root>
    </Tooltip.Provider>
  )
}

export { HoverSlider }