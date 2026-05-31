'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilLine } from 'lucide-react';
import { FaangTemplate } from '../templates/FaangTemplate';

export function PreviewPane() {
  const { data, isEditing } = useResumeStore();
  const resumeRef = useRef<HTMLDivElement>(null);

  const renderTemplate = () => {
    return <FaangTemplate data={data} />;
  };

  return (
    <div className="w-full h-full bg-white/5 backdrop-blur-xl border-l border-white/10 p-8 flex justify-center overflow-y-auto relative print-container">
      {/* Resume Paper (A4) */}
      <div 
        ref={resumeRef}
        id="resume-preview"
        className="w-full max-w-[800px] transition-all duration-300 print:max-w-none print:w-full print:p-0 print:shadow-none print:bg-white relative"
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
