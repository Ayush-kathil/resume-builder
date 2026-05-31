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
import { ATSCheckerModal } from '@/components/builder/ATSCheckerModal';
import { ShareModal } from '@/components/builder/ShareModal';
import { SyncModal } from '@/components/builder/SyncModal';
import { useAutoSave } from '@/hooks/useAutoSave';

export default function BuilderPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { data, sanitizeData } = useResumeStore();
  
  // Hook up the enterprise auto-save
  const saveStatus = useAutoSave();

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const element = document.getElementById('resume-preview');
      if (!element) throw new Error("Preview element not found");

      // Dynamically import html2pdf to prevent server-side errors
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;

      const opt: any = {
        margin: 0,
        filename: `${data.personalInfo.fullName || 'Untitled'}_Resume.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'px', format: [elementWidth, elementHeight], orientation: 'portrait' },
        enableLinks: true
      };

      await html2pdf().set(opt).from(element).save();
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
            onClick={() => setIsSyncModalOpen(true)}
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.2 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-white hover:bg-white/5 transition-all backdrop-blur-md"
          >
            <Cloud className="h-4 w-4" />
            Sync Job Board
          </motion.button>
          
          <motion.button 
            onClick={() => setIsShareModalOpen(true)}
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
              onClick={() => {
                sanitizeData();
                setIsExportModalOpen(true);
              }}
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
          <div className="w-full md:w-1/2 h-full z-10">
            <EditorPane />
          </div>
          <div className="hidden md:block md:w-1/2 h-full z-10 shadow-2xl">
            <PreviewPane />
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowMobilePreview(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/40 text-white text-sm font-semibold hover:bg-black/60 transition-all shadow-lg backdrop-blur-xl border border-white/20"
        >
          <FileText className="h-4 w-4" />
          Preview
        </button>
      </div>

      {/* Mobile Slide-Over Preview */}
      <AnimatePresence>
        {showMobilePreview && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed inset-0 z-50 bg-[#09090b] flex flex-col pt-4"
          >
            <div className="px-4 pb-2 flex justify-between items-center border-b border-white/10">
              <h2 className="text-white font-medium">Resume Preview</h2>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PreviewPane />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ATSWidget />

      {/* Modals */}
      <ATSCheckerModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        onExportPDF={handleExportPDF}
      />
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
}
