
interface TimeToastData {
    timeLine: number[]
    message: string
    location:[number,number]
}

export const timeToastData: TimeToastData[] = [
    {
        timeLine: [1],
        message: "模型监测到福州大学城区域上空对流有效位能(CAPE)急剧增强，预计1小时内将发生极端强降雨。AI推演的淹没分析显示多个低洼地区存在严重风险，请通知大学城的学生以及市民们做好防汛准备",
        location: [
          119.202429,
          26.065866
        ]
    },
    {
        timeLine: [10],
        message: "十小时后在长乐将发生洪涝灾害24小时趋势预警：根据最新的全球气象模型数据，AI系统预测10小时后，长乐沿海地区受台风外围环流影响，整体降雨量级将显著提升，请关注后续的短临预警",
        location: [
          119.625176,
          25.973658
        ]
    },
    {
        timeLine: [14],
        message: "十四小时后在福清将发生洪涝灾害24小时趋势预警：根据最新的全球气象模型数据，AI系统预测14小时后，福清沿海地区受台风外围环流影响，整体降雨量级将显著提升，请关注后续的短临预警",
        location: [
          119.330307,
          25.726755
        ]
    }
]
