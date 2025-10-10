// useChat.ts
import { useEffect, useRef } from 'react';
import { useChatStore } from './chat-store'; // 引入我们创建的 store
import { type UIMessage } from '@ai-sdk/react';
import { useMCP } from './mcp-store';

interface useChatProps {
  initialMessages?: Array<UIMessage>;
}

export const useChat = (props: useChatProps) => {
  // 从 Zustand store 中解构出所有需要的 state 和 actions
  const { messages, status, error, sendMessage, stop, setMessages } = useChatStore();


  // 使用 ref 和 useEffect 来确保 initialMessages 只被设置一次
  const isInitialised = useRef(false);
  useEffect(() => {
    if (!isInitialised.current && props.initialMessages) {
      setMessages(props.initialMessages);
      isInitialised.current = true;
    }
  }, [props.initialMessages, setMessages]);
  
  // 返回从 store 中获取的 state 和 actions
  return {
    messages,
    status,
    error,
    sendMessage,
    stop,

  };
};