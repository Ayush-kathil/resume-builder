import type { Metadata } from 'next';
import { Inter, Playfair_Display, Roboto_Mono, Caveat } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' });

export const metadata: Metadata = {
  title: 'AI Resume Maker | Build ATS-Optimized Resumes with AI',
  description: 'Build an ATS-optimized resume in seconds with AI. Parsed, enhanced, and tailored to any job description automatically.',
  keywords: 'AI resume builder, ATS resume, resume maker, FAANG resume, AI CV builder',
};

import { SessionProvider } from '@/components/SessionProvider';
import { GlobalSettingsWrapper } from '@/components/GlobalSettingsWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SessionGuard } from '@/components/SessionGuard';
import { ConditionalFooter } from '@/components/ui/ConditionalFooter';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Fix Dark Mode FOUC (#4): suppressHydrationWarning + color-scheme:light in CSS prevents the
    // white flash before Next.js hydrates and applies the correct theme class.
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${robotoMono.variable} ${caveat.variable}`} suppressHydrationWarning>
      {/* Remove pb-20 from body — footer is now relative not absolute, so no clearing needed */}
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <SessionProvider>
          {/* Fix Crash #18: SessionGuard listens for session expiry and redirects to /login */}
          <SessionGuard>
            {/* Fix Crash #15 & #5: ErrorBoundary catches all React rendering errors globally */}
            <ErrorBoundary label="RootLayout">
              <GlobalSettingsWrapper>
                {children}
              </GlobalSettingsWrapper>
            </ErrorBoundary>
          </SessionGuard>
          {/* Fix Footer: ConditionalFooter hides footer on /builder and /admin (h-screen pages) */}
          <ConditionalFooter />
          {/* Fix UI #10: limit toasts to avoid infinite stacking */}
          <Toaster
            toastOptions={{ className: 'glass text-foreground border-border' }}
            richColors
            closeButton
            visibleToasts={3}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
