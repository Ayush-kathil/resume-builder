'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilLine, ScanSearch, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ResumePDFDocument } from '../pdf/ResumePDFDocument';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  { ssr: false }
);

export function PreviewPane() {
  const { data, isEditing, atsViewMode, setAtsViewMode } = useResumeStore();
  const resumeRef = useRef<HTMLDivElement>(null);

  // Simple Density Analyzer
  const calculateDensity = () => {
    const textStr = JSON.stringify(data);
    if (textStr.length < 2000) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    if (textStr.length < 4000) return { label: 'Excellent', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    return { label: 'Overcrowded', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  const density = calculateDensity();

  const renderTemplate = () => {
    return (
      <div className="w-full aspect-[1/1.414]">
        <PDFViewer className="w-full h-full" showToolbar={false}>
          <ResumePDFDocument data={data} />
        </PDFViewer>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white/5 backdrop-blur-xl border-l border-white/10 p-8 flex flex-col items-center overflow-y-auto relative print-container">
      
      {/* Preview Header / Tools */}
      <div className="w-full max-w-[800px] flex justify-between items-center mb-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">Density:</span>
            <span className={`${density.color} ${density.bg} px-1.5 py-0.5 rounded`}>{density.label}</span>
          </div>
        </div>

        <button
          onClick={() => setAtsViewMode(!atsViewMode)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all shadow-lg border ${
            atsViewMode 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-black/40 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
          }`}
        >
          <ScanSearch className="w-4 h-4" />
          {atsViewMode ? 'ATS Heatmap Active' : 'Toggle ATS Heatmap'}
        </button>
      </div>

      {/* Resume Paper (A4) */}
      <div 
        ref={resumeRef}
        id="resume-preview"
        className="w-full max-w-[800px] transition-all duration-300 print:max-w-none print:w-full print:p-0 print:shadow-none print:bg-white relative shadow-2xl"
      >
        {renderTemplate()}

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-sm"
            >
              <motion.div
                animate={{ 
                  x: [0, 20, -20, 15, -15, 0],
                  y: [0, -10, -5, 10, 5, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="bg-purple-600 p-4 rounded-full shadow-2xl shadow-purple-500/50 text-white"
              >
                <PencilLine className="h-8 w-8" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
