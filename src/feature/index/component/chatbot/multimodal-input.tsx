'use client'

import {
  type ChatRequestOptions,
  type CreateUIMessage,
  type UIMessage,
} from 'ai'
import { motion } from 'framer-motion'
import React, { useRef, useCallback, useState } from 'react'
import { toast } from 'sonner'

import { ArrowUpIcon, StopIcon } from './icons'
import useWindowSize from './use-window-size'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SquareTerminal } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { MCPSelectData } from '@/feature/index/data/mcp-select-data'
import { useMCP } from '@/hooks/mcp-store'
const suggestedActions = [
  {
    title: '暴雨洪涝查询',
    label: '帮我查询一下福州市的历史暴雨洪涝事件',
    action: '帮我查询一下福州市的历史暴雨洪涝事件',
  },
  {
    title: '有关Conflux Agent',
    label: '你的角色与定位是什么',
    action: '你的角色与定位是什么',
  },
]

export function MultimodalInput({
  isLoading,
  stop,
  messages,
  sendMessage,
}: {
  isLoading: boolean
  stop: () => void
  messages: Array<UIMessage>
  sendMessage: (
    message: UIMessage | CreateUIMessage<UIMessage>,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<void>

}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()
  const [input, setInput] = useState('')
  const [isOpenMCPTool, setIsOpenMCPTool] = useState(false)
  const { mcps, setMCPs } = useMCP();



  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const submitForm = useCallback(() => {
    sendMessage({
      role: 'user',
      parts: [
        {
          type: 'text',
          text: input,
        },
      ],
    })
    if (width && width > 768) {
      textareaRef.current?.focus()
    }
    setInput('')
  }, [width, sendMessage, input])

  return (
    <div className="relative w-full flex flex-col gap-4 p-2">
      {messages.length === 0 && (
        <div className="grid sm:grid-cols-2 gap-4 w-full ">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={index}
              className={index > 1 ? 'hidden sm:block' : 'block'}
            >
              <button
                onClick={async () => {
                  sendMessage({
                    role: 'user',
                    parts: [
                      {
                        type: 'text',
                        text: suggestedAction.action,
                      },
                    ],
                  })
                  setIsOpenMCPTool(false)
                }}
                className="border-none bg-muted/50 w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
              >
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {suggestedAction.label}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      )}
      {isOpenMCPTool && (
        <div
          className="p-2 gap-1 bg-muted  border-1 rounded-md w-full px-2 h-fit text-sm flex flex-col shadow-xs"
        >
            {
              mcps.map((item) => (
                <div 
                key={item.label} 
                className={`flex flex-row items-center hover:bg-ring/30 hover:cursor-pointer rounded-md p-1 gap-2
                  ${item.isSelected ? 'bg-ring/30' : ''}`}
                
                onClick={() => {
                  const newMCPs = mcps.map(mcp => 
                    mcp.label === item.label 
                      ? { ...mcp, isSelected: !mcp.isSelected }
                      : mcp
                  );
                  setMCPs(newMCPs);
                }}
                >
                  {item.icon}
                  <p>{item.label}</p>
                </div>
              ))
            }
        </div>
      )}
      <Textarea
        ref={textareaRef}
        placeholder="给AI助手发送消息..."
        value={input}
        onChange={handleInput}
        className="min-h-[60px] overflow-hidden w-full max-w-full rounded-md text-base bg-muted border-1 border-border shadow-md  border-none"
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            if (isLoading) {
              toast.error('Please wait for the model to finish its response!')
            } else {
              submitForm()
            }
          }
        }}
      />

      <Button
        type="button"
        className={`rounded-xl p-1.5 h-fit absolute bottom-6 right-13 m-0.5 text-white hover:cursor-pointer 
          
          ${mcps.some(mcp=>mcp.isSelected)? 'bg-primary' : 'bg-ring/50'}`}

        onClick={() => setIsOpenMCPTool(!isOpenMCPTool)}
      >
        <SquareTerminal size={12} />
      </Button>

      {isLoading ? (
        <Button
          type="button"
          className="rounded-xl p-1.5 h-fit absolute bottom-6 right-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault()
            stop()
            setIsOpenMCPTool(false)
          }}
        >
          <StopIcon size={12} />
        </Button>
      ) : (
        <Button
          type="button"
          className="rounded-xl p-1.5 h-fit absolute bottom-6 right-2 m-0.5 text-white"
          onClick={(event) => {
            event.preventDefault()
            submitForm()
            setIsOpenMCPTool(false)
          }}
          disabled={input.length === 0}
        >
          <ArrowUpIcon size={12} />
        </Button>
      )}
    </div>
  )
}
