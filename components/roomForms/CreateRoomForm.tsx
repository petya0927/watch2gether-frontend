import { createRoom } from '@/api/rooms';
import { isValidUrl } from '@/utils/helperFunctions';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandYoutube, IconPlus } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ReactPlayer from 'react-player';

interface CreateRoomFormProps {
  username: string;
}

const CreateRoomForm = ({ username }: CreateRoomFormProps) => {
  const router = useRouter();

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
        if (!isValidUrl(value)) {
          return 'Please enter a valid link';
        } else if (!ReactPlayer.canPlay(value)) {
          return "We don't support this video link, please try another one";
        }
      },
    },
  });

  useEffect(() => {
    createRoomForm.setFieldValue('username', username);
  }, [username]);

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
    onError: (error) => {
      createRoomForm.setFieldError(
        'videoUrl',
        'Error creating room, please try again later.'
      );
    },
  });

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={createRoomForm.onSubmit(() => {
        createRoomMutation.mutate();
      })}
    >
      <div className="flex flex-col items-center justify-center gap-1">
        <h3 className="text-white text-xl font-semibold text-center leading-none">
          Create a room
        </h3>
        <p className="text-white text-center">
          Paste a YouTube video link below to start
        </p>
      </div>

      <div className="flex flex-row items-center justify-center gap-2">
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
          variant="white"
          type="submit"
          color="dark"
          disabled={
            !!createRoomForm.errors.videoUrl ||
            !!createRoomForm.errors.username ||
            !createRoomForm.values.videoUrl ||
            !createRoomForm.values.username
          }
          loading={createRoomMutation.isPending}
          classNames={{
            root: 'w-auto rounded-md sm:self-start disabled:opacity-50 bg-white',
            label: 'flex gap-1 items-center justify-center',
          }}
        >
          Create
          <IconPlus size={16} stroke={2.5} />
        </Button>
      </div>
    </form>
  );
};

export default CreateRoomForm;
