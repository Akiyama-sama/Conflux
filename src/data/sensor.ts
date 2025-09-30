/**
 * 定义传感器的通用状态
 */
export enum SensorStatus {
  NORMAL = '正常',
  WARNING = '告警',
  ERROR = '故障',
  OFFLINE = '离线',
}

/**
* 定义本项目中可能包含的传感器类型
*/
export enum SensorType {
  WaterLevel = '水位计',
  Rainfall = '雨量站',
  WeatherStation = '气象站',
  AICamera = '积水AI摄像头',
  SoilMoisture = '土壤湿度计',
}

/**
 * 所有传感器的基础信息接口
 */
export interface BaseSensor {
  /** 传感器的唯一ID */
  id: string;

  /** 传感器名称或位置描述，例如 "长江大桥2号桥墩" */
  name: string;
  
  /** 传感器类型 */
  type: SensorType;

  /** 地理位置信息 */
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };

  /** 当前状态 */
  status: SensorStatus;

  /** 最后一次上报数据的时间 (ISO 8601 格式字符串) */
  lastUpdated: string;

  /** 所属或负责的部门 (可选) */
  department?: string;
}


/**
 * 水位计的特定数据点
 */
interface WaterLevelDataPoint {
  timestamp: string;
  level: number; // 水位值
}

/**
* 水位计完整信息接口
*/
export interface WaterLevelSensor extends BaseSensor {
  type: SensorType.WaterLevel;
  
  /** 当前实时水位 (单位: 米) [cite: 70] */
  currentLevel: number;
  
  /** 警戒水位阈值 (单位: 米) [cite: 77] */
  warningThreshold: number;
  
  /** 危险水位阈值 (单位: 米) [cite: 77] */
  dangerThreshold: number;

  /** 实时流量 (可选, 单位: 立方米/秒) [cite: 70, 250] */
  flowRate?: number;

  /** 历史水位数据，用于绘制趋势图 */
  historicalData: WaterLevelDataPoint[];
}

/**
 * 雨量站的特定数据点
 */
interface RainfallDataPoint {
  timestamp: string;
  intensity: number; // 降雨强度
}

/**
* 雨量站完整信息接口
*/
export interface RainfallSensor extends BaseSensor {
  type: SensorType.Rainfall;
  
  /** 当前降雨强度 (单位: 毫米/小时) [cite: 75] */
  currentIntensity: number;

  /** 过去1小时累计降雨量 (单位: 毫米) */
  hourlyAccumulation: number;

  /** 过去24小时累计降雨量 (单位: 毫米) */
  dailyAccumulation: number;

  /** 历史降雨数据，用于绘制趋势图 */
  historicalData: RainfallDataPoint[];
}

/**
 * 积水AI摄像头完整信息接口
 */
export interface AICameraSensor extends BaseSensor {
  type: SensorType.AICamera;
  
  /** AI分析出的当前路面积水深度 (单位: 厘米) */
  detectedWaterDepth: number;

  /** AI识别的风险等级 ('无积水' | '轻度积水' | '严重拥堵' | '道路中断') */
  riskLevel: '无积水' | '轻度积水' | '严重拥堵' | '道路中断';

  /** 最新抓拍的图片URL地址 */
  latestImageUrl: string;
  
  /** 实时视频流地址 (可选) */
  videoStreamUrl?: string;
}

/**
 * 综合气象站完整信息接口
 */
export interface WeatherStationSensor extends BaseSensor {
  type: SensorType.WeatherStation;
  
  /** 温度 (单位: 摄氏度) [cite: 111] */
  temperature: number;

  /** 湿度 (单位: %) [cite: 111] */
  humidity: number;

  /** 气压 (单位: 百帕/hPa) [cite: 75, 111] */
  pressure: number;
  
  /** 风速 (单位: 米/秒) [cite: 75, 111] */
  windSpeed: number;

  /** 风向 (单位: 度, 0-360) */
  windDirection: number;
}

export type AnySensor = WaterLevelSensor | RainfallSensor | AICameraSensor | WeatherStationSensor;







export interface Location {
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      name: string;
      phoneFormatted: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      postalCode: string;
      state: string;
    };
  }
  export const storeAnySensors: Location[] = [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.013877, 40.713201

        ]
      },
      "properties": {
        "name": "Foggy Bottom",
        "phoneFormatted": "(202) 507-8357",
        "phone": "2025078357",
        "address": "2221 I St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20037",
        "state": "D.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.015995, 40.707011

        ]
      },
      "properties": {
        "name": "Dupont",
        "phoneFormatted": "(202) 387-9338",
        "phone": "2023879338",
        "address": "1512 Connecticut Ave NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20036",
        "state": "D.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.000683, 40.707729

        ]
      },
      "properties": {
        "name": "Capitol Hill",
        "phoneFormatted": "(202) 547-9338",
        "phone": "2025479338",
        "address": "221 Pennsylvania Ave SE",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20003",
        "state": "D.C."
      }
    },      
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.995485, 40.709032

        ]
      },
      "properties": {
        "name": "14th + W",
        "phoneFormatted": "(215) 386-1365",
        "phone": "2025062956",
        "address": "1325 W St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20009",
        "state": "D.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.977081, 40.713682

        ]
      },
      "properties": {
        "name": "Farragut Square",
        "phoneFormatted": "(202) 506-3079",
        "phone": "2025063079",
        "address": "888 17th St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20006",
        "state": "D.C."
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.987185, 40.722161

        ]
      },
      "properties": {
        "name": "Georgetown",
        "phoneFormatted": "(202) 838-4300",
        "phone": "2028384300",
        "address": "1044 Wisconsin Ave NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20007",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.979462, 40.724841

        ]
      },
      "properties": {
        "name": "Logan Circle",
        "phoneFormatted": "(202) 234-7336",
        "phone": "2022347336",
        "address": "1461 P St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20005",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.976267, 40.734462

        ]
      },
      "properties": {
        "name": "Mount Vernon",
        "phoneFormatted": "(202) 793-7300 ",
        "phone": "2027937300 ",
        "address": "601 Massachusetts Avenue Northwest suite 110",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20001",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.973768, 40.739187

        ]
      },
      "properties": {
        "name": "Navy Yard",
        "phoneFormatted": "(202) 554-7336 ",
        "phone": "2025547336 ",
        "address": " 1212 4th St SE",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20003",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.965055, 40.718853

        ]
      },
      "properties": {
        "name": "Penn Quarter",
        "phoneFormatted": "(202) 804-2250 ",
        "phone": "2028042250 ",
        "address": "624 E. Street, NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20004",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.983171, 40.704847

        ]
      },
      "properties": {
        "name": "Union Market",
        "phoneFormatted": "(202) 891-5954   ",
        "phone": "2028915954   ",
        "address": "1304 4th Street Northeast",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20002",
        "state": "D.C."
      }
    },
  { 
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-73.998544, 40.700689

        ]
      },
      "properties": {
        "name": "West End",
        "phoneFormatted": "(202) 629-2100   ",
        "phone": "2026292100  ",
        "address": "2238 M St NW",
        "city": "Washington DC",
        "country": "United States",
        "postalCode": "20037",
        "state": "D.C."
      }
    }
  ];
 
 
  /*  export const storeAnySensors: AnySensor[] = [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.223535, 26.042430]
          },
          "properties": {
            "name": "Foggy Bottom",
            "phoneFormatted": "(202) 507-8357",
            "phone": "2025078357",
            "address": "2221 I St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20037",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.238423, 26.036134]
          },
          "properties": {
            "name": "Dupont",
            "phoneFormatted": "(202) 387-9338",
            "phone": "2023879338",
            "address": "1512 Connecticut Ave NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20036",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.227236, 26.020504]
          },
          "properties": {
            "name": "Capitol Hill",
            "phoneFormatted": "(202) 547-9338",
            "phone": "2025479338",
            "address": "221 Pennsylvania Ave SE",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20003",
            "state": "D.C."
          }
        },      
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.228102, 26.017780]
          },
          "properties": {
            "name": "14th + W",
            "phoneFormatted": "(215) 386-1365",
            "phone": "2025062956",
            "address": "1325 W St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20009",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.217492, 26.037625]
          },
          "properties": {
            "name": "Farragut Square",
            "phoneFormatted": "(202) 506-3079",
            "phone": "2025063079",
            "address": "888 17th St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20006",
            "state": "D.C."
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.215938, 26.047395]
          },
          "properties": {
            "name": "Georgetown",
            "phoneFormatted": "(202) 838-4300",
            "phone": "2028384300",
            "address": "1044 Wisconsin Ave NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20007",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.231354, 26.047286]
          },
          "properties": {
            "name": "Logan Circle",
            "phoneFormatted": "(202) 234-7336",
            "phone": "2022347336",
            "address": "1461 P St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20005",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.225527, 26.020783]
          },
          "properties": {
            "name": "Mount Vernon",
            "phoneFormatted": "(202) 793-7300 ",
            "phone": "2027937300 ",
            "address": "601 Massachusetts Avenue Northwest suite 110",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20001",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.251637, 26.070562]
          },
          "properties": {
            "name": "Navy Yard",
            "phoneFormatted": "(202) 554-7336 ",
            "phone": "2025547336 ",
            "address": " 1212 4th St SE",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20003",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.270011, 26.053570]
          },
          "properties": {
            "name": "Penn Quarter",
            "phoneFormatted": "(202) 804-2250 ",
            "phone": "2028042250 ",
            "address": "624 E. Street, NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20004",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.245407, 26.080706]
          },
          "properties": {
            "name": "Union Market",
            "phoneFormatted": "(202) 891-5954   ",
            "phone": "2028915954   ",
            "address": "1304 4th Street Northeast",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20002",
            "state": "D.C."
          }
        },
      { 
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [119.235213, 26.103460]
          },
          "properties": {
            "name": "West End",
            "phoneFormatted": "(202) 629-2100   ",
            "phone": "2026292100  ",
            "address": "2238 M St NW",
            "city": "Washington DC",
            "country": "United States",
            "postalCode": "20037",
            "state": "D.C."
          }
        }
      ]; */