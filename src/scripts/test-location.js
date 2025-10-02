import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- 配置区域 ---
// 从环境变量或直接在此处设置您的 Gemini API 密钥
// 强烈建议使用环境变量来保护您的密钥
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCaYnSuM_PrOr7Tk22RLAlLNh2gSiSbcQQ';

// 使用的模型。请根据您的需求选择，例如 "gemini-1.5-flash" 或 "gemini-pro"
// 注意：JSON 模式需要使用 gemini-1.5-pro-latest, gemini-1.5-flash-latest, gemini-1.0-pro
const MODEL_NAME = "gemini-2.5-flash"; // <-- 修改：建议使用支持JSON模式的最新模型

// --- 路径和文件 ---
const __dirname = path.resolve();

/**
 * 读取坐标文件（测试版本只读取前10个）
 * @returns {Array<{lat: number, lng: number}>} 坐标数组
 */
function readCoordinates() {
  const filePath = path.join(__dirname, 'location.txt');
  if (!fs.existsSync(filePath)) {
    console.error(`错误：坐标文件未找到，路径：${filePath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const allCoords = content.trim().split('\n').map(line => {
    const [lat, lng] = line.split(',').map(part => parseFloat(part.trim()));
    return { lat, lng };
  });

  // 只返回前10个坐标用于测试
  return allCoords.slice(0, 10);
}

/**
 * 调用 Gemini API 生成内涝风险数据
 * @param {GoogleGenerativeAI} genAI - Gemini AI 实例
 * @param {Array<{lat: number, lng: number}>} coordinates - 坐标批次
 * @param {number} batchIndex - 当前批次索引
 * @returns {Promise<object>} GeoJSON 格式的 FeatureCollection
 */
async function callGeminiAPI(genAI, coordinates, batchIndex) {
  // <-- 这是本次修改的核心函数
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { // <-- 修改：将 generationConfig 移到此处并添加 JSON 模式配置
      responseMimeType: 'application/json', // <-- 新增：启用 JSON 模式！
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  });

  const prompt = `
你是一个专业的气象和地理数据分析师。请为以下福建省内的坐标点生成内涝风险预测数据。

坐标列表（纬度, 经度）：
${coordinates.map((coord, index) => `${index + 1}. ${coord.lat}, ${coord.lng}`).join('\n')}

请为每个坐标点生成1-5小时的内涝风险预测数据（测试版本），要求：

1. **Level（风险等级1-5）**：
   - 1级：轻微风险，一般降雨
   - 2级：低风险，中等降雨
   - 3级：中等风险，强降雨
   - 4级：高风险，暴雨
   - 5级：极高风险，特大暴雨
   - 相邻坐标的风险等级不能相差超过2级
   - 相邻时间的风险等级变化要合理渐进

2. **Hour（预测小时1-5）**：
   - 每个坐标需要生成5个时间点的数据（测试版本）
   - 时间递进要体现风险的发展趋势

3. **Depth（淹没深度cm）**：
   - 1级：5-15cm
   - 2级：15-30cm  
   - 3级：30-60cm
   - 4级：60-100cm
   - 5级：100cm以上

4. **Population（受影响人口万人）**：
   - 根据坐标位置的城市规模合理估算
   - 福州市区：0.5-5万人
   - 县城：0.1-1万人
   - 乡镇：0.05-0.3万人

5. **Property（受影响资产万元）**：
   - 根据坐标位置的经济发展水平估算
   - 福州市区：1000-20000万元
   - 县城：200-5000万元
   - 乡镇：50-1000万元

请严格按照以下JSON格式返回，coordinates格式为[经度, 纬度]：

{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "Level": 2,
        "Hour": 1,
        "Depth": 25,
        "Population": 0.3,
        "Property": 800
      },
      "geometry": {
        "type": "Point",
        "coordinates": [119.239069, 26.070469]
      }
    }
  ]
}

你的输出必须是严格符合上述描述的单一、有效的 GeoJSON 格式的 JSON 对象，不包含任何额外的解释或 Markdown 标记。
`;

  try {
    console.log(`正在调用Gemini API处理批次 ${batchIndex + 1}...`);
    
    const result = await model.generateContent(prompt); // <-- 修改：generationConfig 已在初始化时传入
    const response = await result.response;
    const generatedText = response.text();
    
    console.log('API原始响应:', generatedText.substring(0, 200) + '...');
    
    // <-- 修改：由于启用了 JSON 模式，不再需要正则表达式来提取 JSON
    // const jsonMatch = generatedText.match(/\{[\s\S]*\}/); // <-- 删除
    // if (!jsonMatch) { // <-- 删除
    //   throw new Error('无法从响应中提取JSON数据'); // <-- 删除
    // } // <-- 删除

    const jsonData = JSON.parse(generatedText); // <-- 修改：直接解析整个响应文本
    console.log(`批次 ${batchIndex + 1} 处理完成，生成了 ${jsonData.features.length} 个数据点`);
    
    return jsonData;
  } catch (error) {
    console.error(`批次 ${batchIndex + 1} 处理失败:`, error.message);
    // 在实际生产中，您可能希望记录更详细的错误信息
    // console.error(error);  
    throw error;
  }
}


/**
 * 分批处理坐标（测试版本）
 * @param {GoogleGenerativeAI} genAI - Gemini AI 实例
 * @param {Array<{lat: number, lng: number}>} coordinates - 全部坐标
 * @returns {Promise<object>} 包含所有 Features 的 GeoJSON 对象
 */
async function processCoordinatesInBatches(genAI, coordinates) {
  const batchSize = 2; // 测试版本每批只处理2个坐标
  const batches = [];
  
  for (let i = 0; i < coordinates.length; i += batchSize) {
    batches.push(coordinates.slice(i, i + batchSize));
  }

  console.log(`测试模式：总共 ${coordinates.length} 个坐标，分为 ${batches.length} 个批次处理`);

  const allFeatures = [];
  
  for (let i = 0; i < batches.length; i++) {
    console.log(`正在处理批次 ${i + 1}/${batches.length}...`);
    
    try {
      const batchResult = await callGeminiAPI(genAI, batches[i], i);
      allFeatures.push(...batchResult.features);
      
      // 在批次之间添加延迟，避免API速率限制
      if (i < batches.length - 1) {
        const delay = 3000; // 3秒
        console.log(`等待 ${delay / 1000} 秒后处理下一批次...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`批次 ${i + 1} 失败，跳过该批次。`);
      continue; // 继续处理下一个批次
    }
  }

  return {
    type: "FeatureCollection",
    features: allFeatures
  };
}

/**
 * 保存结果到文件
 * @param {object} data - GeoJSON 数据
 * @param {string} filename - 输出文件名
 */
function saveToFile(data, filename) {
  // 确保目标目录存在
  const outputDir = path.join(__dirname, '..', 'feature', 'index', 'data');
  if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\n测试数据已保存到: ${outputPath}`);
  console.log(`总共生成了 ${data.features.length} 个数据点`);
  
  // 显示前几个数据点作为示例
  if (data.features.length > 0) {
    console.log('\n示例数据点:');
    console.log(JSON.stringify(data.features.slice(0, 3), null, 2));
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('开始测试坐标数据处理...');
    
    // 检查API密钥
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error('错误: 请设置GEMINI_API_KEY环境变量或在脚本中直接设置API密钥。');
      process.exit(1);
    }
    
    // 初始化 Gemini AI 客户端
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // 读取坐标
    const coordinates = readCoordinates();
    console.log(`测试模式：读取到 ${coordinates.length} 个坐标点`);
    console.log('前5个坐标:', coordinates.slice(0, 5));
    
    // 处理坐标
    const result = await processCoordinatesInBatches(genAI, coordinates);
    
    // 保存结果
    saveToFile(result, 'test-fuzhou-flood-risk.geojson');
    
    console.log('\n测试完成！如果结果正确，可以调整脚本参数（如 slice 范围）以运行完整版本。');
  } catch (error) {
    console.error('\n测试过程中发生严重错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();