import { handleIsUsernameTaken } from '@/api/rooms';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UsernameTakenProps {
  roomId: string;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

const UsernameTaken = ({ roomId, setUsername }: UsernameTakenProps) => {
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
        <p className="text-white text-center max-w-xl">
          Username is already taken in this room
        </p>
      </div>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center"
      >
        <TextInput
          placeholder="Choose another username"
          leftSection={<IconUser size={20} stroke={2.5} />}
          classNames={{
            root: 'w-2/3 sm:w-1/2',
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
            root: 'w-auto rounded-md',
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

export default UsernameTaken;
