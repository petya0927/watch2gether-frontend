import { handleIsUsernameTaken, isRoomExists } from '@/api/rooms';
import { ExistingRoomFormRef } from '@/app/types';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight, IconLink } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, {
  RefObject,
  useEffect,
  useState,
  useImperativeHandle,
} from 'react';

interface JoinRoomFormProps {
  username: string;
  formRef: RefObject<ExistingRoomFormRef>;
}

const JoinRoomForm = ({ username, formRef }: JoinRoomFormProps) => {
  const router = useRouter();
  const [roomExistsError, setRoomExistsError] = useState('');

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

  useImperativeHandle(formRef, () => existingRoomForm);

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

    existingRoomForm.setFieldValue('username', username);
  }, [username, existingRoomForm.values.url]);

  const handleJoinRoom = () => {
    let url = existingRoomForm.values.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = window.location.protocol + '//' + url;
    }
    router.push(`${url}?username=${username}`);
  };

  return (
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
  );
};

export default JoinRoomForm;
