'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, FileText } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { SmartSetupModal } from '@/components/modals/SmartSetupModal';

export default function Dashboard() {
  const router = useRouter();
  const { setResumeData } = useResumeStore();
  
  const [setupMode, setSetupMode] = useState<'fresh' | 'upload' | null>(null);

  return (
    <div className="min-h-screen bg-[#F2F1ED] text-[#1a1a1a] p-8 md:p-16 flex flex-col items-center relative font-sans">
      
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
        <Link href="/">
          <button className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">
            Sign out
          </button>
        </Link>
      </nav>

      <div className="max-w-4xl w-full mx-auto space-y-12 relative z-10 flex flex-col items-center flex-1 justify-center pb-20">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <h1 className="text-5xl font-playfair font-medium tracking-tight">Create your resume</h1>
          <p className="text-gray-600 max-w-lg text-lg">
            How would you like to start? Generate a tailored resume from scratch, or let our AI enhance your existing one.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <div onClick={() => setSetupMode('fresh')}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
              className="h-72 rounded-[2rem] border border-[#e5e5e5] bg-white flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
            >
              <div className="h-20 w-20 rounded-full bg-[#f9f9f9] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#1a1a1a] group-hover:text-white text-[#1a1a1a] transition-all duration-300">
                <FileText className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-playfair font-medium text-[#1a1a1a]">Start fresh</h2>
              <p className="text-gray-500 text-sm mt-3 text-center px-8">
                Build from scratch with an AI boilerplate structure
              </p>
            </motion.div>
          </div>

          <div onClick={() => setSetupMode('upload')}>
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
              className="h-72 rounded-[2rem] border border-[#e5e5e5] bg-white flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
            >
              <div className="h-20 w-20 rounded-full bg-[#f9f9f9] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#1a1a1a] group-hover:text-white text-[#1a1a1a] transition-all duration-300">
                <Upload className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-playfair font-medium text-[#1a1a1a]">Use old resume</h2>
              <p className="text-gray-500 text-sm mt-3 text-center px-8">
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

