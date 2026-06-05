'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.name) {
      const nameParts = session.user.name.split(' ');
      const firstName = nameParts[0] || '';
      const fullText = `hello ${firstName.toLowerCase()}...`;
      let i = 0;
      
      const interval = setInterval(() => {
        setDisplayedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500); // 1.5 seconds pause after typing completes
        }
      }, 120);

      return () => clearInterval(interval);
    } else if (status === 'authenticated' && !session?.user?.name) {
      // Fallback if name is somehow missing
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F1ED] flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center flex items-center justify-center"
      >
        <h1 
          className="text-7xl md:text-9xl text-[#1a1a1a] tracking-tight"
          style={{ fontFamily: 'var(--font-caveat), cursive', fontStyle: 'italic' }}
        >
          {displayedText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block ml-1 font-sans text-5xl md:text-7xl relative -top-2"
          >
            |
          </motion.span>
        </h1>
      </motion.div>
    </div>
  );
}
