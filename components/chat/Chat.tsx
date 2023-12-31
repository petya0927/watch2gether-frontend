import { Message } from '@/app/types';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { useEffect, useRef } from 'react';

interface ChatProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  username: string;
}

const Chat = ({ messages, addMessage, username }: ChatProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white flex flex-col gap-2 items-start rounded-2xl p-4 w-full md:w-1/3 shadow-lg h-full max-h-96 md:max-h-[79vh]">
      <h2 className="font-bold text-xl">Chat</h2>
      <div className="flex flex-col gap-2 w-full h-full overflow-y-scroll">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
      <ChatInput addMessage={addMessage} username={username} />
    </div>
  );
};

export default Chat;
