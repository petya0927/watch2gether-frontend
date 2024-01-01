import { handleIsUsernameTaken, isRoomExists } from '@/api/rooms';
import { isValidUrl } from '@/utils/helperFunctions';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight, IconLink } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface JoinRoomFormProps {
  username: string;
  setUsernameError: Dispatch<SetStateAction<string>>;
}

const JoinRoomForm = ({ username, setUsernameError }: JoinRoomFormProps) => {
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
        if (isValidUrl(value)) {
          let url = new URL(value);
          const roomId = url.pathname.split('/')[2];

          if (!roomId) {
            return 'Please enter a valid room link';
          } else if (
            roomId.length !== 24 ||
            !value.includes(window.location.host + '/room/' + roomId)
          ) {
            return 'Please enter a valid room link';
          } else if (roomExistsError) {
            return roomExistsError;
          }
        } else return 'Please enter a valid room link';
      },
    },
    onValuesChange: (values) => {
      if (values.url) {
        if (isValidUrl(values.url)) {
          let url = new URL(values.url, window.location.href);
          url.searchParams.delete('username');
          values.url = url.toString();
        }
        return values;
      }
    },
    transformValues: (values) => {
      if (!values.url.startsWith('http') && !values.url.startsWith('https')) {
        values.url = window.location.protocol + '//' + values.url;
      }

      return values;
    },
  });

  useEffect(() => {
    const roomId = existingRoomForm.values.url.trim().split('/').pop();
    setUsernameError('');

    if (roomId && roomId.length === 24) {
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
            setUsernameError('Username is already taken in this room');
          } else {
            existingRoomForm.setFieldError('username', '');
            setUsernameError('');
          }
        }
      };

      const validateRoomExistence = async () => {
        if (roomId) {
          const isExists = await isRoomExists(roomId);
          if (!isExists) {
            setRoomExistsError('Room does not exist');
          } else if (isExists === undefined) {
            setRoomExistsError('Something went wrong. Please try again later');
          } else {
            setRoomExistsError('');
          }
        }
      };

      checkUsernameAvailability();
      validateRoomExistence();
    }

    existingRoomForm.setFieldValue('username', username);
  }, [username, existingRoomForm.values.url]);

  const handleJoinRoom = () => {
    router.push(`${existingRoomForm.values.url}?username=${username}`);
  };

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={existingRoomForm.onSubmit(handleJoinRoom)}
    >
      <h3 className="text-white text-xl font-semibold text-center leading-none">
        Or join an existing room
      </h3>
      <div className="flex flex-row items-center justify-center gap-2 w-full">
        <TextInput
          placeholder="Link to existing room"
          leftSection={<IconLink size={20} />}
          classNames={{
            root: 'w-2/3 sm:w-1/2',
            input: `!bg-transparent rounded-md ${
              existingRoomForm.errors.url
                ? 'border-red-500 text-red-500 border-1'
                : 'border-white text-white'
            }`,
          }}
          error={existingRoomForm.errors.url}
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
    </form>
  );
};

export default JoinRoomForm;
