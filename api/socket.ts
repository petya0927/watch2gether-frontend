import { Message, Player, Room, User } from '@/app/types';
import { MutableRefObject } from 'react';
import ReactPlayer from 'react-player';
import { Socket, io } from 'socket.io-client';

let socket: Socket;

export const initSocket = ({
  id,
  username,
}: {
  id: string;
  username: string;
}) => {
  const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';

  if (url === '') {
    throw new Error('Backend url is not defined');
  }

  socket = io(url, {
    query: {
      id,
      username,
    },
  });

  return socket;
};

const isUsernameTaken = ({ user, room }: { user: User; room?: Room }) => {
  return room?.users.find((u: User) => u.username === user.username)
    ? true
    : false;
};

interface RoomEventParams<T> {
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  data: T;
}

export const onRoomDataEvent = ({ setRoom, data }: RoomEventParams<Room>) => {
  setRoom(data);
};

export const onUserJoinedEvent = ({ setRoom, data }: RoomEventParams<User>) => {
  setRoom((prev) => {
    if (prev) {
      if (!isUsernameTaken({ user: data, room: prev })) {
        return {
          ...prev,
          users: [...prev.users, data],
        };
      }
    }

    return prev;
  });
};

export const onUserLeftEvent = ({ setRoom, data }: RoomEventParams<User>) => {
  setRoom((prev) => {
    if (prev) {
      if (isUsernameTaken({ user: data, room: prev })) {
        return {
          ...prev,
          users: prev.users.filter((u) => u.socketId !== data.socketId),
        };
      }
    }

    return prev;
  });
};

interface VideoEventParams {
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  reactPlayerRef?: MutableRefObject<ReactPlayer | null>;
  data?: any;
}

export const onVideoPlay = ({
  setPlayer,
  reactPlayerRef,
  data,
}: VideoEventParams) => {
  setPlayer((prev) => ({
    ...prev,
    isPlaying: true,
    isPlayingFromSocket: true,
  }));
  reactPlayerRef?.current?.seekTo(data.played, 'seconds');
};

export const onVideoPause = ({ setPlayer }: VideoEventParams) => {
  setPlayer((prev) => ({
    ...prev,
    isPlaying: false,
    isPlayingFromSocket: true,
  }));
};

export const onVideoPlaybackRateChange = ({
  setPlayer,
  data,
}: VideoEventParams) => {
  setPlayer((prev) => ({
    ...prev,
    playbackRate: data.playbackRate,
  }));
};

interface HandlePlayerEventParams {
  playerRef?: MutableRefObject<ReactPlayer | null>;
  player?: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  playbackRate?: number;
}

export const handlePlayerPlay = ({
  player,
  setPlayer,
}: HandlePlayerEventParams) => {
  if (!player?.isPlayingFromSocket) {
    const played = player?.reactPlayerRef?.current?.getCurrentTime().toFixed(2);

    socket.emit('video-play', {
      played: played,
    });

    setPlayer((prev) => ({
      ...prev,
      isPlaying: true,
    }));
  } else {
    setPlayer((prev) => ({
      ...prev,
      isPlayingFromSocket: false,
    }));
  }
};

export const handlePlayerPause = ({
  player,
  setPlayer,
}: HandlePlayerEventParams) => {
  if (!player?.isPlayingFromSocket) {
    socket.emit('video-pause');
    setPlayer((prev) => ({
      ...prev,
      isPlaying: false,
    }));
  } else {
    setPlayer((prev) => ({
      ...prev,
      isPlayingFromSocket: false,
    }));
  }
};

export const handlePlaybackRateChange = ({
  player,
  setPlayer,
  playbackRate,
}: HandlePlayerEventParams) => {
  if (player?.playbackRate === playbackRate) return;

  socket.emit('video-playback-rate-change', {
    playbackRate: playbackRate,
  });

  setPlayer((prev) => ({
    ...prev,
    playbackRate: playbackRate || 1,
  }));
};

export const onMessageEvent = ({ setRoom, data }: RoomEventParams<Message>) => {
  setRoom((prev) => {
    if (prev) {
      return {
        ...prev,
        messages: [...prev.messages, data],
      };
    }

    return prev;
  });
};

export const sendMessage = ({ message }: { message: Message }) => {
  socket.emit('message', message);
};
