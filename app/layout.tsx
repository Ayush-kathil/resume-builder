import type { Metadata } from 'next';
import { Inter, Merriweather, Roboto_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-merriweather' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' });

export const metadata: Metadata = {
  title: 'AI Resume Maker | Kathil Softwares Limited',
  description: 'Build an ATS-optimized resume in seconds with AI. Created by Ayush Kathil.',
};

import { Footer } from '@/components/ui/Footer';
import { SessionProvider } from '@/components/SessionProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${merriweather.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans relative pb-20">
        <SessionProvider>
          {children}
          <Footer />
          <Toaster theme="dark" toastOptions={{ className: 'glass text-white border-white/10' }} />
        </SessionProvider>
      </body>
    </html>
  );
}
