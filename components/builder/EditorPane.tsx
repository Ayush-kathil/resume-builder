'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';

import { motion } from 'framer-motion';

export function EditorPane() {
  const { data, selectedTemplate, setTemplate, updatePersonalInfo, setResumeData } = useResumeStore();
  const [isShortening, setIsShortening] = useState(false);

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
      
      <div className="space-y-8 pb-10 editor-pane-container">
        {/* Template Switcher */}
        <section className="space-y-4">
          <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Templates</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {[
              { id: 'classic', name: 'Classic ATS', desc: 'Strictly single-column, serif' },
              { id: 'modern', name: 'Modern Executive', desc: 'Clean sans-serif, structured' },
              { id: 'minimalist', name: 'Tech Minimalist', desc: 'Monospace, FAANG optimized' }
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

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-400">Professional Summary</label>
                <button
                  onClick={async () => {
                    toast.loading('Generating summary from experience...', { id: 'summary' });
                    try {
                      const res = await fetch('/api/ai/summary', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ experience: data.experience, education: data.education })
                      });
                      const result = await res.json();
                      if (!res.ok) throw new Error(result.error);
                      updatePersonalInfo({ summary: result.summary });
                      toast.success('Summary generated!', { id: 'summary' });
                    } catch (e: any) {
                      toast.error(e.message || 'Failed to generate summary', { id: 'summary' });
                    }
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-md transition-colors"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Generate
                </button>
              </div>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all min-h-[100px] resize-y"
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                placeholder="Brief professional summary..."
              />
            </div>
          </div>
        </section>

        <ExperienceEditor />
        <EducationEditor />
        <SkillsEditor />
        <ProjectsEditor />
      </div>
    </div>
  );
}
