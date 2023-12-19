'use client';
import { createRoom, handleIsUsernameTaken, isRoomExists } from '@/api/rooms';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconArrowRight,
  IconBrandYoutube,
  IconLink,
  IconPlus,
  IconUser,
} from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [roomExistsError, setRoomExistsError] = useState('');

  const createRoomForm = useForm({
    initialValues: {
      username,
      videoUrl: '',
    },
    validate: {
      username: (value) => {
        if (!value) {
          return 'Please enter a username';
        }
      },
      videoUrl: (value) => {
        if (!value.includes('youtube.com')) {
          return "We're sorry, but we only support YouTube videos at the moment";
        } else if (!value.includes('youtube.com/watch?v=')) {
          return 'Please enter a valid YouTube video link';
        }
      },
    },
  });

  const existingRoomForm = useForm({
    initialValues: {
      username,
      url: '',
    },
    validate: {
      username: (value) => {
        if (!value) {
          return 'Please enter a username';
        }
      },
      url: (value) => {
        let url = new URL(value);
        const roomId = url.pathname.split('/')[2];

        if (
          roomId.length !== 16 ||
          !value.includes(window.location.host + '/room/' + roomId)
        ) {
          return 'Please enter a valid room link';
        } else if (roomExistsError) {
          return roomExistsError;
        }
      },
    },
  });

  useEffect(() => {
    const roomId = existingRoomForm.values.url
      .trim()
      .split('/')
      .pop() as string;

    const checkUsernameAvailability = async () => {
      if (existingRoomForm.values.url && username) {
        const isTaken = await handleIsUsernameTaken({
          roomId,
          username,
        });
        if (isTaken) {
          existingRoomForm.setFieldError(
            'username',
            'Username is already taken in this room'
          );
        } else {
          existingRoomForm.setFieldError('username', '');
        }
      }
    };

    const validateRoomExistence = async () => {
      const roomId = existingRoomForm.values.url
        .trim()
        .split('/')
        .pop() as string;

      if (roomId) {
        const isExists = await isRoomExists(roomId);
        if (!isExists) {
          setRoomExistsError('Room does not exist');
        } else {
          setRoomExistsError('');
        }
      }
    };

    checkUsernameAvailability();
    validateRoomExistence();

    createRoomForm.setFieldValue('username', username);
    existingRoomForm.setFieldValue('username', username);
  }, [username, existingRoomForm.values.url]);

  const createRoomMutation = useMutation({
    mutationFn: () =>
      createRoom({
        videoUrl: createRoomForm.values.videoUrl,
        owner: createRoomForm.values.username,
      }),
    onSuccess: (data: { id: string }) => {
      router.push(
        `/room/${data.id}?username=${createRoomForm.values.username}`
      );
    },
  });

  const handleJoinRoom = () => {
    let url = existingRoomForm.values.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = window.location.protocol + '//' + url;
    }
    router.push(`${url}?username=${username}`);
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center my-auto">
      <div className="flex flex-col gap-4">
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
            createRoomForm.errors.username || existingRoomForm.errors.username
              ? 'border-red-500 text-red-500'
              : 'border-white text-white'
          }`,
          section: `${
            createRoomForm.errors.username || existingRoomForm.errors.username
              ? 'text-red-500'
              : ''
          }`,
        }}
        error={
          createRoomForm.errors.username || existingRoomForm.errors.username
        }
      />
      <form
        className="flex flex-col gap-8 items-center justify-center w-full"
        onSubmit={createRoomForm.onSubmit(() => {
          createRoomMutation.mutate();
        })}
      >
        <div className="flex flex-col gap-2 justify-center items-center w-full">
          <h3 className="text-white text-xl font-semibold text-center leading-none">
            Create a room
          </h3>
          <p className="text-white text-center">
            Paste a YouTube video link below to start
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center">
            <TextInput
              placeholder="YouTube video link"
              leftSection={<IconBrandYoutube size={20} />}
              classNames={{
                root: 'w-2/3 sm:w-1/2',
                input: `!bg-transparent border-1 rounded-md ${
                  createRoomForm.errors.videoUrl
                    ? 'border-red-500 text-red-500'
                    : 'border-white text-white'
                }`,
              }}
              {...createRoomForm.getInputProps('videoUrl')}
            />
            <Button
              type="submit"
              disabled={
                !!createRoomForm.errors.videoUrl ||
                !!createRoomForm.errors.username ||
                !createRoomForm.values.videoUrl ||
                !createRoomForm.values.username
              }
              loading={createRoomMutation.isPending}
              classNames={{
                root: 'w-auto rounded-md sm:self-start !bg-white !text-black disabled:opacity-50 disabled:text-gray-400',
                label: 'flex gap-1 items-center justify-center',
              }}
            >
              Create
              <IconPlus size={16} stroke={2.5} />
            </Button>
          </div>
        </div>
      </form>
      <form
        className="flex flex-col gap-8 items-center justify-center w-full"
        onSubmit={existingRoomForm.onSubmit(handleJoinRoom)}
      >
        <div className="flex flex-col gap-2 justify-center items-center w-full">
          <h3 className="text-white text-xl font-semibold text-center leading-none">
            Or join an existing room
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center">
            <TextInput
              placeholder="Link to existing room"
              leftSection={<IconLink size={20} />}
              classNames={{
                root: 'w-2/3 sm:w-1/2',
                input: `!bg-transparent border-1 rounded-md ${
                  existingRoomForm.errors.existingRoomUrl
                    ? 'border-red-500 text-red-500'
                    : 'border-white text-white'
                }`,
              }}
              {...existingRoomForm.getInputProps('url')}
            />
            <Button
              type="submit"
              disabled={
                !!existingRoomForm.errors.url ||
                !!existingRoomForm.errors.username ||
                !existingRoomForm.values.url ||
                !existingRoomForm.values.username
              }
              classNames={{
                root: 'w-auto rounded-md sm:self-start !bg-white !text-black disabled:opacity-50 disabled:text-gray-400',
                label: 'flex gap-1 items-center justify-center',
              }}
            >
              Join
              <IconArrowRight size={16} stroke={2.5} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
