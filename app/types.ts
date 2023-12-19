import ReactPlayer from 'react-player';
import { MutableRefObject } from 'react';
import { UseFormReturnType } from '@mantine/form';

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

export type FormRef<T> = UseFormReturnType<T, (values: T) => T>;

export interface ExistingRoomFormValues {
  username: string;
  url: string;
}

export interface CreateRoomFormValues {
  username: string;
  videoUrl: string;
}

export type ExistingRoomFormRef = FormRef<ExistingRoomFormValues>;

export type CreateRoomFormRef = FormRef<CreateRoomFormValues>;
