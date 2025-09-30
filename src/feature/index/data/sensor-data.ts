// 该文件根据 storeAnySensors 生成传感器模拟数据
import type { AnySensor } from "@/data/sensor";
import { SensorStatus, SensorType, storeAnySensors } from "@/data/sensor";

// Helper function to generate timestamps for the last few hours
const generateTimestamps = (count: number, hoursApart: number): string[] => {
  const timestamps: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * hoursApart * 60 * 60 * 1000);
    timestamps.push(timestamp.toISOString());
  }
  return timestamps.reverse(); // Sort from past to present
};

// Helper to get a random item from an array
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const sensorData: AnySensor[] = storeAnySensors.map((AnySensor, index) => {
  const timestamps = generateTimestamps(8, 2); // 8 data points, 2 hours apart
  const lastUpdated = timestamps[timestamps.length - 1];
  const statusOptions: SensorStatus[] = [SensorStatus.NORMAL, SensorStatus.WARNING, SensorStatus.ERROR, SensorStatus.OFFLINE];

  const sensorTypeIndex = index % 4;

  switch (sensorTypeIndex) {
    // WaterLevelSensor
    case 0: {
      const historicalData = timestamps.map(ts => ({
        timestamp: ts,
        level: parseFloat((Math.random() * 11).toFixed(2)), // 0 to 11m
      }));
      const currentLevel = historicalData[historicalData.length - 1].level;
      const warningThreshold = 8.0;
      const dangerThreshold = 10.0;

      // This logic is good for demonstration but we will use random for variety
      // let status = SensorStatus.NORMAL;
      // if (currentLevel > dangerThreshold) {
      //   status = SensorStatus.ERROR;
      // } else if (currentLevel > warningThreshold) {
      //   status = SensorStatus.WARNING;
      // }

      return {
        id: crypto.randomUUID(),
        name: `HydroVantage ${2000 + index}`,
        type: SensorType.WaterLevel,
        geometry: AnySensor.geometry,
        status: getRandomItem(statusOptions),
        lastUpdated,
        department: '水务部门',
        currentLevel,
        warningThreshold,
        dangerThreshold,
        flowRate: parseFloat((Math.random() * 50 + 5).toFixed(2)), // 5 to 55
        historicalData,
      };
    }
    // RainfallSensor
    case 1: {
      const historicalData = timestamps.map(ts => ({
        timestamp: ts,
        intensity: parseFloat((Math.random() * 50).toFixed(2)), // 0 to 50 mm/h
      }));
      const currentIntensity = historicalData[historicalData.length - 1].intensity;

      return {
        id: crypto.randomUUID(),
        name: `RainGauge Pro ${100 + index}`,
        type: SensorType.Rainfall,
        geometry: AnySensor.geometry,
        status: getRandomItem(statusOptions),
        lastUpdated,
        department: '气象局',
        currentIntensity,
        hourlyAccumulation: parseFloat((Math.random() * 30).toFixed(2)),
        dailyAccumulation: parseFloat((Math.random() * 100).toFixed(2)),
        historicalData,
      };
    }
    // AICameraSensor
    case 2: {
      const riskLevels: ('无积水' | '轻度积水' | '严重拥堵' | '道路中断')[] = ['无积水', '轻度积水', '严重拥堵', '道路中断'];
      const riskLevel = getRandomItem(riskLevels);
      let detectedWaterDepth = 0;
      if (riskLevel === '轻度积水') detectedWaterDepth = parseFloat((Math.random() * 10 + 5).toFixed(1)); // 5-15 cm
      if (riskLevel === '严重拥堵' || riskLevel === '道路中断') detectedWaterDepth = parseFloat((Math.random() * 20 + 15).toFixed(1)); // 15-35 cm

      return {
        id: crypto.randomUUID(),
        name: `StreetEye AI-${500 + index}`,
        type: SensorType.AICamera,
        geometry: AnySensor.geometry,
        status: riskLevel === '道路中断' ? SensorStatus.ERROR : getRandomItem(statusOptions),
        lastUpdated,
        department: '交通管理',
        detectedWaterDepth,
        riskLevel,
        latestImageUrl: `https://picsum.photos/seed/${index}/400/300`,
        videoStreamUrl: `https://example.com/stream/${index}`,
      };
    }
    // WeatherStationSensor
    case 3:
    default: {
      return {
        id: crypto.randomUUID(),
        name: `WeatherMaster ${300 + index}`,
        type: SensorType.WeatherStation,
        geometry: AnySensor.geometry,
        status: getRandomItem(statusOptions),
        lastUpdated,
        department: '环境监测中心',
        temperature: parseFloat((Math.random() * 20 + 15).toFixed(1)), // 15-35°C
        humidity: parseFloat((Math.random() * 50 + 50).toFixed(1)), // 50-100%
        pressure: parseFloat((Math.random() * 50 + 980).toFixed(2)), // 980-1030 hPa
        windSpeed: parseFloat((Math.random() * 10).toFixed(1)), // 0-10 m/s
        windDirection: Math.floor(Math.random() * 360),
      };
    }
  }
}); 