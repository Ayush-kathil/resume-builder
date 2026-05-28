'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRef } from 'react';
import { ClassicATS } from '../templates/ClassicATS';
import { ModernExecutive } from '../templates/ModernExecutive';
import { TechMinimalist } from '../templates/TechMinimalist';

export function PreviewPane() {
  const { data, selectedTemplate } = useResumeStore();
  const resumeRef = useRef<HTMLDivElement>(null);

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernExecutive data={data} />;
      case 'minimalist':
        return <TechMinimalist data={data} />;
      case 'classic':
      default:
        return <ClassicATS data={data} />;
    }
  };

  return (
    <div className="w-full h-full bg-white/5 backdrop-blur-xl border-l border-white/10 p-8 flex justify-center overflow-y-auto relative print-container">
      {/* Resume Paper (A4) */}
      <div 
        ref={resumeRef}
        id="resume-preview"
        className="w-full max-w-[800px] transition-all duration-300 print:max-w-none print:w-full print:p-0 print:shadow-none print:bg-white"
      >
        {renderTemplate()}
      </div>
    </div>
  );
}
