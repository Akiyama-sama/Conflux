"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface ChartData {
    timestamp: string;
    [key: string]: any;
}

interface SensorHistoryChartProps {
    data: ChartData[];
    dataKey: string;
    unit: string;
    className?: string;
}

const SensorHistoryChart = ({ data, dataKey, unit, className }: SensorHistoryChartProps) => {
    const chartConfig = {
        value: {
          label: dataKey,
          color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const formattedData = data.map(d => ({
        ...d, 
        time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }));

    const average = data.length > 0 ? (data.reduce((acc, curr) => acc + curr[dataKey], 0) / data.length) : 0;
    const lastValue = data.length > 0 ? data[data.length - 1][dataKey] : 0;
    const firstValue = data.length > 0 ? data[0][dataKey] : 0;
    const trend = lastValue - firstValue;
    const trendPercentage = firstValue !== 0 ? (trend / firstValue) * 100 : 0;

    return (
        <Card className={cn("overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-card/95", className)}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">历史数据趋势</CardTitle>
                <CardDescription className="text-xs opacity-70">最近16小时</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">{unit}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-1">
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedData}
                  margin={{
                    left: -20,
                    right: 8,
                  }}
                >
                  <CartesianGrid stroke="var(--color)" strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    tickFormatter={(value) => value}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    tickFormatter={(value) => `${value}`}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="bg-popover/95 backdrop-blur-sm border border-border shadow-md"
                        labelFormatter={(label, payload) => {
                          const originalTimestamp = payload[0]?.payload?.timestamp;
                          if(originalTimestamp) {
                            return new Date(originalTimestamp).toLocaleString();
                          }
                          return label;
                        }}
                        formatter={(value) => [`${value} ${unit}`]}
                        indicator="dot"
                      />
                    }
                  />
                  <Bar
                    dataKey={dataKey}
                    fill="var(--sidebar-ring)"
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
            <div className="flex gap-2 leading-none font-medium">
              <TrendingUp className="h-4 w-4" />
              {trend >= 0 ? "趋势上升" : "趋势下降"} by {Math.abs(trendPercentage).toFixed(1)}%
            </div>
            <div className="text-muted-foreground leading-none">
              平均值: {average.toFixed(2)} {unit}
            </div>
          </CardFooter>
        </Card>
      )
}

export default SensorHistoryChart;
