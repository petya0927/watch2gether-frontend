'use client';
import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Button
        classNames={{
          root: '!bg-white !text-black rounded-md self-start',
          label: 'flex gap-1 items-center justify-center',
        }}
        onClick={() => router.push('/')}
      >
        <IconArrowLeft size={16} stroke={2.5} />
        Back
      </Button>
      {children}
    </div>
  );
};

export default Layout;
