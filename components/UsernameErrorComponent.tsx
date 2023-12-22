import { handleIsUsernameTaken } from '@/api/rooms';
import { RoomErrors } from '@/app/types';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UsernameErrorComponentProps {
  roomId: string;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  roomError: RoomErrors | null;
}

const UsernameErrorComponent = ({
  roomId,
  setUsername,
  roomError,
}: UsernameErrorComponentProps) => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      username: '',
    },
    validate: {
      username: (value) => {
        if (!value) {
          return 'Please enter a username';
        }
      },
    },
  });

  useEffect(() => {
    form.values.username &&
      handleIsUsernameTaken({ roomId, username: form.values.username }).then(
        (isTaken) => {
          if (isTaken) {
            form.setFieldError('username', 'Username is already taken');
          } else {
            form.setFieldError('username', null);
          }
        }
      );
  }, [form.values.username]);

  const handleSubmit = () => {
    setUsername(form.values.username);
    router.push(`/room/${roomId}?username=${form.values.username}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-full">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-white text-4xl text-center">
          Welcome to Watch2gether!
        </h1>
        {roomError === RoomErrors.USERNAME_TAKEN && (
          <p className="text-white text-center max-w-xl">
            Username is already taken in this room
          </p>
        )}

        {roomError === RoomErrors.USERNAME_EMPTY && (
          <p className="text-white text-center max-w-xl">
            Please enter a username to join the room
          </p>
        )}
      </div>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-row gap-2 justify-center"
      >
        <TextInput
          placeholder={
            roomError === RoomErrors.USERNAME_TAKEN
              ? 'Choose another username'
              : 'Choose a username'
          }
          leftSection={<IconUser size={20} stroke={2.5} />}
          classNames={{
            root: 'w-2/3',
            input: `!bg-transparent border-1 rounded-md ${
              form.errors.username
                ? 'border-red-500 text-red-500'
                : 'border-white text-white'
            }`,
            section: `${form.errors.username ? 'text-red-500' : ''}`,
          }}
          error={form.errors.username}
          {...form.getInputProps('username')}
        />
        <Button
          variant="white"
          color="black"
          type="submit"
          disabled={!!form.errors.username || !form.values.username}
          classNames={{
            root: 'w-auto rounded-md sm:self-start !bg-white !text-black disabled:opacity-50 disabled:text-gray-400',
            label: 'flex gap-1 items-center justify-center',
          }}
        >
          Join
          <IconArrowRight size={16} stroke={2.5} />
        </Button>
      </form>
    </div>
  );
};

export default UsernameErrorComponent;
