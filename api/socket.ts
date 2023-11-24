import { Room, User } from '@/app/types';
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
  socket = io('http://localhost:8081', {
    query: {
      id,
      username,
    },
  });

  return socket;
};

const isUserInRoom = ({ user, room }: { user: User; room?: Room }) => {
  return room?.users.find((u: User) => u.username === user.username)
    ? true
    : false;
};

interface EventParams<T> {
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  data: T;
}

export const onRoomDataEvent = ({ setRoom, data }: EventParams<Room>) => {
  setRoom(data);
};

export const onUserJoinedEvent = ({ setRoom, data }: EventParams<User>) => {
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

export const onUserLeftEvent = ({ setRoom, data }: EventParams<User>) => {
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

interface HandlePlayerEventParams {
  playerRef?: MutableRefObject<ReactPlayer | null>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  isPlayingFromSocket: boolean;
  setIsPlayingFromSocket: React.Dispatch<React.SetStateAction<boolean>>;
}

export const handlePlayerPlay = ({
  playerRef,
  setIsPlaying,
  isPlayingFromSocket,
  setIsPlayingFromSocket,
}: HandlePlayerEventParams) => {
  if (!isPlayingFromSocket) {
    console.log('handlePlayerPlay');
    socket.emit('video-play', {
      played: playerRef?.current?.getCurrentTime(),
    });
    setIsPlaying(true);
  } else {
    setIsPlayingFromSocket(false);
  }
};

export const handlePlayerPause = ({
  setIsPlaying,
  isPlayingFromSocket,
  setIsPlayingFromSocket,
}: HandlePlayerEventParams) => {
  if (!isPlayingFromSocket) {
    console.log('handlePlayerPause');
    socket.emit('video-pause');
    setIsPlaying(false);
  } else {
    setIsPlayingFromSocket(false);
  }
};
