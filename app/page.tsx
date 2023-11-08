"use client";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowRight, IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createRoom } from "./api/rooms";
import { getUsername, saveUsername } from "./api/user";

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState(getUsername() || "");

  const createRoomForm = useForm({
    initialValues: {
      username,
      videoUrl: "",
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

  const existingRoomForm = useForm({
    initialValues: {
      username,
      existingRoomUrl: "",
    },
    validate: {
      username: (value) => {
        if (!value) {
          return "Please enter a username";
        }
      },
      existingRoomUrl: (value) => {
        if (!value.includes(window.location.origin)) {
          return "Please enter a valid room link";
        }
      },
    },
  });

  useEffect(() => {
    createRoomForm.setFieldValue("username", username);
    existingRoomForm.setFieldValue("username", username);
  }, [username]);

  const createRoomMutation = useMutation({
    mutationFn: () =>
      createRoom({
        videoUrl: createRoomForm.values.videoUrl,
        owner: createRoomForm.values.username,
      }),
    onSuccess: (data) => {
      saveUsername(createRoomForm.values.username);
      router.push(`/room/${data.id}`);
    },
  });

  const handleJoinRoom = () => {
    saveUsername(existingRoomForm.values.username);
    router.push(existingRoomForm.values.existingRoomUrl);
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center my-auto">
      <h1 className="font-bold text-white text-4xl text-center">
        Welcome to Watch2gether!
      </h1>
      <p className="text-white text-center max-w-xl">
        Watch videos with your friends together from anywhere in real-time.
      </p>
      <TextInput
        placeholder="Choose username"
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
        classNames={{
          root: "w-full sm:w-1/2",
          input: `!bg-transparent border-1 rounded-md ${
            createRoomForm.errors.username
              ? "border-red-500 text-red-500"
              : "border-white text-white"
          }`,
        }}
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
          <div className="flex flex-col sm:flex-row gap-2 w-full items-center justify-center active">
            <TextInput
              placeholder="YouTube video link"
              variant="filled"
              classNames={{
                root: "w-full sm:w-1/2",
                input: `!bg-transparent border-1 rounded-md ${
                  createRoomForm.errors.videoUrl
                    ? "border-red-500 text-red-500"
                    : "border-white text-white"
                }`,
              }}
              {...createRoomForm.getInputProps("videoUrl")}
            />
            <Button
              variant="white"
              color="black"
              type="submit"
              disabled={
                !!createRoomForm.errors.videoUrl ||
                !!createRoomForm.errors.username ||
                !createRoomForm.values.videoUrl ||
                !createRoomForm.values.username
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
              classNames={{
                root: "w-full sm:w-1/2",
                input:
                  "!bg-transparent text-white border-white border-1 rounded-md",
              }}
              {...existingRoomForm.getInputProps("existingRoomUrl")}
            />
            <Button
              variant="white"
              color="black"
              type="submit"
              disabled={
                !!existingRoomForm.errors.existingRoomUrl ||
                !!existingRoomForm.errors.username ||
                !existingRoomForm.values.existingRoomUrl ||
                !existingRoomForm.values.username
              }
              classNames={{
                root: "w-full sm:w-auto rounded-md",
                label: "flex gap-1 items-center justify-center",
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
