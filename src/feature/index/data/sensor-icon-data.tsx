import { CloudRainWind ,  Droplets,Cloudy,Camera,Thermometer} from 'lucide-react';
import { SensorType } from '@/data/sensor';

export const sensorIconData = {
    [SensorType.WaterLevel]: {
        icon: <CloudRainWind />,
        color: 'var(--color-chart-3)'
    },
    [SensorType.Rainfall]: {
        icon: <Droplets />,
        color: 'var(--color-chart-2)'
    },
    [SensorType.WeatherStation]: {
        icon: <Cloudy />,
        color: 'var(--color-chart-1)'
    },
    [SensorType.AICamera]: {
        icon: <Camera />,
        color: 'var(--color-chart-4)'
    },
    [SensorType.SoilMoisture]: {
        icon: <Thermometer />,
        color: 'var(--color-chart-5)'
    }
}


