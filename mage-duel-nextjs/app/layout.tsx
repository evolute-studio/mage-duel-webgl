import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evolute Kingdom: Mage Duel',
  description: 'A WebGL game by EvoluteStudio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 