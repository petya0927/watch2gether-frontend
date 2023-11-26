'use client';
import {
  handlePlaybackRateChange,
  handlePlayerPause,
  handlePlayerPlay,
  initSocket,
  onRoomDataEvent,
  onUserJoinedEvent,
  onUserLeftEvent,
} from '@/api/socket';
import { Player, Room, User } from '@/app/types';
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

  const reactPlayerRef = useRef<ReactPlayer | null>(null);

  const [room, setRoom] = useState<Room>();
  const [player, setPlayer] = useState<Player>({
    isPlaying: false,
    isPlayingFromSocket: false,
    playbackRate: 1,
    reactPlayerRef,
  });

  useEffect(() => {
    const socket = initSocket({ id: params.id, username: username as string });

    socket.on('room-data', (data: Room) => onRoomDataEvent({ setRoom, data }));

    socket.on('user-joined', (data: User) =>
      onUserJoinedEvent({ setRoom, data }),
    );

    socket.on('user-left', (data: User) => onUserLeftEvent({ setRoom, data }));

    socket.on('video-play', (data) => {
      console.log('video-play', data);
      setPlayer((prev) => ({
        ...prev,
        isPlaying: true,
        isPlayingFromSocket: true,
      }));
      reactPlayerRef.current?.seekTo(data.played);
    });

    socket.on('video-pause', () => {
      console.log('video-pause');
      setPlayer((prev) => ({
        ...prev,
        isPlaying: false,
        isPlayingFromSocket: true,
      }));
    });

    socket.on('video-playback-rate-change', (data) => {
      console.log('video-playback-rate-change', data);
      setPlayer((prev) => ({
        ...prev,
        playbackRate: data.playbackRate,
      }));
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
          ref={reactPlayerRef}
          url={room.videoUrl}
          controls
          playing={player.isPlaying}
          playbackRate={player.playbackRate}
          onPlay={() =>
            handlePlayerPlay({
              player,
              setPlayer,
            })
          }
          onPause={() =>
            handlePlayerPause({
              player,
              setPlayer,
            })
          }
          onPlaybackRateChange={(playbackRate: number) =>
            handlePlaybackRateChange({
              playbackRate,
              setPlayer,
            })
          }
        />
      </div>
    )
  );
}
