'use client';
import {
  initSocket,
  onRoomDataEvent,
  onUserJoinedEvent,
  onUserLeftEvent,
} from '@/api/socket';
import { Room, User } from '@/app/types';
import Users from '@/components/Users';
import VideoPlayer from '@/components/VideoPlayer';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export default function Room({
  params,
}: {
  params: { id: string; username: string };
}) {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const [room, setRoom] = useState<Room>();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socketInstance = initSocket({
      id: params.id,
      username: username as string,
    });

    setSocket(socketInstance);

    socketInstance.on('room-data', (data: Room) =>
      onRoomDataEvent({ setRoom, data })
    );

    socketInstance.on('user-joined', (data: User) =>
      onUserJoinedEvent({ setRoom, data })
    );

    socketInstance.on('user-left', (data: User) =>
      onUserLeftEvent({ setRoom, data })
    );

    return () => {
      socketInstance.off('room-data');
      socketInstance.off('user-joined');
      socketInstance.off('user-left');
      socketInstance.disconnect();
    };
  }, [params.id, username]);

  return (
    room && (
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-start lg:justify-center h-full w-full">
        <VideoPlayer room={room} socket={socket} />
        <Users room={room} />
      </div>
    )
  );
}
