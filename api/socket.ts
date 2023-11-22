import { Room, User } from '@/app/types';
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

export const onRoomData = ({
  setRoom,
  data,
}: {
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  data: Room;
}) => {
  setRoom(data);
};

export const onUserJoined = ({
  setRoom,
  data,
}: {
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  data: User;
}) => {
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

export const onUserLeft = ({
  setRoom,
  data,
}: {
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  data: User;
}) => {
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
