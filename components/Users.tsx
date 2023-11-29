import { Room } from '@/app/types';
import User from './User';

interface UsersProps {
  room: Room;
}

const Users = ({ room }: UsersProps) => {
  const usersWithoutOwner = room.users.filter(
    (user) => user.username !== room.owner
  );

  return (
    <div className="bg-white flex flex-col gap-4 items-start rounded-2xl p-4 w-full md:w-1/3 lg:w-1/4 shadow-lg">
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
