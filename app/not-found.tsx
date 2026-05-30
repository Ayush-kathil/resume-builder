'use client';

import { AntigravityBackground } from '@/components/ui/AntigravityBackground';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent">
      <AntigravityBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-lg p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-10 mx-4 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white tracking-tight mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white/90 mb-4">Page Not Found</h2>
        
        <p className="text-gray-400 text-base mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl py-3.5 px-8 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/25"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
