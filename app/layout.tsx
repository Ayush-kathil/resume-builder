import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Resume Maker | Kathil Softwares Limited',
  description: 'Build an ATS-optimized resume in seconds with AI. Created by Ayush Kathil.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased font-samsung">
        {children}
        <Toaster theme="dark" toastOptions={{ className: 'glass text-white border-white/10' }} />
      </body>
    </html>
  );
}
