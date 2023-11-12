'use client';
import ReactPlayer from 'react-player';
import { initSocket } from '@/api/socket';
import { useEffect, useState } from 'react';
import { Room, User } from '@/app/types';
import { useSearchParams } from 'next/navigation';

export default function Room({
  params,
}: {
  params: { id: string; username: string };
}) {
  const searchParams = useSearchParams();

  const [room, setRoom] = useState<Room>();
  const username = searchParams.get('username');

  useEffect(() => {
    const isUserInRoom = ({ user, room }: { user: User; room?: Room }) => {
      console.log('isUserInRoom', user, room);
      return room?.users.find((u: User) => u.username === user.username)
        ? true
        : false;
    };

    const onRoomData = (data: Room) => {
      setRoom(data);
    };

    const onUserJoined = (data: User) => {
      setRoom((prev) => {
        if (prev) {
          if (!isUserInRoom({ user: data, room: prev })) {
            return {
              ...prev,
              users: [...prev.users, data],
            };
          }
        }

        return prev;
      });
    };

    const onUserLeft = (data: User) => {
      setRoom((prev) => {
        if (prev) {
          if (isUserInRoom({ user: data, room: prev })) {
            return {
              ...prev,
              users: prev.users.filter((u) => u.username !== data.username),
            };
          }
        }

        return prev;
      });
    };

    if (!params.id || !username) {
      return;
    }

    const socket = initSocket({ id: params.id, username: username as string });

    socket.on('room-data', onRoomData);

    socket.on('user-joined', onUserJoined);

    socket.on('user-left', onUserLeft);

    return () => {
      socket.disconnect();
    };
  }, [params.id, username]);

  return (
    room && (
      <div className="bg-white text-black">
        <h1>
          Room {room.id} {room.owner}
        </h1>
        <p>
          users:{' '}
          {room.users
            .map((user) => `${user.username}: ${user.socketId}`)
            .join(', ')}
        </p>
        {/* <ReactPlayer url={data.room.videoUrl} /> */}
      </div>
    )
  );
}
