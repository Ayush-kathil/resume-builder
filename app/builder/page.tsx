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
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { CommandPalette } from '@/components/ui/CommandPalette';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const PdfExportButton = dynamic(() => import('@/components/builder/PdfExportButton'), {
  ssr: false,
});

import { RightSidebar } from '@/components/builder/RightSidebar';

export default function BuilderPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState<'edit' | 'preview' | 'style'>('edit');
  const { data, sanitizeData } = useResumeStore();
  
  // Hook up the enterprise auto-save
  const saveStatus = useAutoSave();
  
  // Hook up time-travel debugging (Undo/Redo) via keyboard
  useKeyboardShortcuts();
  
  // Pull undo/redo functions for UI buttons
  const { undo, redo, past, future } = useResumeStore();

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-hidden relative font-sans selection:bg-black selection:text-white">
      
      {/* Top Navbar */}
      <header className="h-16 flex-shrink-0 border-b border-[#e5e5e5] bg-white px-4 md:px-6 flex items-center justify-between z-10 relative shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-[#1a1a1a] transition-colors bg-[#f9f9f9] p-2 rounded-full border border-[#e5e5e5]" title="Dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link href="/profile" className="text-gray-500 hover:text-[#1a1a1a] transition-colors bg-[#f9f9f9] p-2 rounded-full border border-[#e5e5e5]" title="Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
          <div className="hidden md:flex items-center gap-2">
             <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">T</div>
             <h1 className="text-sm font-semibold">Talently Resume</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
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
          
          <div className="flex items-center gap-1 md:gap-2 mr-2 border-r border-gray-200 pr-2">
            <button
              onClick={undo}
              disabled={past.length === 0}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button
              onClick={redo}
              disabled={future.length === 0}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
            </button>
          </div>

          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <div className="min-w-[130px] flex justify-end">
            <PdfExportButton data={data} />
          </div>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 flex overflow-hidden mb-14 md:mb-0">
        {/* Document Editor & Preview container */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Column: Editor (Accordion) */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`${showMobilePreview === 'edit' || !showMobilePreview ? 'flex' : 'hidden'} md:flex w-full md:w-[320px] h-full z-10 bg-[#f9f9f9] border-r border-[#e5e5e5] shadow-sm flex-shrink-0 flex-col`}
          >
            <ErrorBoundary label="EditorPane">
              <EditorPane />
            </ErrorBoundary>
          </motion.div>

          {/* Middle Column: Preview Canvas */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className={`${showMobilePreview === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 h-full z-0 bg-[#F2F1ED] flex-col overflow-hidden`}
          >
            <ErrorBoundary label="PreviewPane">
              <PreviewPane />
            </ErrorBoundary>
          </motion.div>

          {/* Right Column: Settings & Insights */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className={`${showMobilePreview === 'style' ? 'flex' : 'hidden'} md:flex w-full md:w-[280px] h-full z-10 bg-[#f9f9f9] border-l border-[#e5e5e5] shadow-sm flex-shrink-0 flex-col`}
          >
            <ErrorBoundary label="RightSidebar">
              <RightSidebar />
            </ErrorBoundary>
          </motion.div>

        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-[#e5e5e5] z-50 flex items-center justify-around px-2 pb-safe">
        <button
          onClick={() => setShowMobilePreview('edit')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${(!showMobilePreview || showMobilePreview === 'edit') ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          <span className="text-[10px] font-medium">Edit</span>
        </button>
        <button
          onClick={() => setShowMobilePreview('preview')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${showMobilePreview === 'preview' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-[10px] font-medium">Preview</span>
        </button>
        <button
          onClick={() => setShowMobilePreview('style')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${showMobilePreview === 'style' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px] font-medium">Style</span>
        </button>
      </div>
      
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
