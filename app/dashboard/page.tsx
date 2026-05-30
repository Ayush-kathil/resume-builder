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
  
  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState('Extracting text...');
  const [targetRole, setTargetRole] = useState('');
  const [showFreshModal, setShowFreshModal] = useState(false);
  const [freshRole, setFreshRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.docx')) {
      toast.error('Invalid file type. Please upload a PDF or DOCX.');
      return;
    }

    setIsUploading(true);
    setLoadingText('Extracting text...');

    const formData = new FormData();
    formData.append('file', file);
    if (targetRole.trim()) {
      formData.append('targetRole', targetRole.trim());
    }

    try {
      // Simulate phases for UI feel
      setTimeout(() => setLoadingText('Analyzing experience...'), 2000);
      setTimeout(() => setLoadingText('Formatting to FAANG standards...'), 4500);

      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      setResumeData(data);
      toast.success('Resume parsed successfully!');
      router.push('/builder');

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An unexpected error occurred during parsing.');
      setIsUploading(false);
    }
  };

  // Fresh resume generation is now handled inside SmartSetupModal

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-16 relative">
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <Loading3D />
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl font-medium text-white tracking-wide"
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <Link href="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to Home
            </motion.button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => setShowFreshModal(true)}>
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.05)" }}
              className="h-64 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white text-white group-hover:text-black transition-all">
                <FileText className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-medium text-white z-10">Start Fresh Resume</h2>
              <p className="text-gray-400 text-sm mt-2 z-10">Build from scratch with AI boilerplate</p>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div
              whileHover={{ y: -8, boxShadow: "0 20px 40px -10px rgba(255,255,255,0.05)" }}
              className="h-64 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden"
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                accept=".pdf,.docx" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white text-white group-hover:text-black transition-all">
                <Upload className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-medium text-white text-center px-4">Use Old Resume</h2>
              <p className="text-gray-400 text-sm mt-2 text-center px-4">Let AI parse and improve it</p>
            </motion.div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Target Role (Optional)</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-gray-600"
                placeholder="e.g. Software Engineer, Insurance Agent"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={isUploading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-500 font-medium tracking-wide z-10">
        Powered by <span className="text-white/80">Kathil Softwares Limited</span> • Created by <span className="text-white/80">Ayush Kathil</span>
      </div>

      {/* Fresh Resume Modal */}
      <SmartSetupModal 
        isOpen={showFreshModal} 
        onClose={() => setShowFreshModal(false)} 
      />
    </div>
  );
}

