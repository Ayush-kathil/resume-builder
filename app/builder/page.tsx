'use client';

import { EditorPane } from '@/components/builder/EditorPane';
import { PreviewPane } from '@/components/builder/PreviewPane';
import { Download, Share2, Sparkles, ArrowLeft, FileText, Cloud, Loader2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
// import { exportDocx } from '@/lib/exportDocx';
import { AIChatbot } from '@/components/builder/AIChatbot';
import { ShareModal } from '@/components/builder/ShareModal';
import { SyncModal } from '@/components/builder/SyncModal';
import { useAutoSave } from '@/hooks/useAutoSave';
import { CommandPalette } from '@/components/ui/CommandPalette';
import dynamic from 'next/dynamic';

const PdfExportButton = dynamic(() => import('@/components/builder/PdfExportButton'), {
  ssr: false,
});

import { RightSidebar } from '@/components/builder/RightSidebar';

export default function BuilderPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const { data, sanitizeData } = useResumeStore();
  
  // Hook up the enterprise auto-save
  const saveStatus = useAutoSave();

  return (
    <div className="h-screen w-full flex flex-col bg-[#F2F1ED] text-[#1a1a1a] overflow-hidden relative font-sans">
      
      {/* Top Navbar */}
      <header className="h-16 flex-shrink-0 border-b border-[#e5e5e5] bg-white px-6 flex items-center justify-between z-10 relative shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-[#1a1a1a] transition-colors bg-[#f9f9f9] p-2 rounded-full border border-[#e5e5e5]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">T</div>
             <h1 className="text-sm font-semibold">Talently Resume</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-Save Indicator */}
          <div className="hidden md:flex items-center justify-center min-w-[100px] h-9 px-3">
            <AnimatePresence mode="wait">
              {saveStatus === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500"
                >
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Saved 1m ago...</span>
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
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsSyncModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[#e5e5e5] bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            Analyze
          </button>
          
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          
          <PdfExportButton data={data} />
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Editor & Preview container */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Column: Editor (Accordion) */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full md:w-[320px] h-full z-10 bg-[#f9f9f9] border-r border-[#e5e5e5] shadow-sm flex-shrink-0"
          >
            <EditorPane />
          </motion.div>

          {/* Middle Column: Preview Canvas */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="hidden md:flex flex-1 h-full z-0 bg-[#F2F1ED] flex-col overflow-hidden"
          >
            <PreviewPane />
          </motion.div>

          {/* Right Column: Settings & Insights */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="hidden md:block w-[280px] h-full z-10 bg-[#f9f9f9] border-l border-[#e5e5e5] shadow-sm flex-shrink-0"
          >
            <RightSidebar />
          </motion.div>

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
