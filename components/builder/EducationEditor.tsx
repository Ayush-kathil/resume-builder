'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import { motion } from 'framer-motion';

export function EducationEditor() {
  const { data, addEducation, updateEducation, removeEducation, careerGrade, addExperience, activeAiEditField, setActiveAiEditField } = useResumeStore();

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <h3 className="text-lg font-medium text-white">Education</h3>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.4 }}
        >
          <button 
            onClick={() => addEducation({ id: uuidv4(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false, location: '', gpa: '' })}
            className="text-xs flex items-center gap-1 bg-white/5 border border-white/10 text-blue-400 hover:text-blue-300 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all shadow-lg shadow-black/20"
          >
            <Plus className="h-3.5 w-3.5" /> Add Section
          </button>
        </motion.div>
      </div>

      <div className="space-y-6">
        {data.education.map((edu) => (
          <div key={edu.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
            <button 
              onClick={() => removeEducation(edu.id)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 pr-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Institution</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={edu.institution || ''}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="e.g. Stanford University"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={edu.location || ''}
                    onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                    placeholder="Stanford, CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Degree</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="B.S."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Field of Study</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={edu.fieldOfStudy || ''}
                    onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                    placeholder="Computer Science"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={edu.startDate || ''}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    placeholder="Sep 2018"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">End Date</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={edu.endDate || ''}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    placeholder="May 2022"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">GPA (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                    placeholder="3.9"
                  />
                </div>
              </div>

              {careerGrade === 'Fresher' && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={async () => {
                      const fieldId = `edu-translate-${edu.id}`;
                      setActiveAiEditField(fieldId);
                      toast.loading('Translating academic experience...', { id: `translate-${edu.id}` });
                      try {
                        const content = `${edu.degree} in ${edu.fieldOfStudy} at ${edu.institution}`;
                        const res = await fetch('/api/ai/pro-tools', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'academic-translate', content })
                        });
                        const result = await res.json();
                        if (!res.ok) throw new Error(result.error);
                        
                        addExperience({
                          id: uuidv4(),
                          company: edu.institution,
                          position: 'Academic Researcher / Project Lead',
                          startDate: edu.startDate,
                          endDate: edu.endDate,
                          current: false,
                          location: edu.location,
                          description: [result.result]
                        });
                        toast.success('Added to Experience section!', { id: `translate-${edu.id}` });
                      } catch (e: any) {
                        toast.error(e.message || 'Translation failed', { id: `translate-${edu.id}` });
                      } finally {
                        setActiveAiEditField(null);
                      }
                    }}
                    className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors w-full justify-center ${
                      activeAiEditField === `edu-translate-${edu.id}`
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'text-emerald-400 hover:text-emerald-300 bg-emerald-400/10 hover:bg-emerald-400/20'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Translate to Professional Experience
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {data.education.length === 0 && (
          <p className="text-sm text-gray-500 italic">No education added yet.</p>
        )}
      </div>
    </section>
  );
}
