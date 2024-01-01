import ReactPlayer from 'react-player';
import { MutableRefObject } from 'react';

export interface AppContextType {
  username: string;
  setUsername: (username: string) => void;
}

export interface Room {
  id: string;
  videoUrl: string;
  owner: string;
  users: User[];
  messages: Message[];
  createdAt?: string;
}

export enum RoomErrors {
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  USERNAME_EMPTY = 'USERNAME_EMPTY',
  ROOM_NOT_FOUND = 'ROOM_NOT_FOUND',
}

export interface User {
  socketId: string;
  username: string;
}

export interface Player {
  isPlaying: boolean;
  isPlayingFromSocket: boolean;
  playbackRate: number;
  reactPlayerRef?: MutableRefObject<ReactPlayer | null>;
}

export interface Message {
  id: string;
  username: string;
  message: string;
  createdAt: string;
}
