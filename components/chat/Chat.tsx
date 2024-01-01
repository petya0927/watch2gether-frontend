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
    const scrollPosition = bottomRef.current?.parentElement?.scrollTop || 0;
    const scrollHeight = bottomRef.current?.parentElement?.scrollHeight || 0;
    const offsetHeight = bottomRef.current?.parentElement?.offsetHeight || 0;

    if (scrollHeight - (scrollPosition + offsetHeight) < 100) {
      bottomRef.current?.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
      });
    }
  }, [messages]);

  return (
    <div className="bg-white flex flex-col gap-2 items-start rounded-2xl p-4 w-full md:w-1/3 shadow-lg h-full max-h-96 md:max-h-none">
      <h2 className="font-bold text-xl">Chat</h2>
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
          <p className="text-gray-500 text-center">
            No messages yet. Be the first to send one!
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2 w-full overflow-y-auto">
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
