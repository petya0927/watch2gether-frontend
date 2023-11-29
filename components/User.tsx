import { IconUser, IconCrown } from '@tabler/icons-react';

interface UserComponentProps {
  username: string;
  isOwner: boolean;
}

const User = ({ username, isOwner }: UserComponentProps) => {
  return (
    <div className="flex items-center gap-2">
      {isOwner ? <IconCrown /> : <IconUser />}
      <span>{username}</span>
      {isOwner && <span className="text-base text-gray-400">(owner)</span>}
    </div>
  );
};

export default User;
