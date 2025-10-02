import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- 配置区域 ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCaYnSuM_PrOr7Tk22RLAlLNh2gSiSbcQQ';
const MODEL_NAME = "gemini-2.5-flash";

// --- 路径和文件 ---
const __dirname = path.resolve();

/**
 * 读取坐标文件
 * @returns {Array<{lat: number, lng: number}>} 坐标数组
 */
function readCoordinates() {
  const filePath = path.join(__dirname, 'location.txt');
  if (!fs.existsSync(filePath)) {
    console.error(`错误：坐标文件未找到，路径：${filePath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.trim().split('\n').map(line => {
    const [lat, lng] = line.split(',').map(part => parseFloat(part.trim()));
    return { lat, lng };
  });
}

/**
 * 调用 Gemini API 为一批坐标生成内涝风险数据
 * @param {GoogleGenerativeAI} genAI - Gemini AI 实例
 * @param {Array<{lat: number, lng: number}>} coordinatesBatch - 包含2个坐标的批次
 * @param {number} batchIndex - 当前批次索引
 * @returns {Promise<object>} GeoJSON 格式的 FeatureCollection
 */
async function callGeminiAPI(genAI, coordinatesBatch, batchIndex) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.8, // 可以适当调高以增加随机性
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  });

  const prompt = `
你是一个专业的气象和地理数据分析师。请为以下福建省内的坐标点列表生成内涝风险预测数据。

坐标列表（纬度, 经度）：
${coordinatesBatch.map((coord, index) => `${index + 1}. ${coord.lat}, ${coord.lng}`).join('\n')}

请严格按照以下新规则生成数据：
1.  **为列表中的每个坐标**，生成 **12 个** 内涝风险数据点。
2.  **Hour（预测小时）** 字段必须满足以下条件：
    - 它的值必须是从 0 到 23 的整数范围内 **随机选择** 的。
    - 对于同一个坐标的12个数据点，它们的 **Hour 值必须是唯一的，不能重复**。
3.  **Level (风险等级)**, **Depth (淹没深度)** 等其他字段，需要根据小时和地理位置进行合理估算，并体现风险的随机波动。
4.  其他字段（Population, Property）的估算规则保持不变。

请严格按照以下JSON格式返回。最终的 "features" 数组必须包含 ${coordinatesBatch.length * 12} 个元素 (每个坐标12个)。

{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "Level": 3, "Hour": 9, "Depth": 45, "Population": 0.8, "Property": 1500 },
      "geometry": { "type": "Point", "coordinates": [${coordinatesBatch[0].lng}, ${coordinatesBatch[0].lat}] }
    },
    {
      "type": "Feature",
      "properties": { "Level": 4, "Hour": 21, "Depth": 70, "Population": 0.8, "Property": 1500 },
      "geometry": { "type": "Point", "coordinates": [${coordinatesBatch[0].lng}, ${coordinatesBatch[0].lat}] }
    }
    // ... 此处应包含坐标1的另外10个随机小时数据
    // ... 以及坐标2的12个随机小时数据
  ]
}

你的输出必须是严格符合上述描述的单一、有效的 GeoJSON 格式的 JSON 对象，不包含任何额外的解释或 Markdown 标记。
`;

  try {
    console.log(`正在调用Gemini API处理批次 ${batchIndex + 1}...`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    const jsonData = JSON.parse(generatedText);
    console.log(`批次 ${batchIndex + 1} 处理完成，生成了 ${jsonData.features.length} 个数据点`);
    
    return jsonData;
  } catch (error) {
    console.error(`批次 ${batchIndex + 1} 处理失败:`, error.message);
    throw error;
  }
}

/**
 * 分批处理坐标
 * @param {GoogleGenerativeAI} genAI - Gemini AI 实例
 * @param {Array<{lat: number, lng: number}>} allCoordinates - 全部坐标
 * @returns {Promise<object>} 包含所有 Features 的 GeoJSON 对象
 */
async function processCoordinatesInBatches(genAI, allCoordinates) {
  const batchSize = 2; // <-- 修改：每批次处理2个坐标
  const allFeatures = [];
  const totalCoordinates = allCoordinates.length;
  const totalBatches = Math.ceil(totalCoordinates / batchSize);

  console.log(`总共 ${totalCoordinates} 个坐标，分为 ${totalBatches} 个批次处理（每批 ${batchSize} 个）...`);
  
  for (let i = 0; i < totalCoordinates; i += batchSize) {
    const batchIndex = (i / batchSize);
    const coordinatesBatch = allCoordinates.slice(i, i + batchSize);
    
    console.log(`\n--- 开始处理批次 ${batchIndex + 1}/${totalBatches} ---`);
    
    try {
      const batchResult = await callGeminiAPI(genAI, coordinatesBatch, batchIndex);
      if (batchResult && batchResult.features) {
        allFeatures.push(...batchResult.features);
      }
      
      if (i + batchSize < totalCoordinates) {
        const delay = 2000; // 2秒
        console.log(`等待 ${delay / 1000} 秒后处理下一批次...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`批次 ${batchIndex + 1} 失败，跳过该批次。`);
      continue;
    }
  }

  return {
    type: "FeatureCollection",
    features: allFeatures
  };
}

/**
 * 保存结果到文件
 */
function saveToFile(data, filename) {
  const outputDir = path.join(__dirname, '..', 'feature', 'index', 'data');
  if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n✅ 数据已保存到: ${outputPath}`);
  console.log(`总共生成了 ${data.features.length} 个数据点`);
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('启动内涝风险数据生成脚本（12个随机小时版）...');
    
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error('错误: 请设置GEMINI_API_KEY环境变量或在脚本中直接设置API密钥。');
      process.exit(1);
    }
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const allCoordinates = readCoordinates();
    console.log(`读取到 ${allCoordinates.length} 个坐标点`);
    
    const result = await processCoordinatesInBatches(genAI, allCoordinates);
    
    if (result.features.length > 0) {
        saveToFile(result, 'fuzhou-flood-risk-12-random-hours.geojson'); // <-- 修改：使用新文件名
    } else {
        console.log('\n处理完成，但没有生成任何数据点。请检查日志。');
    }
    
    console.log('\n脚本执行完毕！');
  } catch (error) {
    console.error('\n脚本执行过程中发生严重错误:', error.message);
    process.exit(1);
  }
}

main();
  
