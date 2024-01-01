'use client';
import CreateRoomForm from '@/components/roomForms/CreateRoomForm';
import JoinRoomForm from '@/components/roomForms/JoinRoomForm';
import { TextInput } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full max-w-2xl mx-auto p-4">
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
          root: 'w-full sm:w-1/2',
          input: `!bg-transparent border-1 rounded-md ${
            usernameError
              ? 'border-red-500 text-red-500'
              : 'border-white text-white'
          }`,
          section: `${usernameError ? 'text-red-500' : ''}`,
        }}
        error={usernameError}
      />
      <CreateRoomForm username={username} />
      <JoinRoomForm username={username} setUsernameError={setUsernameError} />
    </div>
  );
}
