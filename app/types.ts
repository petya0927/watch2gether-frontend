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
  createdAt?: string;
}

export enum RoomErrors {
  USERNAME_TAKEN = 'USERNAME_TAKEN',
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
