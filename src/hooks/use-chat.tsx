
import OpenAI from 'openai';
import { useCallback, useState, useRef } from 'react';
import {
  type UIMessage,
  type CreateUIMessage,
  // The ChatStatus and streamText types are no longer directly exported from @ai-sdk/react in the same way.
  // We will define ChatStatus locally and use the OpenAI client directly for streaming.
} from '@ai-sdk/react';

type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'; // Local definition


const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true,
});

// We will directly use the OpenAI stream for completions

interface useChatProps {
  id: string;
  initialMessages?: Array<UIMessage>;
}

export const useChat = (props: useChatProps) => {
  const [messages, setMessages] = useState<Array<UIMessage>>(
    props.initialMessages || [],
  );
  const [status, setStatus] = useState<ChatStatus>('ready');
  const [error, setError] = useState<Error | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (
      message: UIMessage | CreateUIMessage<UIMessage>,
      // chatRequestOptions?: ChatRequestOptions, // Not directly used in this direct implementation
    ) => {
      setStatus('submitted');
      setError(undefined);

      const newUserMessageParts = message.parts || (typeof (message as any).text === 'string'
        ? [{ type: 'text', text: (message as any).text }]
        : []);

      const newUserMessage: UIMessage = {
        id: message.id || String(Date.now()),
        role: message.role || 'user',
        parts: newUserMessageParts,
        // Remove ...message to avoid potential duplicate 'parts' property
      };

      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const result = await openai.chat.completions.create(
          {
            model: "deepseek-chat",
            messages: [...messages, newUserMessage].map((msg) => ({
              role: msg.role,
              content: msg.parts.map((part) => (part.type === 'text' ? part.text : '')).join('\n'),
            })),
            stream: true,
          },
          { signal: signal } // Pass abortSignal in options
        );

        setStatus('streaming');

        let accumulatedContent = '';
        const assistantMessageId = String(Date.now() + 1); // Simple ID for assistant message

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: assistantMessageId,
            role: 'assistant',
            parts: [{ type: 'text', text: '' }],
          },
        ]);

        for await (const chunk of result) {
          const delta = chunk.choices[0].delta;
          if (delta.content) {
            accumulatedContent += delta.content;
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === assistantMessageId
                  ? {
                      ...msg,
                      parts: [{ type: 'text', text: accumulatedContent }],
                    }
                  : msg,
              ),
            );
          }
        }

        // After the stream finishes, set status to ready
        setStatus('ready');
        abortControllerRef.current = null;

      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.log('Stream aborted.');
        } else {
          console.error('Error during streaming:', e);
          setError(e);
          setStatus('error');
        }
        abortControllerRef.current = null;
      }
    },
    [messages], // Include messages in dependency array
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStatus('ready'); // Or 'stopped' if you want a distinct status
    }
  }, []);

  return {
    messages,
    sendMessage,
    status,
    stop,
    error,
  };
};

// Removed the standalone deepSeekPost and openai instance from here
// as they are now integrated directly into the useChat hook.
// This example also demonstrates how to adapt the parts of UIMessage to a simple text content for the model.