'use client';

import React, { useState, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Sparkles, GripVertical, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';

import { motion, Reorder } from 'framer-motion';

export function EditorPane() {
  const { data, selectedTemplate, setTemplate, updatePersonalInfo, setResumeData, setSectionOrder } = useResumeStore();
  const [isShortening, setIsShortening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleShorten = async () => {
    setIsShortening(true);
    toast.loading('AI is aggressively shortening your resume...', { id: 'shorten' });

    try {
      const res = await fetch('/api/ai/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to shorten resume');
      }

      setResumeData(result);
      toast.success('Resume shortened to 1 page!', { id: 'shorten' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to shorten resume', { id: 'shorten' });
    } finally {
      setIsShortening(false);
    }
  };

  return (
    <div className="w-full h-full bg-slate-900/40 backdrop-blur-xl border-r border-white/10 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Editor</h2>
        <div className="flex items-center gap-2">
          <select
            value={useResumeStore.getState().careerGrade}
            onChange={(e) => {
              const grade = e.target.value as 'Entry' | 'Professional' | 'Executive';
              useResumeStore.getState().setCareerGrade(grade);
              if (grade === 'Entry') {
                // Auto-flip for Entry level: Skills & Education first
                useResumeStore.getState().setSectionOrder(['skills', 'education', 'experience', 'projects']);
                toast.success('Applied Skill-Over-History Flip for Entry Grade');
              } else {
                useResumeStore.getState().setSectionOrder(['experience', 'education', 'skills', 'projects']);
              }
            }}
            className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Entry">Entry Grade (0-2 YOE)</option>
            <option value="Professional">Pro Grade (3-8 YOE)</option>
            <option value="Executive">Exec Grade (8+ YOE)</option>
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
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all border border-white/20 disabled:opacity-50"
          >
            {isParsing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Import PDF
          </button>
          
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <button
              onClick={handleShorten}
              disabled={isShortening}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isShortening ? 'Shortening...' : 'AI Shorten to 1 Page'}
            </button>
          </motion.div>
        </div>
      </div>
      
      <div className="space-y-8 pb-10 editor-pane-container">
        {/* Template Switcher */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Templates</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {[
              { id: 'classic', name: 'Classic ATS', desc: 'Strictly single-column, serif' },
              { id: 'modern', name: 'Modern Executive', desc: 'Clean sans-serif, structured' },
              { id: 'minimalist', name: 'Technical Grid', desc: 'Grid layout, tech focus' },
              { id: 'creative', name: 'Creative Minimalist', desc: 'Bold typography, sidebars' },
              { id: 'academic', name: 'Executive Academic', desc: 'Dense, traditional, long-form' }
            ].map(tpl => {
              const isSelected = selectedTemplate === tpl.id;
              
              return (
                <motion.div 
                  key={tpl.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTemplate(tpl.id)}
                  className={`flex-shrink-0 snap-center w-40 h-28 rounded-xl border p-4 cursor-pointer flex flex-col justify-end transition-all ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{tpl.name}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{tpl.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Personal Information</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
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
                className="relative bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg cursor-grab active:cursor-grabbing"
              >
                {sectionId === 'summary' && (
                  <div>
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                      <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <GripVertical className="w-5 h-5 text-gray-500" /> Professional Summary
                      </h3>
                      <div className="flex items-center gap-2">
                        {useResumeStore.getState().careerGrade === 'Executive' && (
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
                            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md transition-colors"
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
                              
                              if (useResumeStore.getState().careerGrade === 'Professional' && useResumeStore.getState().targetJobKeywords) {
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
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-md transition-colors"
                        >
                          <Sparkles className="w-3 h-3" /> {useResumeStore.getState().careerGrade === 'Professional' ? 'Inject Keywords' : 'Auto-Generate'}
                        </button>
                      </div>
                    </div>
                    {useResumeStore.getState().careerGrade === 'Professional' && (
                      <div className="mb-3" onPointerDown={(e) => e.stopPropagation()}>
                         <label className="block text-xs font-medium text-emerald-400 mb-1">Target Job Keywords (Dynamic Injection)</label>
                         <textarea 
                           className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all resize-y min-h-[60px]"
                           placeholder="Paste Job Description keywords here (e.g. Next.js, System Design, GraphQL)..."
                           value={useResumeStore.getState().targetJobKeywords}
                           onChange={(e) => useResumeStore.getState().setTargetJobKeywords(e.target.value)}
                         />
                      </div>
                    )}
                    <textarea
                      onPointerDown={(e) => e.stopPropagation()}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all min-h-[100px] resize-y"
                      value={data.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                      placeholder="Brief professional summary..."
                    />
                  </div>
                )}
                {sectionId === 'experience' && (
                  <div className="pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
                     <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2 cursor-grab active:cursor-grabbing absolute top-4 left-4 right-4 z-10 w-[calc(100%-32px)]" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.parentElement?.parentElement?.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent)) }}>
                        <GripVertical className="w-5 h-5 text-gray-500" /> Experience
                     </h3>
                     <div className="pt-12"><ExperienceEditor /></div>
                  </div>
                )}
                {sectionId === 'education' && (
                  <div className="pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2 cursor-grab active:cursor-grabbing absolute top-4 left-4 right-4 z-10 w-[calc(100%-32px)]" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.parentElement?.parentElement?.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent)) }}>
                        <GripVertical className="w-5 h-5 text-gray-500" /> Education
                    </h3>
                    <div className="pt-12"><EducationEditor /></div>
                  </div>
                )}
                {sectionId === 'skills' && (
                  <div className="pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2 cursor-grab active:cursor-grabbing absolute top-4 left-4 right-4 z-10 w-[calc(100%-32px)]" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.parentElement?.parentElement?.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent)) }}>
                        <GripVertical className="w-5 h-5 text-gray-500" /> Skills
                    </h3>
                    <div className="pt-12"><SkillsEditor /></div>
                  </div>
                )}
                {sectionId === 'projects' && (
                  <div className="pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4 border-b border-white/10 pb-2 cursor-grab active:cursor-grabbing absolute top-4 left-4 right-4 z-10 w-[calc(100%-32px)]" onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); e.currentTarget.parentElement?.parentElement?.dispatchEvent(new PointerEvent('pointerdown', e.nativeEvent)) }}>
                        <GripVertical className="w-5 h-5 text-gray-500" /> Projects
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
  );
}
