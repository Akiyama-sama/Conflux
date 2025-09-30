import {  type AnySensor, SensorStatus, SensorType,  type WaterLevelSensor,  type RainfallSensor,  type AICameraSensor,  type WeatherStationSensor } from "@/data/sensor";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Gauge, Wind, Waves, CloudRain, Camera, AlertTriangle, CheckCircle, XCircle, WifiOff, Timer, MapPin } from "lucide-react";
import SensorHistoryChart from "./sensor-history-chart";
import { cn } from "@/lib/utils";

const statusMap = {
  [SensorStatus.NORMAL]: { 
    label: '正常', 
    className: 'bg-chart-3/10 text-chart-3 border-chart-3/20', 
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    color: 'var(--color-chart-3)'
  },
  [SensorStatus.WARNING]: { 
    label: '告警', 
    className: 'bg-chart-2/10 text-chart-2 border-chart-2/20', 
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    color: 'var(--color-chart-2)'
  },
  [SensorStatus.ERROR]: { 
    label: '故障', 
    className: 'bg-chart-4/10 text-chart-4 border-chart-4/20', 
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: 'var(--color-chart-4)' 
  },
  [SensorStatus.OFFLINE]: { 
    label: '离线', 
    className: 'bg-chart-5/10 text-chart-5 border-chart-5/20', 
    icon: <WifiOff className="h-3.5 w-3.5" />,
    color: 'var(--color-chart-5)' 
  },
};

interface DataItemProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  warning?: boolean;
  danger?: boolean;
}

const DataItem = ({ icon, label, value, unit = '', warning = false, danger = false }: DataItemProps) => (
  <div className={cn(
    "flex items-center gap-2 p-2 rounded-lg",
    warning ? "bg-sidebar-ring/5 border border-sidebar-ring/10" : null,
    danger ? "bg-destructive/5 border border-destructive/10" : null,
    !warning && !danger ? "bg-muted/30" : null
  )}>
    {icon && <div className={cn(
      "flex items-center justify-center w-8 h-8 rounded-md",
      warning ? "text-sidebar-ring bg-sidebar-ring/10" : null,
      danger ? "text-destructive bg-destructive/10" : null,
      !warning && !danger ? "text-muted-foreground bg-muted/50" : null
    )}>
      {icon}
    </div>}
    <div className="flex-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn(
        "font-medium",
        warning ? "text-ring" : null,
        danger ? "text-destructive" : null
      )}>
        {value} {unit}
      </div>
    </div>
  </div>
);

const SensorDetails = ({ sensor }: { sensor: AnySensor }) => {
  
  const renderSensorSpecificDetails = () => {
    switch (sensor.type) {
      case SensorType.WaterLevel:
        const wlSensor = sensor as WaterLevelSensor;
        
        // Calculate fill percentage based on current level vs danger threshold
        const fillPercentage = Math.min(
          Math.max((wlSensor.currentLevel / wlSensor.dangerThreshold) * 100, 0),
          100
        );
        
        const isWarning = wlSensor.currentLevel >= wlSensor.warningThreshold;
        const isDanger = wlSensor.currentLevel >= wlSensor.dangerThreshold;
        
        return (
          <>
            <div className="flex flex-col space-y-3 mb-4">
              {/* Water level visualization */}
              <div className="flex items-center gap-3">
                <div className="relative w-2 h-24 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "absolute bottom-0 w-full rounded-full transition-all duration-700 ease-out",
                      isDanger ? "bg-destructive" : 
                      isWarning ? "bg-ring" : 
                      "bg-sidebar-ring/70"
                    )}
                    style={{ height: `${fillPercentage}%` }}
                  />
                  
                  {/* Danger threshold marker */}
                  <div 
                    className="absolute w-3 h-0.5 -right-0.5 bg-destructive/80" 
                    style={{ bottom: `${(wlSensor.dangerThreshold / wlSensor.dangerThreshold) * 100}%` }}
                  />
                  
                  {/* Warning threshold marker */}
                  <div 
                    className="absolute w-3 h-0.5 -right-0.5 bg-chart-2/80" 
                    style={{ bottom: `${(wlSensor.warningThreshold / wlSensor.dangerThreshold) * 100}%` }}
                  />
                </div>
                
                <div className="flex-1 grid grid-cols-1 gap-2">
                  <DataItem 
                    icon={<Waves className="h-4 w-4" />}
                    label="当前水位"
                    value={wlSensor.currentLevel}
                    unit="m"
                    warning={isWarning && !isDanger}
                    danger={isDanger}
                  />
                  
                  {wlSensor.flowRate && 
                    <DataItem 
                      icon={<Wind className="h-4 w-4" />}
                      label="实时水流量"
                      value={wlSensor.flowRate}
                      unit="m³/s"
                    />
                  }
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <DataItem 
                  icon={<AlertTriangle className="h-4 w-4" />}
                  label="警戒水位"
                  value={wlSensor.warningThreshold}
                  unit="m"
                  warning={true}
                />
                <DataItem 
                  icon={<AlertTriangle className="h-4 w-4" />}
                  label="危险水位"
                  value={wlSensor.dangerThreshold}
                  unit="m"
                  danger={true}
                />
              </div>
            </div>
            <SensorHistoryChart data={wlSensor.historicalData} dataKey="level" unit="m" />
          </>
        );
      case SensorType.Rainfall:
        const rfSensor = sensor as RainfallSensor;
        
        // Determine intensity level
        const isHeavy = rfSensor.currentIntensity >= 8;
        const isExtreme = rfSensor.currentIntensity >= 16;
        
        return (
          <>
            <div className="flex flex-col space-y-3 mb-4">
              <div className="grid grid-cols-1 gap-3">
                <DataItem 
                  icon={<CloudRain className="h-4 w-4" />}
                  label="当前降雨强度"
                  value={rfSensor.currentIntensity}
                  unit="mm/h"
                  warning={isHeavy}
                  danger={isExtreme}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <DataItem 
                    label="1小时累计"
                    value={rfSensor.hourlyAccumulation}
                    unit="mm"
                    warning={rfSensor.hourlyAccumulation >= 10}
                  />
                  <DataItem 
                    label="24小时累计"
                    value={rfSensor.dailyAccumulation}
                    unit="mm"
                    warning={rfSensor.dailyAccumulation >= 50}
                    danger={rfSensor.dailyAccumulation >= 100}
                  />
                </div>
              </div>
            </div>
            <SensorHistoryChart data={rfSensor.historicalData} dataKey="intensity" unit="mm/h" />
          </>
        );
      case SensorType.AICamera:
        const camSensor = sensor as AICameraSensor;
        
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <DataItem 
                icon={<Waves className="h-4 w-4" />}
                label="积水深度"
                value={camSensor.detectedWaterDepth}
                unit="cm"
                warning={camSensor.detectedWaterDepth >= 5}
                danger={camSensor.detectedWaterDepth >= 15}
              />
              <DataItem 
                icon={<AlertTriangle className="h-4 w-4" />}
                label="风险等级"
                value={camSensor.riskLevel}
                warning={camSensor.riskLevel === '严重拥堵'}
                danger={camSensor.riskLevel === '道路中断'}
              />
            </div>
            
            <div className="relative overflow-hidden rounded-lg aspect-video bg-muted/30">
              <img 
                src={camSensor.latestImageUrl} 
                alt="实时画面" 
                className="rounded-lg w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400/0f172a/f8fafc?text=No+Image';
                }}
              />
              <div className="absolute bottom-2 right-2">
                <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur-sm text-xs">
                  <Camera className="h-3 w-3 mr-1" /> 实时画面
                </Badge>
              </div>
            </div>
          </div>
        );
      case SensorType.WeatherStation:
        const wsSensor = sensor as WeatherStationSensor;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <DataItem 
                icon={<Thermometer className="h-4 w-4" />}
                label="温度"
                value={wsSensor.temperature}
                unit="°C"
                warning={wsSensor.temperature >= 35 || wsSensor.temperature <= 0}
                danger={wsSensor.temperature >= 40 || wsSensor.temperature <= -10}
              />
              <DataItem 
                icon={<Droplets className="h-4 w-4" />}
                label="湿度"
                value={wsSensor.humidity}
                unit="%"
              />
              <DataItem 
                icon={<Gauge className="h-4 w-4" />}
                label="气压"
                value={wsSensor.pressure}
                unit="hPa"
              />
              <DataItem 
                icon={<Wind className="h-4 w-4" />}
                label="风速"
                value={wsSensor.windSpeed}
                unit="m/s"
                warning={wsSensor.windSpeed >= 10.8}
                danger={wsSensor.windSpeed >= 17.2}
              />
            </div>
            
            <div className="p-2 rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground mb-2">风向</div>
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24">
                  {/* Compass markers */}
                  <div className="absolute inset-0 rounded-full border border-border">
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/70">N</span>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/70">S</span>
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/70">W</span>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/70">E</span>
                  </div>

                  {/* Arrow SVG */}
                  <div
                    className="absolute inset-0 transition-transform duration-500 ease-in-out"
                    style={{ transform: `rotate(${wsSensor.windDirection}deg)` }}
                  >
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-primary"
                    >
                      <defs>
                        <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>

                      {/* Arrow */}
                      <path
                        d="M 50 12 L 44 22 L 50 20 L 56 22 Z"
                        className="fill-primary"
                      />
                      <path
                        d="M 50 20 L 50 50"
                        stroke="url(#arrow-gradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 50 88 L 50 50"
                        className="stroke-primary/40"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Central Value */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-semibold text-foreground">
                      {wsSensor.windDirection}°
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <p>未知传感器类型。</p>;
    }
  };

  const statusInfo = statusMap[sensor.status];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="font-medium tracking-tight">{sensor.name}</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-md bg-muted/50 text-xs font-normal">
              {sensor.type}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{sensor.geometry.coordinates.join(', ')}</span>
            </div>
          </div>
        </div>
        
        <Badge variant="outline" className={cn("rounded-md px-2 py-1 flex items-center gap-1", statusInfo.className)}>
          {statusInfo.icon}
          <span>{statusInfo.label}</span>
        </Badge>
      </div>
      
      <div className="space-y-4">
        {renderSensorSpecificDetails()}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            <span>UPDATED AT: {new Date(sensor.lastUpdated).toLocaleString()}</span>
          </div>
          <div className="text-right">SENSOR ID: {sensor.id}</div>
        </div>
      </div>
    </div>
  );
};

export default SensorDetails;
