import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const RoomNotFound = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (counter === 0) {
      router.push('/');
    }
  }, [counter]);

  return (
    <div className="h-full w-full flex flex-col gap-8 items-center justify-center">
      <h1 className="font-bold text-white text-4xl text-center">
        Welcome to Watch2gether!
      </h1>
      <p className="text-white text-center max-w-md">
        The room you are trying to join does not exist. If you think this is a
        mistake, please contact the room owner.
      </p>
      <p className="text-white text-center max-w-md">
        You will be redirected to home page in {counter} seconds.
      </p>
      <Button
        onClick={() => {
          router.push('/');
        }}
        classNames={{
          root: '!bg-white !text-black',
          label: 'flex items-center gap-2',
        }}
      >
        <IconArrowLeft size={20} />
        Go to home page
      </Button>
    </div>
  );
};

export default RoomNotFound;
