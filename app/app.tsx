'use client';

import Footer from '@/components/Footer';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export default function App({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <div className="flex flex-col gap-4 justify-between p-4 md:p-8 md:max-w-[1440px] mx-auto mt-auto h-full">
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          {children}
          <Footer />
        </MantineProvider>
      </QueryClientProvider>
    </div>
  );
}
