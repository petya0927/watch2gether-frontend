import { Socket, io } from "socket.io-client";

let socket: Socket;

export const initSocket = ({
  id,
  username,
}: {
  id: string;
  username: string;
}) => {
  socket = io("http://localhost:8081", {
    query: {
      id,
      username,
    },
  });

  return socket;
};
