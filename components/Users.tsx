import { Room } from '@/app/types';
import User from './User';

interface UsersComponentProps {
  room: Room;
}

const Users = ({ room }: UsersComponentProps) => {
  const usersWithoutOwner = room.users.filter(
    (user) => user.username !== room.owner
  );

  return (
    <div className="bg-white flex flex-col gap-2 items-start rounded-2xl p-4 w-full shadow-lg">
      <h2 className="font-bold text-xl">Users</h2>
      <User username={room.owner} isOwner />

      {usersWithoutOwner.map((user) => (
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
