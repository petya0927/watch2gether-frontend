'use client';
import {
  initSocket,
  onRoomDataEvent,
  onUserJoinedEvent,
  onUserLeftEvent,
} from '@/api/socket';
import { Room, RoomErrors, User } from '@/app/types';
import RoomLink from '@/components/RoomLink';
import UsernameErrorComponent from '@/components/UsernameErrorComponent';
import Users from '@/components/Users';
import VideoPlayer from '@/components/VideoPlayer';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { isRoomExists } from '@/api/rooms';
import { Button } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

export default function Room({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();

  const [username, setUsername] = useState<string | null>(
    searchParams.get('username')
  );
  const [room, setRoom] = useState<Room>();
  const [roomError, setRoomError] = useState<RoomErrors | null>(null);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const checkRoomExists = async () => {
      const roomExists = await isRoomExists(params.id);
      if (!roomExists) {
        setRoomError(RoomErrors.ROOM_NOT_FOUND);

        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 5000);
      }
    };

    checkRoomExists();
  }, [params.id]);

  useEffect(() => {
    if (!username) {
      setRoomError(RoomErrors.USERNAME_EMPTY);
      return;
    } else {
      setRoomError(null);
    }

    const socketInstance = initSocket({
      id: params.id,
      username: username as string,
    });

    setSocket(socketInstance);
    setRoomError(null);

    socketInstance.on('username-taken', () => {
      setRoomError(RoomErrors.USERNAME_TAKEN);
    });

    socketInstance.on('room-data', (data: Room) =>
      onRoomDataEvent({ setRoom, data })
    );

    socketInstance.on('user-joined', (data: User) => {
      onUserJoinedEvent({ setRoom, data });
      console.log('user joined', data);
    });

    socketInstance.on('user-left', (data: User) => {
      onUserLeftEvent({ setRoom, data });
      console.log('user left', data);
    });

    return () => {
      socketInstance.off('room-data');
      socketInstance.off('user-joined');
      socketInstance.off('user-left');
      socketInstance.disconnect();
    };
  }, [params.id, username]);

  return (
    <>
      {room && !roomError && username && (
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-start lg:justify-center h-full w-full">
          <VideoPlayer room={room} socket={socket} />

          <div className="flex flex-col gap-8 items-center justify-start lg:justify-center w-full md:w-1/2 lg:w-1/4">
            <Users room={room} />
            <RoomLink roomLink={window.location.href} />
          </div>
        </div>
      )}
      {roomError &&
        (roomError === RoomErrors.USERNAME_EMPTY ||
          roomError === RoomErrors.USERNAME_TAKEN) && (
          <UsernameErrorComponent
            roomId={params.id}
            setUsername={setUsername}
            roomError={roomError}
          />
        )}
      {roomError === RoomErrors.ROOM_NOT_FOUND && (
        <div className="flex flex-col gap-8 items-center justify-center h-full w-full">
          <h1 className="font-bold text-white text-4xl text-center">
            Welcome to Watch2gether!
          </h1>
          <p className="text-white text-center max-w-md">
            The room you are trying to join does not exist. If you think this is
            a mistake, please contact the room owner.
          </p>
          <p className="text-white text-center max-w-md">
            You will be redirected to home page in 5 seconds.
          </p>
          <Button
            onClick={() => {
              window.location.href = '/';
            }}
            classNames={{
              root: '!bg-white !text-black',
              label: 'flex items-center gap-2',
            }}
          >
            <IconArrowLeft size={20} />
            Go to home page
          </Button>
        </div>
      )}
    </>
  );
}
