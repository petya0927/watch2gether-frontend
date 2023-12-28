import {
  handlePlaybackRateChange,
  handlePlayerPause,
  handlePlayerPlay,
  onVideoPause,
  onVideoPlay,
  onVideoPlaybackRateChange,
} from '@/api/socket';
import { Player, Room } from '@/app/types';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Socket } from 'socket.io-client';

interface VideoPlayerComponentProps {
  room: Room;
  socket: Socket | undefined;
}

const VideoPlayer = ({ room, socket }: VideoPlayerComponentProps) => {
  const reactPlayerRef = useRef<ReactPlayer | null>(null);

  const [player, setPlayer] = useState<Player>({
    isPlaying: false,
    isPlayingFromSocket: false,
    playbackRate: 1,
    reactPlayerRef,
  });

  useEffect(() => {
    socket?.on('video-play', (data) =>
      onVideoPlay({ setPlayer, reactPlayerRef, data })
    );

    socket?.on('video-pause', () => onVideoPause({ setPlayer }));

    socket?.on('video-playback-rate-change', (data) =>
      onVideoPlaybackRateChange({ setPlayer, data })
    );

    return () => {
      socket?.off('video-play');
      socket?.off('video-pause');
      socket?.off('video-playback-rate-change');
    };
  }, [socket]);

  return (
    <div className="w-full !aspect-video rounded-2xl overflow-hidden">
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
  );
};

export default VideoPlayer;
