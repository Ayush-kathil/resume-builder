'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';

export function EditorPane() {
  const { data, updatePersonalInfo, setResumeData } = useResumeStore();
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
    <div className="w-full h-full bg-[#0a0a0a] border-r border-white/10 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Editor</h2>
        <button
          onClick={handleShorten}
          disabled={isShortening}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isShortening ? 'Shortening...' : 'AI Shorten to 1 Page'}
        </button>
      </div>
      
      <div className="space-y-8 pb-10">
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
              <label className="block text-sm font-medium text-gray-400 mb-1">Professional Summary</label>
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
