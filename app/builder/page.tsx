'use client';

import { EditorPane } from '@/components/builder/EditorPane';
import { PreviewPane } from '@/components/builder/PreviewPane';
import { Download, Share2, Sparkles, ArrowLeft, FileText, Cloud, Loader2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { exportDocx } from '@/lib/exportDocx';
import { AIChatbot } from '@/components/builder/AIChatbot';
import { ATSCheckerModal } from '@/components/builder/ATSCheckerModal';
import { ShareModal } from '@/components/builder/ShareModal';
import { SyncModal } from '@/components/builder/SyncModal';
import { useAutoSave } from '@/hooks/useAutoSave';
import { CommandPalette } from '@/components/ui/CommandPalette';

export default function BuilderPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { data, sanitizeData } = useResumeStore();
  
  // Hook up the enterprise auto-save
  const saveStatus = useAutoSave();


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

  return (
    <div className="h-screen w-full flex flex-col bg-[#F2F1ED] text-[#1a1a1a] overflow-hidden relative font-sans">
      
      {/* Top Navbar */}
      <header className="h-16 flex-shrink-0 border-b border-[#e5e5e5] bg-white px-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-[#1a1a1a] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-playfair font-medium flex items-center gap-2">
            resume maker
          </h1>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-[#F2F1ED] px-3 py-1 rounded-full border border-[#e5e5e5]">
            <span>Kathil Softwares</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Auto-Save Indicator */}
          <div className="hidden md:flex items-center justify-center min-w-[100px] h-9 px-3 rounded-full bg-[#f9f9f9] border border-[#e5e5e5]">
            <AnimatePresence mode="wait">
              {saveStatus === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-600"
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
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600"
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
                  className="flex items-center gap-1.5 text-xs font-medium text-red-600"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Error</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsSyncModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[#e5e5e5] text-sm font-medium text-gray-600 hover:text-[#1a1a1a] hover:bg-[#F2F1ED] transition-all"
          >
            <Cloud className="h-4 w-4" />
            Sync Job Board
          </button>
          
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e5e5e5] text-sm font-medium text-gray-600 hover:text-[#1a1a1a] hover:bg-[#F2F1ED] transition-all"
          >
            <Share2 className="h-4 w-4" />
            Share Link
          </button>
          
          <button 
            onClick={() => {
              sanitizeData();
              setIsExportModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#1a1a1a] text-[#F2F1ED] text-sm font-medium hover:bg-black transition-all"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Editor & Preview container */}
        <div className="flex-1 flex overflow-hidden relative">
          <div className="w-full md:w-1/2 h-full z-10 bg-white">
            <EditorPane />
          </div>
          <div className="hidden md:block md:w-1/2 h-full z-10 bg-[#F2F1ED]">
            <PreviewPane />
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowMobilePreview(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1a1a1a] text-white text-sm font-medium hover:bg-black transition-all shadow-lg"
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
            className="md:hidden fixed inset-0 z-50 bg-[#F2F1ED] flex flex-col pt-4"
          >
            <div className="px-4 pb-2 flex justify-between items-center border-b border-[#e5e5e5]">
              <h2 className="text-[#1a1a1a] font-medium font-playfair">Resume Preview</h2>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-2 bg-white rounded-full text-gray-500 hover:text-[#1a1a1a] transition-colors border border-[#e5e5e5]"
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
      
      <AIChatbot />
      <CommandPalette />

      {/* Modals */}
      <ATSCheckerModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
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
