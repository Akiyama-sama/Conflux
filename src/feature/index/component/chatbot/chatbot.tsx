
import { Chat } from './chat';

export default function Chatbot() {
  return (
    <div className="w-full h-full max-w-full  ">
      <Chat id="chatbot" initialMessages={[]} />
    </div>
  )
}