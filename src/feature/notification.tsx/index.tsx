import { useState } from 'react'
import { showSubmittedData } from '@/lib/show-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { apps } from './data/apps'

type NotificationForm = {
  recipients: string[]
  content: string
}

export default function Notification() {
  const [recipients, setRecipients] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<{recipients?: string, content?: string}>({})

  const handleRecipientChange = (appName: string, checked: boolean) => {
    if (checked) {
      setRecipients(prev => [...prev, appName])
    } else {
      setRecipients(prev => prev.filter(name => name !== appName))
    }
    // 清除错误
    if (errors.recipients) {
      setErrors(prev => ({ ...prev, recipients: undefined }))
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    // 清除错误
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: {recipients?: string, content?: string} = {}
    
    if (recipients.length === 0) {
      newErrors.recipients = '请至少选择一个通知单位'
    }
    
    if (content.length < 10) {
      newErrors.content = '通知内容至少需要10个字符'
    } else if (content.length > 1000) {
      newErrors.content = '通知内容不能超过1000个字符'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // 处理表单提交数据
    const submittedData = {
      recipients,
      content,
      recipientNames: recipients.map(id => 
        apps.find(app => app.name === id)?.name || id
      ),
      timestamp: new Date().toISOString(),
    }
    
    showSubmittedData(submittedData, '通知已提交，包含以下信息：')
    
    // 重置表单
    setRecipients([])
    setContent('')
    setErrors({})
  }

  const handleReset = () => {
    setRecipients([])
    setContent('')
    setErrors({})
  }

  return (
    <div className="flex flex-col gap-6 items-center max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>发送通知</CardTitle>
          <CardDescription className='text-xs text-muted-foreground'>
            选择需要通知的单位/机构/媒体，并输入通知内容
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 选择通知单位 */}
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apps.map((app) => (
                  <div
                    key={app.name}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <Checkbox
                      checked={recipients.includes(app.name)}
                      onCheckedChange={(checked) => 
                        handleRecipientChange(app.name, checked as boolean)
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                        {app.logo}
                        {app.name}
                        {app.connected && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            已连接
                          </span>
                        )}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {app.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.recipients && (
                <p className="text-sm text-red-500">{errors.recipients}</p>
              )}
            </div>

            {/* 通知内容 */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  通知内容
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  请输入要发送的通知内容（10-1000个字符）
                </p>
              </div>
              <Textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="请输入通知内容，例如：紧急通知：由于强降雨天气，请各单位做好防涝准备工作..."
                className="min-h-[120px] resize-none"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {content.length}/1000 字符
                </span>
                {errors.content && (
                  <span className="text-red-500">{errors.content}</span>
                )}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                重置
              </Button>
              <Button type="submit">
                发送通知
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}