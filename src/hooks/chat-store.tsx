// store.ts
import { create } from 'zustand';
import OpenAI from 'openai';
import { type UIMessage, type CreateUIMessage } from '@ai-sdk/react';


// 本地定义 ChatStatus 类型
type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error';

const SYSTEM_PROMPT=`# 角色和目标
你是一个顶级的防汛决策智能助手（AI Agent）。你的核心任务是解析输入信息，并根据不同的指令类型，生成格式化、专业化、条理清晰的响应。你必须严格遵守以下规则。

# 指令类型与响应格式

### 类型1：预警分析 (当输入为结构化的预测数据时)
- **任务**: 将复杂的JSON格式数据翻译成一段通俗易懂、重点突出的自然语言摘要。
- **输出格式**: 以“【预警分析摘要】”开头，用精炼的语言描述时间、地点、事件和核心风险点。

### 类型2：自然语言查询 (当输入为一句问话时)
- **任务**: 理解用户的查询意图，并以清晰的结构化方式回答问题。
- **输出格式**: 以“【XX分析/查询结果】”开头，如果内容较多，优先使用无序列表（-）或有序列表（1. 2. 3.）来呈现答案，使信息一目了然。

### 类型3：决策建议生成 (当输入包含“预警”、“风险”等关键词，并要求“建议”时)
- **任务**: 基于预警级别和内置知识库（模拟），生成一套完整的、可执行的行动建议方案。
- **输出格式**:
    1. 以“【XX预警 - 决策建议】”开头。
    2. 明确提出总体的响应级别建议，例如“建议立即启动 [一级应急响应]”。
    3. 使用“核心行动建议”作为小标题，用有序列表呈现具体的行动项。
    4. 如有需要，使用“建议向以下部门发送通知”作为小标题，用无序列表呈现需要通知的部门和建议的通知内容。

### 类型4：AI智能体任务规划 (当输入是一个需要多步骤执行的指令时)
- **任务**: 这是你的核心能力。你需要将用户的指令分解为一系列对虚拟MCP插件的调用步骤，以展示你的自主规划能力。
- **关键规则**: **你必须使用 Markdown 的无序列表（以'-'开头）来模拟这个过程**。每一个步骤都必须遵循 **“调用 [插件名称] -> 执行操作 -> 涉及的 [关键参数]”** 这种格式。
- **输出格式**:
    1. 以“【AI智能体任务规划】”开头。
    2. 第一行固定为：“收到指令，正在规划并执行任务...”。
    3. 接下来是模拟插件调用的无序列表。
    4. 结尾固定为：“任务规划完毕，即将执行。”

---
**示例（类型4）：**
- **输入**: "立即向所有一线防汛人员发送暴雨预警短信"
- **你的输出**:
  【AI智能体任务规划】
  收到指令，正在规划并执行任务...
  - 调用 [人员定位插件] -> 获取所有“一线防汛人员”的列表。
  - 调用 [通讯录插件] -> 获取目标人员的 [手机号码]。
  - 调用 [短信网关插件] -> 向目标 [手机号码] 批量发送预警短信。
  任务规划完毕，即将执行。
---

现在，请严格按照以上规则，处理接下来的输入。`

// 定义 OpenAI 客户端实例
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true,
});

// 定义 Store 的 state 和 actions 的接口
export interface ChatState {
  messages: Array<UIMessage>;
  status: ChatStatus;
  error?: Error;
  abortController: AbortController | null;
  // Actions
  setMessages: (messages: Array<UIMessage>) => void;
  sendMessage: (message: UIMessage | CreateUIMessage<UIMessage>) => Promise<void>;
  stop: () => void;
}

// 创建 Zustand store
export const useChatStore = create<ChatState>((set, get) => ({
  // 初始状态
  messages: [],
  status: 'ready',
  error: undefined,
  abortController: null,

  /**
   * Action: 设置消息列表
   */
  setMessages: (messages) => {
    set({ messages });
  },

  /**
   * Action: 停止生成
   */
  stop: () => {
    const controller = get().abortController;
    if (controller) {
      controller.abort();
      set({ status: 'ready', abortController: null });
    }
  },

  /**
   * Action: 发送消息并处理流式响应
   */
  sendMessage: async (message) => {
    // 1. 设置状态为 'submitted' 并清空之前的错误
    set({ status: 'submitted', error: undefined });

    // 2. 构造新的用户消息
    const newUserMessageParts =
      message.parts ||
      (typeof (message as any).text === 'string'
        ? [{ type: 'text', text: (message as any).text }]
        : []);

    const newUserMessage: UIMessage = {
      id: message.id || String(Date.now()),
      role: message.role || 'user',
      parts: newUserMessageParts,
    };

    // 3. 将用户消息添加到消息列表中
    set((state) => ({ messages: [...state.messages, newUserMessage] }));

    // 4. 创建并存储 AbortController 以便可以中断请求
    const controller = new AbortController();
    set({ abortController: controller });

    try {
      // 5. 获取当前完整的消息列表用于 API 请求
      const currentMessages = get().messages;
      const result = await openai.chat.completions.create(
        {
          model: 'deepseek-chat',
          messages: [
      { role: 'system', content: SYSTEM_PROMPT }, 
            ...currentMessages.map((msg) => ({ 
            role: msg.role as 'user' | 'assistant', 
             content: msg.parts
           .map((part) => (part.type === 'text' ? part.text : ''))
             .join('\n'),
           })),
          ],
          stream: true,
        },
        { signal: controller.signal },
      );

      // 6. 设置状态为 'streaming' 并创建一个空的助手消息用于接收内容
      set({ status: 'streaming' });
      let accumulatedContent = '';
      const assistantMessageId = String(Date.now() + 1);

      // 先添加一个空的 assistant 消息
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: assistantMessageId,
            role: 'assistant',
            parts: [{ type: 'text', text: '' }],
          },
        ],
      }));

      // 7. 遍历流式响应并持续更新助手消息的内容
      for await (const chunk of result) {
        const delta = chunk.choices[0].delta;
        if (delta.content) {
          accumulatedContent += delta.content;
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, parts: [{ type: 'text', text: accumulatedContent }] }
                : msg,
            ),
          }));
        }
      }
    } catch (e: any) {
      // 8. 错误处理
      if (e.name === 'AbortError') {
        console.log('Stream aborted by user.');
      } else {
        console.error('Error during streaming:', e);
        set({ status: 'error', error: e });
      }
    } finally {
      // 9. 请求结束（无论成功、失败还是中止），都重置状态
      set({ status: 'ready', abortController: null });
    }
  },
}));

