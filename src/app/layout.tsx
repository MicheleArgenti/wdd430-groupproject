import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Handcrafted Haven - Unique Handmade Treasures',
  description: 'Discover unique, handmade treasures from talented artisans worldwide',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          {/* You can add a Footer here too */}
          <footer className="bg-gray-900 text-white py-8 text-center">
            <div className="container mx-auto px-4">
              <p>© 2024 Handcrafted Haven. All rights reserved.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}