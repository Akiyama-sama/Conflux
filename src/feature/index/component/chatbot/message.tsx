"use client";

import { motion } from "framer-motion";

import { BotIcon, UserIcon } from "./icons.tsx";
import { Markdown } from "./markdown";
import { ListOnline } from "./mcp-tools/list-flights.tsx";

export const Message = ({
  chatId,
  role,
  parts,
}: {
  chatId: string;
  role: string;
  parts: Array<any>;
}) => {
  // Extract text and tool parts
  const textParts = parts.filter(part => part.type === 'text');
  const toolParts = parts.filter(part => part.type === 'tool' || part.type === 'dynamic-tool');
  
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full  first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[20px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full p-2 border-2 border-border rounded-md text-sm shadow-md">
        {textParts.length > 0 && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            {textParts.map((part, index) => (
              <Markdown key={index}>{part.text}</Markdown>
            ))}
          </div>
        )}

        {toolParts.length > 0 && (
          <div className="flex flex-col gap-4">
            {toolParts.map((toolPart, index) => {
              const { toolName, result } = toolPart;

              if (result) {
                return (
                  <div key={index}>
                    {toolName === "ListOnline" ? <ListOnline chatId={chatId} results={result} /> : (
                      <div>{JSON.stringify(result, null, 2)}</div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={index} className="skeleton">
                    {toolName === "ListOnline" ? (
                      <ListOnline chatId={chatId} />
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}

      </div>
    </motion.div>
  );
};
