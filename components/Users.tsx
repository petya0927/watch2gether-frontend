import { Room } from '@/app/types';
import User from './User';

interface UsersComponentProps {
  room: Room;
}

const Users = ({ room }: UsersComponentProps) => {
  return (
    <div className="bg-white flex flex-col gap-2 items-start rounded-2xl p-4 w-full shadow-lg">
      <h2 className="font-bold text-xl">Users</h2>

      {room.users.map((user) => (
        <User
          key={user.socketId}
          username={user.username}
          isOwner={user.username === room.owner}
        />
      ))}
    </div>
  );
};

export default Users;
