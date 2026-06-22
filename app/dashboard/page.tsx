'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { SmartSetupModal } from '@/components/modals/SmartSetupModal';

export default function Dashboard() {
  const router = useRouter();
  const { setResumeData } = useResumeStore();
  
  const [setupMode, setSetupMode] = useState<'fresh' | 'upload' | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16 flex flex-col items-center relative font-sans selection:bg-black selection:text-white">
      
      {/* Top Nav (Minimal) */}
      <nav className="w-full flex justify-between items-center max-w-5xl mx-auto mb-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex gap-[2px]">
            <div className="w-1.5 h-4 bg-[#1a1a1a] rounded-full"></div>
            <div className="w-1.5 h-6 bg-[#1a1a1a] rounded-full translate-y-[-4px]"></div>
            <div className="w-1.5 h-4 bg-[#1a1a1a] rounded-full"></div>
          </div>
          <span className="font-playfair text-xl tracking-tight font-medium">resume maker</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/profile">
            <button className="text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </button>
          </Link>
          <Link href="/">
            <button className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
              Sign out
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl w-full mx-auto space-y-16 relative z-10 flex flex-col items-center flex-1 justify-center pb-20">
        <header className="flex flex-col items-center text-center space-y-5 mb-4">
          <h1 className="text-5xl md:text-6xl font-playfair font-semibold tracking-tight text-gray-900">Create your resume</h1>
          <p className="text-gray-500 max-w-lg text-lg font-medium">
            How would you like to start? Generate a tailored resume from scratch, or let our AI enhance your existing one.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div onClick={() => setSetupMode('fresh')} className="group relative cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 rounded-[2rem] translate-y-2 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <motion.div
              whileHover={{ y: -4 }}
              className="relative h-72 rounded-[2rem] border border-gray-200 bg-white flex flex-col items-center justify-center transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 border border-gray-100 group-hover:scale-110 group-hover:bg-black group-hover:text-white text-gray-700 transition-all duration-500 shadow-sm">
                <FileText className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-900">Start fresh</h2>
              <p className="text-gray-500 text-sm mt-3 text-center px-10 font-medium">
                Build from scratch with an AI boilerplate structure
              </p>
            </motion.div>
          </div>

          <div onClick={() => setSetupMode('upload')} className="group relative cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 rounded-[2rem] translate-y-2 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <motion.div
              whileHover={{ y: -4 }}
              className="relative h-72 rounded-[2rem] border border-gray-200 bg-white flex flex-col items-center justify-center transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 border border-gray-100 group-hover:scale-110 group-hover:bg-black group-hover:text-white text-gray-700 transition-all duration-500 shadow-sm">
                <Upload className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-playfair font-semibold text-gray-900">Use old resume</h2>
              <p className="text-gray-500 text-sm mt-3 text-center px-10 font-medium">
                Let AI parse and drastically improve your existing CV
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <SmartSetupModal 
        isOpen={setupMode !== null} 
        mode={setupMode}
        onClose={() => setSetupMode(null)} 
      />
    </div>
  );
}

