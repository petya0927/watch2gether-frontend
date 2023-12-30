import { Message } from '@/app/types';
import ChatInput from './ChatInput';

interface ChatProps {
  messages: Message[];
  addMessage: (message: Message) => void;
  username: string;
}

const Chat = ({ messages, addMessage, username }: ChatProps) => {
  return (
    <div className="bg-white flex flex-col gap-2 items-start rounded-2xl p-4 w-full md:w-1/3 shadow-lg h-full max-h-96 md:max-h-[79vh]">
      <h2 className="font-bold text-xl">Chat</h2>
      <div className="flex flex-col gap-2 w-full h-full overflow-y-scroll">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-2">
            <span className="font-bold">{message.username}</span>
            <span>{message.message}</span>
          </div>
        ))}
      </div>
      <ChatInput addMessage={addMessage} username={username} />
    </div>
  );
};

export default Chat;
