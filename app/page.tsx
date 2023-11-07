"use client";
import { createRoom } from "./api/rooms";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const form = useForm({
    initialValues: {
      username: "",
      videoUrl: "",
      // existingRoomUrl: "",
    },
    validate: {
      username: (value) => {
        if (!value) {
          return "Please enter a username";
        }
      },
      videoUrl: (value) => {
        if (!value.includes("youtube.com")) {
          return "We're sorry, but we only support YouTube videos at the moment";
        } else if (!value.includes("youtube.com/watch?v=")) {
          return "Please enter a valid YouTube video link";
        }
      },
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => {
      // console.log(data);
    },
  });

  const handleFormSubmit = () => {
    createRoomMutation.mutate({
      videoUrl: form.values.videoUrl,
      owner: form.values.username,
    });
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center my-auto">
      <h1 className="font-bold text-white text-4xl text-center">
        Welcome to Watch2gether!
      </h1>
      <p className="text-white text-center max-w-xl">
        Watch videos with your friends together from anywhere in real-time.
      </p>
      <form
        className="flex flex-col gap-8 items-center justify-center w-full"
        onSubmit={form.onSubmit(handleFormSubmit)}
      >
        <TextInput
          placeholder="Choose username"
          classNames={{
            root: "w-full sm:w-1/2",
            input: `!bg-transparent border-1 rounded-md ${
              form.errors.username
                ? "border-red-500 text-red-500"
                : "border-white text-white"
            }`,
          }}
          {...form.getInputProps("username")}
        />
        <div className="flex flex-col gap-2 justify-center items-center w-full">
          <h3 className="text-white text-xl font-semibold text-center leading-none">
            Create a room
          </h3>
          <p className="text-white text-center">
            Paste a YouTube video link below to start
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center active">
            <TextInput
              placeholder="YouTube video link"
              variant="filled"
              classNames={{
                root: "w-full sm:w-1/2",
                input: `!bg-transparent border-1 rounded-md ${
                  form.errors.videoUrl
                    ? "border-red-500 text-red-500"
                    : "border-white text-white"
                }`,
              }}
              {...form.getInputProps("videoUrl")}
            />
            <Button
              variant="white"
              color="black"
              type="submit"
              disabled={
                !!form.errors.videoUrl ||
                !!form.errors.username ||
                !form.values.videoUrl ||
                !form.values.username
              }
              loading={createRoomMutation.isPending}
              classNames={{
                root: "w-full sm:w-auto rounded-md self-start",
                label: "flex gap-1 items-center justify-center",
              }}
            >
              Create
              <IconPlus size={16} stroke={2.5} />
            </Button>
          </div>
        </div>
        {/* <div className="flex flex-col gap-2 justify-center items-center w-full">
          <h3 className="text-white text-xl font-semibold text-center leading-none">
            Or join an existing room
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center">
            <TextInput
              placeholder="Link to existing room"
              type="url"
              classNames={{
                root: "w-full sm:w-1/2",
                input:
                  "!bg-transparent text-white border-white border-1 rounded-md",
              }}
              {...form.getInputProps("existingRoomUrl")}
            />
            <Button
              variant="white"
              color="black"
              type="submit"
              classNames={{
                root: "w-full sm:w-auto rounded-md",
                label: "flex gap-1 items-center justify-center",
              }}
            >
              Join
              <IconArrowRight size={16} stroke={2.5} />
            </Button>
          </div>
        </div> */}
      </form>
    </div>
  );
}
