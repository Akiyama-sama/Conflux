import type { AnySensor } from "@/data/sensor";
import { SensorStatus, SensorType } from "@/data/sensor";

// 直接抄写自 fuzhou-flood-risk-12-random-hours.geojson 的若干坐标（未读文件）
const coordinatesPool: [number, number][] = [
  [119.239069, 26.070469],
  [119.261398, 26.043985],
  [
          119.202429,
          26.065866
        ],
   [
          119.207121,
          26.021519
        ],
  [
          119.229374,
          25.991624
        ],
  [
          119.278428,
          25.959034
        ],
  [
          118.962344,
          25.873848
        ],
   [
          119.075346,
          26.213685
        ],
   [
          119.001436,
          26.192437
        ],
  [
          119.330307,
          25.726755
        ],
  [
          119.42374,
          25.768638
        ],
   [
          119.586279,
          25.726788
        ],
  [
          119.460539,
          25.850405
        ],
  [
          119.444131,
          25.891747
        ],
  [
          119.500104,
          25.95653
        ],
  [
          119.672891,
          26.014347
        ],
  [
          119.625176,
          25.973658
        ],
  [
          119.628835,
          26.097065
        ],
  [
          119.35855,
          26.178074
        ],
  [
          119.345215,
          26.225172
        ],
 [
          119.354391,
          26.232575
        ],
  [119.333037, 26.144782],
 [
          119.362005,
          25.543618
        ],
  [119.359702, 26.081347],
 [
          119.37075,
          25.537352
        ],
        [
          119.738359,
          25.537853
        ],
        [
          119.533743,
          25.577409
        ],
         [
          119.446578,
          25.880602
        ],
];

const generateTimestamps = (count: number, hoursApart: number): string[] => {
  const timestamps: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const ts = new Date(now.getTime() - i * hoursApart * 60 * 60 * 1000);
    timestamps.push(ts.toISOString());
  }
  return timestamps.reverse();
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 按坐标数量动态计算占比：80% NORMAL, 15% WARNING, 剩余 OFFLINE
const buildStatuses = (total: number): SensorStatus[] => {
  const normal = Math.floor(total * 0.8);
  const warning = Math.floor(total * 0.15);
  const rest = total - normal - warning;
  const statuses: SensorStatus[] = [];
  for (let i = 0; i < normal; i++) statuses.push(SensorStatus.NORMAL);
  for (let i = 0; i < warning; i++) statuses.push(SensorStatus.WARNING);
  for (let i = 0; i < rest; i++) statuses.push(SensorStatus.OFFLINE);
  return shuffle(statuses);
};

const statuses = buildStatuses(coordinatesPool.length);

const pickCoordinate = (i: number): [number, number] => {
  // 直接按索引对应，长度一致
  const idx = i % coordinatesPool.length;
  return coordinatesPool[idx];
};

export const sensorMonkData: AnySensor[] = Array.from({ length: coordinatesPool.length }).map((_, index) => {
  const timestamps = generateTimestamps(8, 2);
  const lastUpdated = timestamps[timestamps.length - 1];
  const status = statuses[index];
  const [lng, lat] = pickCoordinate(index);

  // 按 index 轮换4类，复用与 sensor-data.ts 对齐的结构字段
  const sensorTypeIndex = index % 4;

  switch (sensorTypeIndex) {
    // WaterLevelSensor
    case 0: {
      const historicalData = timestamps.map((ts) => ({
        timestamp: ts,
        level: parseFloat((Math.random() * 11).toFixed(2)),
      }));
      const currentLevel = historicalData[historicalData.length - 1].level;
      const warningThreshold = 8.0;
      const dangerThreshold = 10.0;

      return {
        id: crypto.randomUUID(),
        name: `Monk HydroVantage ${3000 + index}`,
        type: SensorType.WaterLevel,
        geometry: { type: "Point", coordinates: [lng, lat] },
        status,
        lastUpdated,
        department: "水务部门",
        currentLevel,
        warningThreshold,
        dangerThreshold,
        flowRate: parseFloat((Math.random() * 50 + 5).toFixed(2)),
        historicalData,
      } as AnySensor;
    }

    // RainfallSensor
    case 1: {
      const historicalData = timestamps.map((ts) => ({
        timestamp: ts,
        intensity: parseFloat((Math.random() * 50).toFixed(2)),
      }));
      const currentIntensity = historicalData[historicalData.length - 1].intensity;
      return {
        id: crypto.randomUUID(),
        name: `Monk RainGauge Pro ${500 + index}`,
        type: SensorType.Rainfall,
        geometry: { type: "Point", coordinates: [lng, lat] },
        status,
        lastUpdated,
        department: "气象局",
        currentIntensity,
        hourlyAccumulation: parseFloat((Math.random() * 30).toFixed(2)),
        dailyAccumulation: parseFloat((Math.random() * 100).toFixed(2)),
        historicalData,
      } as AnySensor;
    }

    // AICameraSensor
    case 2: {
      const riskLevels: ("无积水" | "轻度积水" | "严重拥堵" | "道路中断")[] = [
        "无积水",
        "轻度积水",
        "严重拥堵",
        "道路中断",
      ];
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      let detectedWaterDepth = 0;
      if (riskLevel === "轻度积水") detectedWaterDepth = parseFloat((Math.random() * 10 + 5).toFixed(1));
      if (riskLevel === "严重拥堵" || riskLevel === "道路中断")
        detectedWaterDepth = parseFloat((Math.random() * 20 + 15).toFixed(1));

      return {
        id: crypto.randomUUID(),
        name: `Monk StreetEye AI-${800 + index}`,
        type: SensorType.AICamera,
        geometry: { type: "Point", coordinates: [lng, lat] },
        status: riskLevel === "道路中断" ? SensorStatus.ERROR : status,
        lastUpdated,
        department: "交通管理",
        detectedWaterDepth,
        riskLevel,
        latestImageUrl: `https://picsum.photos/seed/monk-${index}/400/300`,
        videoStreamUrl: `https://example.com/stream/monk-${index}`,
      } as AnySensor;
    }

    // WeatherStationSensor
    case 3:
    default: {
      return {
        id: crypto.randomUUID(),
        name: `Monk WeatherMaster ${900 + index}`,
        type: SensorType.WeatherStation,
        geometry: { type: "Point", coordinates: [lng, lat] },
        status,
        lastUpdated,
        department: "环境监测中心",
        temperature: parseFloat((Math.random() * 20 + 15).toFixed(1)),
        humidity: parseFloat((Math.random() * 50 + 50).toFixed(1)),
        pressure: parseFloat((Math.random() * 50 + 980).toFixed(2)),
        windSpeed: parseFloat((Math.random() * 10).toFixed(1)),
        windDirection: Math.floor(Math.random() * 360),
      } as AnySensor;
    }
  }
});
