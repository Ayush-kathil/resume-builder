'use client';

import React, { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Sparkles, GripVertical, Upload, Loader2, Undo2, Redo2 } from 'lucide-react';
import { toast } from 'sonner';

import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';

import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { AICopilotSidebar } from './AICopilot';
import Link from 'next/link';

export function EditorPane() {
  const { data, updatePersonalInfo, setResumeData, setSectionOrder } = useResumeStore();
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          useResumeStore.getState().redo();
          toast.success('Redo');
        } else {
          useResumeStore.getState().undo();
          toast.success('Undo');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        useResumeStore.getState().redo();
        toast.success('Redo');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    toast.loading('AI is ingesting and parsing your resume...', { id: 'parse' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to parse resume');
      }

      setResumeData(result.data);
      toast.success('Resume parsed and structured successfully!', { id: 'parse' });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to parse resume', { id: 'parse' });
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };


  return (
    <div className="relative w-full h-full bg-white border-r border-[#e5e5e5] overflow-hidden font-sans">
      <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar">
        {/* Top Tabs */}
        <div className="flex bg-[#f5f5f5] p-1 rounded-xl mb-6">
          <button className="flex-1 py-1.5 bg-white shadow-sm rounded-lg text-sm font-medium">Builder</button>
          <button className="flex-1 py-1.5 text-gray-500 rounded-lg text-sm font-medium hover:text-gray-700">Templates</button>
        </div>

        {/* Dynamic Reorderable Sections */}
        <Reorder.Group 
          axis="y" 
          values={data.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills']} 
          onReorder={setSectionOrder}
          className="space-y-2"
        >
          {(data.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills']).map((sectionId) => {
            const isActive = useResumeStore.getState().activeAccordion === sectionId;

            const sectionTitles: Record<string, string> = {
              'summary': 'Professional Summary',
              'experience': 'Work Experience',
              'projects': 'Organization Experience',
              'education': 'Education',
              'skills': 'Skills'
            };

            return (
              <Reorder.Item 
                key={sectionId} 
                value={sectionId}
                className="relative bg-white border border-[#e5e5e5] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
              >
                <div 
                  className={`px-4 py-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors ${isActive ? 'border-b border-[#e5e5e5]' : ''}`}
                  onPointerDown={(e) => {
                    // Prevent drag when clicking the toggle itself
                    useResumeStore.getState().setActiveAccordion(isActive ? '' : sectionId);
                  }}
                >
                  <h3 className="text-sm font-semibold text-[#1a1a1a]">
                    {sectionTitles[sectionId] || sectionId}
                  </h3>
                  <span className="text-gray-400 text-lg">{isActive ? '−' : '+'}</span>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="cursor-default"
                      onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when typing
                    >
                      <div className="p-4 bg-[#fcfcfc]">
                        {sectionId === 'summary' && (
                          <div className="flex flex-col gap-3">
                            <textarea
                              className="w-full bg-white border border-[#e5e5e5] rounded-lg p-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-blue-500 transition-all min-h-[120px] resize-y shadow-sm"
                              value={data.personalInfo.summary}
                              onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                              placeholder="Write a brief summary of your professional experience here"
                            />
                            <button 
                              onClick={async () => {
                                toast.loading('Generating summary...', { id: 'summary' });
                                try {
                                  const res = await fetch('/api/ai/summary', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ experience: data.experience, education: data.education })
                                  });
                                  const result = await res.json();
                                  if (!res.ok) throw new Error(result.error);
                                  updatePersonalInfo({ summary: result.summary || result.result });
                                  toast.success('Summary generated!', { id: 'summary' });
                                } catch (e: any) {
                                  toast.error(e.message || 'Failed to generate summary', { id: 'summary' });
                                }
                              }}
                              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                              Add my summary
                            </button>
                          </div>
                        )}
                        {sectionId === 'experience' && <ExperienceEditor />}
                        {sectionId === 'education' && <EducationEditor />}
                        {sectionId === 'skills' && <SkillsEditor />}
                        {sectionId === 'projects' && <ProjectsEditor />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>

      <AICopilotSidebar />
    </div>
  );
}
