
import { toast } from "sonner"
interface ShowDangerToastProps {
  timeLine: number[]
  message: string
  onClick: Function
}
export default function showDangerToast({ timeLine, message, onClick }: ShowDangerToastProps) {
  const title = <div className="font-bold text-lg">预计在 {timeLine[0]} 时后发生</div>
  const description = <div className="text-sm text-muted-foreground">{message}</div>
  
  return toast.message(title, {
    description: description,
    duration:60000,
    position: "top-right",
    action: {
      label: "去通知",
      onClick: () => {
        onClick()
        toast.dismiss()
      },
    },
  })
}