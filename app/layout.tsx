import type { Metadata } from 'next';
import { Inter, Playfair_Display, Roboto_Mono, Caveat } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });

export const metadata: Metadata = {
  title: 'AI Resume Maker | Handhold Style',
  description: 'Build an ATS-optimized resume in seconds with AI. Styled like Handhold.io.',
};

import { Footer } from '@/components/ui/Footer';
import { SessionProvider } from '@/components/SessionProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${robotoMono.variable} ${caveat.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans relative pb-20">
        <SessionProvider>
          {children}
          <Footer />
          <Toaster toastOptions={{ className: 'glass text-foreground border-border' }} />
        </SessionProvider>
      </body>
    </html>
  );
}
