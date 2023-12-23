import { ActionIcon, CopyButton, TextInput, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

const RoomLink = ({ roomLink }: { roomLink: string }) => {
  const url = new URL(roomLink);
  url.searchParams.delete('username');

  return (
    <div className="bg-white flex flex-col gap-2 items-start rounded-2xl p-4 w-full shadow-lg">
      <h2 className="font-bold text-xl">Share</h2>
      <TextInput
        value={url.href}
        className="w-full"
        readOnly
        rightSection={
          <CopyButton value={url.href} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? 'Copied!' : 'Copy'}
                withArrow
                position="top"
                classNames={{ tooltip: copied ? 'bg-green-500' : '' }}
              >
                <ActionIcon
                  color={copied ? 'green' : 'gray'}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        }
      />
    </div>
  );
};

export default RoomLink;
