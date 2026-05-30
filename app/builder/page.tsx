'use client';

import { EditorPane } from '@/components/builder/EditorPane';
import { PreviewPane } from '@/components/builder/PreviewPane';
import { AntigravityBackground } from '@/components/ui/AntigravityBackground';
import { Download, Share2, Sparkles, ArrowLeft, FileText, FileDown, X, Cloud, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { exportDocx } from '@/lib/exportDocx';
import { ATSWidget } from '@/components/ui/ATSWidget';
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from '@/components/pdf/ResumePDFDocument';
import { useAutoSave } from '@/hooks/useAutoSave';

export default function BuilderPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { data } = useResumeStore();
  
  // Hook up the enterprise auto-save
  const saveStatus = useAutoSave();

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const blob = await pdf(<ResumePDFDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.personalInfo.fullName || 'Untitled'}_Resume.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExportModalOpen(false);
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportDocx(data);
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Failed to export DOCX:", error);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  };

  return (
    <div className="h-screen w-full flex flex-col bg-transparent overflow-hidden relative">
      <AntigravityBackground />
      
      {/* Top Navbar */}
      <header className="h-16 flex-shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-md px-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-medium text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gray-400" />
            AI Resume Maker
          </h1>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span>Kathil Softwares Limited</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Auto-Save Indicator */}
          <div className="hidden md:flex items-center justify-center min-w-[100px] h-9 px-3 rounded-full bg-black/20 border border-white/5 backdrop-blur-md">
            <AnimatePresence mode="wait">
              {saveStatus === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-400"
                >
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Saved</span>
                </motion.div>
              )}
              {saveStatus === 'saving' && (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-400"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </motion.div>
              )}
              {saveStatus === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-400"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Error</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button 
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-all backdrop-blur-md"
          >
            <Share2 className="h-4 w-4" />
            Share Link
          </motion.button>
          
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 backdrop-blur-md border border-white/10"
            >
              <Download className="h-4 w-4" />
              Export Resume
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Editor & Preview container */}
        <div className="flex-1 flex overflow-hidden relative">
          <div className="w-1/2 h-full z-10">
            <EditorPane />
          </div>
          <div className="w-1/2 h-full z-10 shadow-2xl">
            <PreviewPane />
          </div>
        </div>
      </div>
      
      <ATSWidget />

      {/* Antigravity Export Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Glassmorphic Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsExportModalOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={springTransition}
              className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/10"
            >
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Export Your Resume</h2>
                <p className="text-gray-400">Choose the format that best fits your application needs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PDF Card */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springTransition}
                  onClick={handleExportPDF}
                  disabled={isExportingPDF}
                  className="flex flex-col items-center p-8 bg-black/40 border border-white/10 rounded-2xl hover:bg-white/5 hover:border-purple-500/50 transition-colors group text-left w-full h-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="h-16 w-16 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">PDF Document</h3>
                  <p className="text-sm text-gray-400 text-center leading-relaxed">
                    Best for sharing & printing. High-quality vector text.
                  </p>
                  
                  {isExportingPDF && (
                    <div className="mt-4 text-xs font-medium text-red-400 animate-pulse">
                      Generating Vector PDF...
                    </div>
                  )}
                </motion.button>

                {/* Word Card */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springTransition}
                  onClick={handleExportDocx}
                  disabled={isExportingDocx}
                  className="flex flex-col items-center p-8 bg-black/40 border border-white/10 rounded-2xl hover:bg-white/5 hover:border-blue-500/50 transition-colors group text-left w-full h-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="h-16 w-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileDown className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Word Document (.docx)</h3>
                  <p className="text-sm text-gray-400 text-center leading-relaxed">
                    Best for ATS systems & manual editing.
                  </p>
                  
                  {isExportingDocx && (
                    <div className="mt-4 text-xs font-medium text-blue-400 animate-pulse">
                      Compiling document...
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
