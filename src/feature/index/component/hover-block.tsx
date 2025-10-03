import { Card } from "@/components/ui/card";
import useCircle from "@/hooks/circle-store";

export default function HoverBlock() {
    const { circle } = useCircle()
    
    
    const isShowCircleData=  (circle === null) ? false :true
    
    return (
        <Card className="absolute h-55 w-[25%] top-5 left-5  rounded-sm p-4">
            {isShowCircleData ? (
            <div className="flex flex-col justify-start text-sm gap-2">
                <h3 className="font-bold text-base ">区域内涝风险等级：<span className={ `text-level-${circle?.level}`}>{circle?.level}</span></h3>
                <div>模型预测未来{circle?.hour}小时后</div>
                <div>预估淹没深度：{circle?.depth} cm</div>    
                <div>估计影响区域人口：{circle?.population}万人</div>
                <div>预计损失经济：{circle?.property}万元</div>
                {/* <div>坐标位置：[{circle?.coordinates.join(',')}]</div>  */}   
            </div>)
            
            : (<div className="flex flex-col gap-2 text-sm relative">
                 <h3 className="font-bold text-base">内涝风险等级对照表：</h3>
                 
                 <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#7dd3fc]"></span>
                    <span>等级 1: 低风险</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#669EC4]"></span>
                    <span>等级 2: 中低风险</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#0c4a6e]"></span>
                    <span>等级 3: 中风险</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#fb923c]"></span>
                    <span>等级 4: 中高风险</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#f87171]"></span>
                    <span>等级 5: 高风险</span>
                 </div>
                 <p className="absolute top-full text-xs text-muted-foreground mt-2 font-serif">将鼠标悬停在地图区域可查看详细数据。</p>
            </div>) }
        </Card>
    )
 }