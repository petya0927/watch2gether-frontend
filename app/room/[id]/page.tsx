'use client';
import {
  handlePlaybackRateChange,
  handlePlayerPause,
  handlePlayerPlay,
  initSocket,
  onRoomDataEvent,
  onUserJoinedEvent,
  onUserLeftEvent,
  onVideoPause,
  onVideoPlay,
  onVideoPlaybackRateChange,
} from '@/api/socket';
import { Player, Room, User } from '@/app/types';
import Users from '@/components/Users';
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
      onUserJoinedEvent({ setRoom, data })
    );

    socket.on('user-left', (data: User) => onUserLeftEvent({ setRoom, data }));

    socket.on('video-play', (data) =>
      onVideoPlay({ setPlayer, reactPlayerRef, data })
    );

    socket.on('video-pause', () => onVideoPause({ setPlayer }));

    socket.on('video-playback-rate-change', (data) =>
      onVideoPlaybackRateChange({ setPlayer, data })
    );

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
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-start lg:justify-center h-full w-full">
        <div className="w-screen sm:w-full md:w-2/3 md:max-w-2xl aspect-video -m-4 mb-0 sm:m-0 sm:rounded-2xl sm:overflow-hidden">
          <ReactPlayer
            className="h-full w-full"
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
        <Users room={room} />
      </div>
    )
  );
}
