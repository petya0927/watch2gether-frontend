"use client";

import Footer from "@/components/Footer";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function App({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        {children}
        <Footer />
      </MantineProvider>
    </QueryClientProvider>
  );
}