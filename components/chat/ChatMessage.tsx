import { Message } from '@/app/types';
import React, { memo } from 'react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = memo(({ message }: ChatMessageProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">{message.username}</span>
      <span>{message.message}</span>
    </div>
  );
});

export default ChatMessage;
