'use client';
import CreateRoomForm from '@/components/CreateRoomForm';
import JoinRoomForm from '@/components/JoinRoomForm';
import { TextInput } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { CreateRoomFormRef, ExistingRoomFormRef } from './types';

export default function Home() {
  const [username, setUsername] = useState('');
  const createRoomFormRef = useRef<CreateRoomFormRef>(null);
  const existingRoomFormRef = useRef<ExistingRoomFormRef>(null);

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="font-bold text-white text-4xl text-center">
          Welcome to Watch2gether!
        </h1>
        <p className="text-white text-center max-w-xl">
          Watch videos with your friends together from anywhere in real-time.
        </p>
      </div>
      <TextInput
        placeholder="Choose username"
        leftSection={<IconUser size={20} />}
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
        classNames={{
          root: 'w-2/3 sm:w-1/2',
          input: `!bg-transparent border-1 rounded-md ${
            createRoomFormRef.current?.errors.username ||
            existingRoomFormRef.current?.errors.username
              ? 'border-red-500 text-red-500'
              : 'border-white text-white'
          }`,
          section: `${
            createRoomFormRef.current?.errors.username ||
            existingRoomFormRef.current?.errors.username
              ? 'text-red-500'
              : ''
          }`,
        }}
        error={
          createRoomFormRef.current?.errors.username ||
          existingRoomFormRef.current?.errors.username
        }
      />
      <CreateRoomForm username={username} formRef={createRoomFormRef} />
      <JoinRoomForm username={username} formRef={existingRoomFormRef} />
    </div>
  );
}
