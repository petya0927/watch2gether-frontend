import { sendMessage } from '@/api/socket';
import { Message } from '@/app/types';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend2 } from '@tabler/icons-react';
import React from 'react';
import { uid } from 'uid';

interface ChatInputProps {
  addMessage: (message: Message) => void;
  username: string;
}

const ChatInput = ({ addMessage, username }: ChatInputProps) => {
  const form = useForm({
    initialValues: {
      message: '',
    },
    validate: {
      message: (value) => {
        if (!value) {
          return 'Please enter a message';
        }
      },
    },
  });

  const handleSubmit = () => {
    if (!form.values.message) {
      return;
    }

    const message: Message = {
      id: uid(24),
      message: form.values.message,
      username,
      createdAt: new Date().toISOString(),
    };

    addMessage(message);
    sendMessage({ message });
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="w-full">
      <TextInput
        placeholder="Type a message"
        classNames={{
          root: 'w-full',
          section: 'w-auto',
          input: `!bg-transparent rounded-md`,
        }}
        rightSection={
          <Button
            type="submit"
            disabled={!form.values.message}
            variant="transparent"
            classNames={{
              root: 'bg-transparent px-2',
            }}
          >
            <IconSend2 size={20} />
          </Button>
        }
        {...form.getInputProps('message')}
      />
    </form>
  );
};

export default ChatInput;
