'use client';
import ReactPlayer from 'react-player';
import { initSocket } from '@/app/api/sockets';
import { useEffect, useState } from 'react';
import { getUsername } from '@/app/api/user';
import { Room } from '@/app/types';
import { Socket } from 'socket.io-client';

export default function Room({ params }: { params: { id: string } }) {
  let socket: Socket = Socket.prototype;
  const username = getUsername() as string;
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    socket = initSocket({ id: params.id, username });

    socket.on('room-data', (data) => {
      setRoom(data.room);
    });

    return () => {
      socket.disconnect();
    };
  }, [params.id, username]);

  return (
    room && (
      <div>
        <h1>
          Room {room.id} {room.owner}
        </h1>
        <p>users: {room.users}</p>
        {/* <ReactPlayer url={data.room.videoUrl} /> */}
      </div>
    )
  );
}
