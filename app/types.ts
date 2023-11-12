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

export interface User {
  socketId: string;
  username: string;
}
