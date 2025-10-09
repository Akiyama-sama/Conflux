"use client";

import {  type UIMessage } from "@ai-sdk/react";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

import { Message as PreviewMessage } from "./message";
import { useScrollToBottom } from "./use-scroll-to-bottom";

import { MultimodalInput } from "./multimodal-input";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
}) {
  const { messages, sendMessage, status, stop } =
    useChat({
      id,
    });


  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  

  return (
    <div className="flex flex-row w-full max-w-full justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col w-full max-w-full justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-full max-w-full items-center overflow-y-scroll"
        >
        

          {messages.map((message) => (
            <PreviewMessage
              key={message.id}
              chatId={id}
              role={message.role}
              parts={message.parts}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
            isLoading={status === "streaming"}
            stop={stop}
            messages={messages}
            sendMessage={sendMessage}
          />
        </form>
      </div>
    </div>
  );
}
