'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Upload, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useResumeStore } from '@/store/resumeStore';
import { SmartSetupModal } from '@/components/modals/SmartSetupModal';
import { Loading3D } from '@/components/ui/Loading3D';

export default function Dashboard() {
  const router = useRouter();
  const { setResumeData } = useResumeStore();
  
  const [setupMode, setSetupMode] = useState<'fresh' | 'upload' | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-16 flex flex-col items-center justify-center relative">
      
      <div className="max-w-4xl w-full mx-auto space-y-12 relative z-10 flex flex-col items-center">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">Create Your Resume</h1>
          <p className="text-gray-400 max-w-lg">How would you like to start? Generate a tailored resume from scratch, or let our AI enhance your existing one.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <div onClick={() => setSetupMode('fresh')}>
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.05)" }}
              className="h-72 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white text-white group-hover:text-black transition-all">
                <FileText className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-semibold text-white z-10">Start Fresh</h2>
              <p className="text-gray-400 text-sm mt-3 z-10 text-center px-6">Build from scratch with AI boilerplate</p>
            </motion.div>
          </div>

          <div onClick={() => setSetupMode('upload')}>
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.05)" }}
              className="h-72 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white text-white group-hover:text-black transition-all">
                <Upload className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-semibold text-white z-10">Use Old Resume</h2>
              <p className="text-gray-400 text-sm mt-3 z-10 text-center px-6">Let AI parse and drastically improve it</p>
            </motion.div>
          </div>
        </div>
        
        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-2 rounded-full border border-white/10 text-sm text-gray-400 hover:text-white transition-colors backdrop-blur-md"
          >
            Back to Home
          </motion.button>
        </Link>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 w-full text-center text-xs text-gray-500 font-medium tracking-wide z-10">
        Powered by <span className="text-white/80">Kathil Softwares Limited</span> • Created by <span className="text-white/80">Ayush Kathil</span>
      </div>

      {/* Unified Resume Modal */}
      <SmartSetupModal 
        isOpen={setupMode !== null} 
        mode={setupMode}
        onClose={() => setSetupMode(null)} 
      />
    </div>
  );
}

