
interface TimeToastData {
    timeLine: number[]
    message: string
    location:[number,number]
    agentMessage:string
}

export const timeToastData: TimeToastData[] = [
    {
        timeLine: [1],
        message: "未来1小时，闽江下游流域降雨量将急剧增加，洪峰预计在2小时后到达福州市区。主要风险点位于福州大学城低洼地带，请重点关注",
        location: [
          119.202429,
          26.065866
        ],
        agentMessage:'多个监测点水位已触发红色预警，综合风险评估为“极高”。请根据《福州市防汛应急预案》生成决策建议。'
    },
    {
        timeLine: [10],
        message: "十小时后在长乐将发生洪涝灾害24小时趋势预警：根据最新的全球气象模型数据，AI系统预测10小时后，长乐沿海地区受台风外围环流影响，整体降雨量级将显著提升，请关注后续的短临预警",
        location: [
          119.625176,
          25.973658
        ],
        agentMessage:'立即向所有一线防汛人员和长乐的社区网格员发送暴雨预警和紧急撤离通知'

    },
    {
        timeLine: [14],
        message: "十四小时后在福清将发生洪涝灾害24小时趋势预警：根据最新的全球气象模型数据，AI系统预测14小时后，福清沿海地区受台风外围环流影响，整体降雨量级将显著提升，请关注后续的短临预警",
        location: [
          119.330307,
          25.726755
        ],
        agentMessage:'立即向所有一线防汛人员和福清的社区网格员发送暴雨预警和紧急撤离通知'
    }
]
