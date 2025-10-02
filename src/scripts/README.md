# 福建省内涝风险数据生成脚本

这个脚本用于调用 Gemini Flash API 生成福建省内涝风险预测数据，将坐标文件转换为符合 Mapbox 要求的 GeoJSON 格式。

## 功能特点

- 📍 **坐标处理**: 自动读取 `location.txt` 中的坐标数据（纬度,经度格式）
- 🔄 **格式转换**: 将坐标从"纬度,经度"转换为GeoJSON要求的"[经度,纬度]"格式
- 🤖 **AI生成**: 使用 Gemini Flash API 智能生成内涝风险预测数据
- ⏱️ **时序数据**: 为每个坐标生成1-23小时的预测数据
- 📊 **分批处理**: 每批处理5个坐标，避免API限制
- 🎯 **精准预测**: 生成Level、Depth、Population、Property等关键指标

## 数据结构

生成的GeoJSON包含以下字段：

```json
{
  "type": "Feature",
  "properties": {
    "Level": 2,        // 风险等级 1-5
    "Hour": 13,        // 预测小时 1-23
    "Depth": 25,       // 淹没深度 (cm)
    "Population": 0.3, // 受影响人口 (万人)
    "Property": 800    // 受影响资产 (万元)
  },
  "geometry": {
    "type": "Point",
    "coordinates": [119.239069, 26.070469] // [经度, 纬度]
  }
}
```

## 使用方法

### 1. 环境准备

确保已安装 Node.js (版本 >= 14)

### 2. 获取 Gemini API 密钥

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的API密钥
3. 复制密钥备用

### 3. 设置API密钥

方法一：设置环境变量（推荐）
```bash
# Windows
set GEMINI_API_KEY=your_api_key_here

# macOS/Linux
export GEMINI_API_KEY=your_api_key_here
```

方法二：直接修改脚本
在 `location.js` 中找到这一行：
```javascript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
```
将 `YOUR_GEMINI_API_KEY_HERE` 替换为你的实际API密钥。

### 4. 运行脚本

```bash
cd src/scripts
node location.js
```

### 5. 查看结果

脚本会在 `src/feature/index/data/` 目录下生成 `fuzhou-flood-risk.geojson` 文件。

## 脚本参数说明

### 风险等级 (Level)
- **1级**: 轻微风险，一般降雨，深度5-15cm
- **2级**: 低风险，中等降雨，深度15-30cm
- **3级**: 中等风险，强降雨，深度30-60cm
- **4级**: 高风险，暴雨，深度60-100cm
- **5级**: 极高风险，特大暴雨，深度100cm以上

### 人口影响估算
- **福州市区**: 0.5-5万人
- **县城**: 0.1-1万人
- **乡镇**: 0.05-0.3万人

### 资产影响估算
- **福州市区**: 1000-20000万元
- **县城**: 200-5000万元
- **乡镇**: 50-1000万元

## 注意事项

1. **API限制**: 脚本在批次间有2秒延迟，避免触发API限制
2. **数据量**: 192个坐标 × 23小时 = 4416个数据点，预计需要20-30分钟完成
3. **网络连接**: 确保网络连接稳定，如果某个批次失败会自动跳过
4. **坐标范围**: 所有坐标都在福建省范围内，符合地理位置要求

## 故障排除

### 常见错误

1. **API密钥错误**
   ```
   请设置GEMINI_API_KEY环境变量或在脚本中直接设置API密钥
   ```
   解决方法：检查API密钥是否正确设置

2. **网络连接失败**
   ```
   API请求失败: 403 Forbidden
   ```
   解决方法：检查网络连接和API密钥权限

3. **JSON解析错误**
   ```
   无法从响应中提取JSON数据
   ```
   解决方法：API响应格式异常，可以重新运行脚本

### 调试模式

如需查看详细的API响应，可以在脚本中添加调试信息：

```javascript
console.log('API响应:', generatedText);
```

## 输出示例

成功运行后会看到类似输出：

```
开始处理坐标数据...
读取到 192 个坐标点
总共 192 个坐标，分为 39 个批次处理
正在处理批次 1/39...
批次 1 处理完成，生成了 115 个数据点
等待2秒后处理下一批次...
...
数据已保存到: /path/to/src/feature/index/data/fuzhou-flood-risk.geojson
总共生成了 4416 个数据点
处理完成！
``` 