'use client';
import ReactPlayer from 'react-player';
import { initSocket, onRoomData, onUserJoined, onUserLeft } from '@/api/socket';
import { useEffect, useState } from 'react';
import { Room, User } from '@/app/types';
import { useSearchParams } from 'next/navigation';

export default function Room({
  params,
}: {
  params: { id: string; username: string };
}) {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    const socket = initSocket({ id: params.id, username: username as string });

    socket.on('room-data', (data: Room) => onRoomData({ setRoom, data }));

    socket.on('user-joined', (data: User) => onUserJoined({ setRoom, data }));

    socket.on('user-left', (data: User) => onUserLeft({ setRoom, data }));

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
        <ReactPlayer url={room.videoUrl} controls pip />
      </div>
    )
  );
}
