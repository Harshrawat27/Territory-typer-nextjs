import { Inter } from 'next/font/google';
import './globals.css';
import { GameProvider } from '@/context/GameContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Territory Typer - Multiplayer Geography Typing Game',
  description:
    'Compete to claim territories by typing phrases faster than your opponents!',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
