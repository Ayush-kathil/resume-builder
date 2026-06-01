'use client';

import React, { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Sparkles, GripVertical, Upload, Loader2 } from 'lucide-react';
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
      <div className="w-full h-full p-6 overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-medium text-[#1a1a1a]">Editor</h2>
        <div className="flex items-center gap-2">
          <select
            value={useResumeStore.getState().careerGrade}
            onChange={(e) => {
              const grade = e.target.value as 'Fresher' | 'Intermediate' | 'Senior' | 'Super Senior';
              useResumeStore.getState().setCareerGrade(grade);
              if (grade === 'Fresher') {
                useResumeStore.getState().setSectionOrder(['skills', 'education', 'experience', 'projects']);
                toast.success('Applied Skill-Over-History Flip for Fresher Grade');
              } else {
                useResumeStore.getState().setSectionOrder(['experience', 'education', 'skills', 'projects']);
              }
            }}
            className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-1.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
          >
            <option value="Fresher">Fresher</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Senior">Senior</option>
            <option value="Super Senior">Super Senior</option>
          </select>

          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsing}
            className="flex items-center gap-2 bg-[#f9f9f9] hover:bg-[#e5e5e5] text-[#1a1a1a] text-xs font-semibold px-4 py-2 rounded-full transition-all border border-[#e5e5e5] disabled:opacity-50"
          >
            {isParsing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Import PDF
          </button>
          
        </div>
      </div>
      
      <div className="space-y-8 pb-10 editor-pane-container">

        {/* Personal Info Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-[#1a1a1a] border-b border-[#e5e5e5] pb-2">Personal Information</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-4 py-2 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-4 py-2 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-4 py-2 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">LinkedIn</label>
                <input
                  type="url"
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-4 py-2 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={data.personalInfo.linkedin || ''}
                  onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">GitHub</label>
                <input
                  type="url"
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-4 py-2 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={data.personalInfo.github || ''}
                  onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                  placeholder="github.com/johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Portfolio</label>
                <input
                  type="url"
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-4 py-2 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={data.personalInfo.website || ''}
                  onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                  placeholder="johndoe.com"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Reorderable Sections */}
        <Reorder.Group 
          axis="y" 
          values={data.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills']} 
          onReorder={setSectionOrder}
          className="space-y-8"
        >
          {(data.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills']).map((sectionId) => {
            return (
              <Reorder.Item 
                key={sectionId} 
                value={sectionId}
                className="relative bg-white border border-[#e5e5e5] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
              >
                {sectionId === 'summary' && (
                  <div 
                    id="editor-summary"
                    onClick={() => document.getElementById('preview-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-[#e5e5e5] pb-2">
                      <h3 className="text-lg font-medium text-[#1a1a1a] flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-400" /> Professional Summary
                      </h3>
                      <div className="flex items-center gap-2">
                        {useResumeStore.getState().careerGrade === 'Super Senior' && (
                          <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={async () => {
                              toast.loading('Generating Executive Matrix...', { id: 'matrix' });
                              try {
                                const res = await fetch('/api/ai/pro-tools', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ action: 'legacy-filter', content: data.personalInfo.summary + "\n\nConvert this into a 3-part matrix: Core Competencies, Key Career Milestones, Leadership Philosophy." })
                                });
                                const result = await res.json();
                                if (!res.ok) throw new Error(result.error);
                                updatePersonalInfo({ summary: result.result });
                                toast.success('Executive Matrix generated!', { id: 'matrix' });
                              } catch (e: any) {
                                toast.error(e.message || 'Failed to generate matrix', { id: 'matrix' });
                              }
                            }}
                            className="text-xs text-[#1a1a1a] hover:bg-[#e5e5e5] flex items-center gap-1 bg-[#f9f9f9] border border-[#e5e5e5] px-2 py-1 rounded-md transition-colors"
                          >
                            <Sparkles className="w-3 h-3" /> Exec Summary Matrix
                          </button>
                        )}
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={async () => {
                            toast.loading('Generating summary...', { id: 'summary' });
                            try {
                              let endpoint = '/api/ai/summary';
                              let payload: any = { experience: data.experience, education: data.education };
                              
                              if (useResumeStore.getState().careerGrade !== 'Fresher' && useResumeStore.getState().targetJobKeywords) {
                                endpoint = '/api/ai/pro-tools';
                                payload = { 
                                  action: 'keyword-injector', 
                                  content: data.personalInfo.summary || 'Generate a summary.',
                                  context: { keywords: useResumeStore.getState().targetJobKeywords }
                                };
                              }

                              const res = await fetch(endpoint, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                              });
                              const result = await res.json();
                              if (!res.ok) throw new Error(result.error);
                              
                              updatePersonalInfo({ summary: result.summary || result.result });
                              toast.success('Summary generated!', { id: 'summary' });
                            } catch (e: any) {
                              toast.error(e.message || 'Failed to generate summary', { id: 'summary' });
                            }
                          }}
                          className="text-xs text-[#1a1a1a] hover:bg-[#e5e5e5] flex items-center gap-1 bg-[#f9f9f9] border border-[#e5e5e5] px-2 py-1 rounded-md transition-colors"
                        >
                          <Sparkles className="w-3 h-3" /> {useResumeStore.getState().careerGrade !== 'Fresher' ? 'Inject Keywords' : 'Auto-Generate'}
                        </button>
                      </div>
                    </div>
                    {useResumeStore.getState().careerGrade !== 'Fresher' && (
                      <div className="mb-3" onPointerDown={(e) => e.stopPropagation()}>
                         <label className="block text-xs font-medium text-gray-500 mb-1">Target Job Keywords (Dynamic Injection)</label>
                         <textarea 
                           className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-xs focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all resize-y min-h-[60px]"
                           placeholder="Paste Job Description keywords here (e.g. Next.js, System Design, GraphQL)..."
                           value={useResumeStore.getState().targetJobKeywords}
                           onChange={(e) => useResumeStore.getState().setTargetJobKeywords(e.target.value)}
                         />
                      </div>
                    )}
                    <textarea
                      onPointerDown={(e) => e.stopPropagation()}
                      className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-4 py-2 text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all min-h-[100px] resize-y"
                      value={data.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                      placeholder="Brief professional summary..."
                    />
                  </div>
                )}
                {sectionId === 'experience' && (
                  <div 
                    id="editor-experience" 
                    className="pointer-events-auto" 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => document.getElementById('preview-experience')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  >
                     <h3 className="text-lg font-medium text-[#1a1a1a] flex items-center gap-2 mb-4 border-b border-[#e5e5e5] pb-2 cursor-grab active:cursor-grabbing absolute top-4 left-4 right-4 z-10 w-[calc(100%-32px)]" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.parentElement?.parentElement?.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent)) }}>
                        <GripVertical className="w-5 h-5 text-gray-400" /> Experience
                     </h3>
                     <div className="pt-12"><ExperienceEditor /></div>
                  </div>
                )}
                {sectionId === 'education' && (
                  <div 
                    id="editor-education" 
                    className="pointer-events-auto" 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => document.getElementById('preview-education')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  >
                    <h3 className="text-lg font-medium text-[#1a1a1a] flex items-center gap-2 mb-4 border-b border-[#e5e5e5] pb-2 cursor-grab active:cursor-grabbing absolute top-4 left-4 right-4 z-10 w-[calc(100%-32px)]" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.parentElement?.parentElement?.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent)) }}>
                        <GripVertical className="w-5 h-5 text-gray-400" /> Education
                    </h3>
                    <div className="pt-12"><EducationEditor /></div>
                  </div>
                )}
                {sectionId === 'skills' && (
                  <div 
                    id="editor-skills" 
                    className="pointer-events-auto" 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => document.getElementById('preview-skills')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  >
                    <h3 className="text-lg font-medium text-[#1a1a1a] flex items-center gap-2 mb-4 border-b border-[#e5e5e5] pb-2 cursor-grab active:cursor-grabbing absolute top-4 left-4 right-4 z-10 w-[calc(100%-32px)]" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.parentElement?.parentElement?.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent)) }}>
                        <GripVertical className="w-5 h-5 text-gray-400" /> Skills
                    </h3>
                    <div className="pt-12"><SkillsEditor /></div>
                  </div>
                )}
                {sectionId === 'projects' && (
                  <div 
                    id="editor-projects" 
                    className="pointer-events-auto" 
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => document.getElementById('preview-projects')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  >
                    <h3 className="text-lg font-medium text-[#1a1a1a] flex items-center gap-2 mb-4 border-b border-[#e5e5e5] pb-2 cursor-grab active:cursor-grabbing absolute top-4 left-4 right-4 z-10 w-[calc(100%-32px)]" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.parentElement?.parentElement?.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent)) }}>
                        <GripVertical className="w-5 h-5 text-gray-400" /> Projects
                    </h3>
                    <div className="pt-12"><ProjectsEditor /></div>
                  </div>
                )}
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
      </div>

      <AICopilotSidebar />
    </div>
  );
}
