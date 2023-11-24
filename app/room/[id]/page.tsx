'use client';
import {
  handlePlayerPause,
  handlePlayerPlay,
  initSocket,
  onRoomDataEvent,
  onUserJoinedEvent,
  onUserLeftEvent,
} from '@/api/socket';
import { Room, User } from '@/app/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

export default function Room({
  params,
}: {
  params: { id: string; username: string };
}) {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');

  const [room, setRoom] = useState<Room>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingFromSocket, setIsPlayingFromSocket] =
    useState<boolean>(false);

  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    const socket = initSocket({ id: params.id, username: username as string });

    socket.on('room-data', (data: Room) => onRoomDataEvent({ setRoom, data }));

    socket.on('user-joined', (data: User) =>
      onUserJoinedEvent({ setRoom, data }),
    );

    socket.on('user-left', (data: User) => onUserLeftEvent({ setRoom, data }));

    socket.on('video-play', (data) => {
      console.log('video-play');
      setIsPlayingFromSocket(true);
      setIsPlaying(true);
      playerRef.current?.seekTo(data.played);
    });

    socket.on('video-pause', () => {
      console.log('video-pause');
      setIsPlayingFromSocket(true);
      setIsPlaying(false);
    });

    return () => {
      socket.off('room-data');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('video-play');
      socket.off('video-pause');
      socket.off('video-progress');
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
        <ReactPlayer
          ref={playerRef}
          url={room.videoUrl}
          controls
          playing={isPlaying}
          onPlay={() =>
            handlePlayerPlay({
              playerRef,
              setIsPlaying,
              isPlayingFromSocket,
              setIsPlayingFromSocket,
            })
          }
          onPause={() =>
            handlePlayerPause({
              setIsPlaying,
              isPlayingFromSocket,
              setIsPlayingFromSocket,
            })
          }
        />
      </div>
    )
  );
}
