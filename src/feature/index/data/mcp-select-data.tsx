import { BellIcon, BookOpenIcon, UserIcon } from 'lucide-react'


export interface MCPSelectType {
    isSelected: boolean;
    label: string;
    icon: React.ReactNode;
    agentMessage:string;
}

export const MCPSelectData: MCPSelectType[] = [
    {
        isSelected: false,
        label: '人员定位插件',
        icon: <UserIcon size={14}/>,
        agentMessage: '人员定位',
    },
    {
        isSelected: false,
        label: '发送通知插件',
        icon: <BellIcon size={14}/>,
        agentMessage: '发送通知',
    },
    {
        isSelected: false,
        label: '洪涝知识检索插件',
        icon: <BookOpenIcon size={14}/>,
        agentMessage: '洪涝知识检索',
    },
]
