
import { toast } from "sonner"
interface ShowDangerToastProps {
  timeLine: number[]
  message: string
  onClickNavigate: Function
  onClickAgent:Function
}
export default function showDangerToast({ timeLine, message, onClickNavigate,onClickAgent }: ShowDangerToastProps) {
  const title = <div className="font-bold text-lg">预计在 {timeLine[0]} 时后发生</div>
  const description = <div className="text-sm text-muted-foreground">{message}</div>
  const aiMsg=<div>让Conflux Agent分析</div>
  
    toast.message(title, {
      description: description,
      duration:60000,
      position: "top-right",
      action: {
        label: "去通知",
        onClick: () => {
          onClickNavigate()
          toast.dismiss()
        },
      },
    })
    toast.message(aiMsg,{
      duration:60000,
      position: "top-right",
      action:{
        label:'一键执行',
        onClick:()=>{
          onClickAgent()
          toast.dismiss()
        }
      }
    }
    )

}