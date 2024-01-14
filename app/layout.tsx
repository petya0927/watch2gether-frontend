import { ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import App from './app';
import './globals.css';

export const metadata: Metadata = {
  title: 'Watch2gether',
  description:
    'Watch2gether offers a unique platform for real-time video sharing, enabling you to watch videos with your friends from anywhere. Synchronize your screens and immerse yourselves in a shared viewing experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="bg-gradient-to-br from-red-900 to-purple-950 bg-no-repeat bg-fixed">
        <App>{children}</App>
      </body>
    </html>
  );
}
