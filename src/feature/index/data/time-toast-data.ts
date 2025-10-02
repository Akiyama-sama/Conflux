
interface TimeToastData {
    timeLine: number[]
    message: string
    location:[number,number]
}

export const timeToastData: TimeToastData[] = [
    {
        timeLine: [5],
        message: "模型监测到厦门区域上空对流有效位能(CAPE)急剧增强，预计5小时内将发生极端强降雨。AI推演的淹没分析显示多个低洼地区存在严重风险,已有多个城市发布极端天气预警，请市民做好防汛准备",
        location:[-74.013877, 40.713201]
    },
    {
        timeLine: [12],
        message: "十二小时后在福州将发生洪涝灾害24小时趋势预警：根据最新的全球气象模型数据，AI系统预测24小时后，福建沿海地区受台风外围环流影响，整体降雨量级将显著提升，请关注后续的短临预警",
        location:[-73.977081, 40.713682]
    }
]
