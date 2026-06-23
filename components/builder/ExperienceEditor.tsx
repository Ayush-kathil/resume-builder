'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import { motion } from 'framer-motion';
import { SmartBulletInput } from './SmartBulletInput';

export function ExperienceEditor() {
  const { data, addExperience, updateExperience, removeExperience, careerGrade, activeAiEditField, setActiveAiEditField } = useResumeStore();

  return (
    <section className="space-y-4 font-sans">
      <div className="flex justify-between items-center border-b border-[#e5e5e5] pb-2">
        <h3 className="text-lg font-medium text-[#1a1a1a]">Experience</h3>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }}
        >
          <button 
            onClick={() => addExperience({ id: uuidv4(), company: '', position: '', startDate: '', endDate: '', current: false, location: '', description: [''] })}
            className="text-xs flex items-center gap-1 bg-[#f9f9f9] border border-[#e5e5e5] text-gray-700 hover:text-[#1a1a1a] hover:bg-[#e5e5e5] px-3 py-1.5 rounded-full transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Section
          </button>
        </motion.div>
      </div>

      <div className="space-y-6">
        {data.experience.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 bg-[#f9f9f9] border border-dashed border-[#e5e5e5] rounded-xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 border border-[#e5e5e5]">
              <Sparkles className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">No experience added yet</h4>
            <p className="text-xs text-gray-500 max-w-[200px] mb-4">Add your work history to start building your professional profile.</p>
            <button 
              onClick={() => addExperience({ id: uuidv4(), company: '', position: '', startDate: '', endDate: '', current: false, location: '', description: [''] })}
              className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              Add Experience
            </button>
          </div>
        )}
        {data.experience.map((exp, index) => (
          <div key={exp.id} className="p-4 bg-white border border-[#e5e5e5] rounded-xl relative group hover:shadow-md transition-shadow">
            <button 
              onClick={() => removeExperience(exp.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 pr-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
                  <input
                    type="text"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Position</label>
                  <input
                    type="text"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                  <input
                    type="text"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    placeholder="Jan 2020"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                  <input
                    type="text"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    placeholder="Present"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Description (Bullet Points)</label>
                <div className="space-y-2">
                  {(exp.description || []).map((bullet, i) => (
                    <SmartBulletInput
                      key={i}
                      value={bullet}
                      onChange={(newVal) => {
                        const newDesc = [...(exp.description || [])];
                        newDesc[i] = newVal;
                        updateExperience(exp.id, { description: newDesc });
                      }}
                      onRemove={() => {
                        const newDesc = [...(exp.description || [])];
                        newDesc.splice(i, 1);
                        updateExperience(exp.id, { description: newDesc });
                      }}
                      onRewrite={async (actionType) => {
                        const fieldId = `exp-${exp.id}-desc-${i}`;
                        setActiveAiEditField(fieldId);
                        
                        try {
                          let endpoint = '/api/ai/pro-tools';
                          let body = { action: actionType, content: bullet };

                          if (actionType === 'show-dont-tell') {
                            endpoint = '/api/ai/show-dont-tell';
                            body = { text: bullet } as any;
                          } else if (actionType === 'star-validator') {
                            endpoint = '/api/ai/star-validator';
                            body = { text: bullet } as any;
                          } else if (actionType === 'enhance' || actionType === 'improve') {
                            endpoint = '/api/ai/enhance';
                            body = { text: bullet, context: exp.position } as any;
                          } else if (actionType === 'shorten') {
                            endpoint = '/api/ai/shorten';
                            body = { text: bullet } as any;
                          }

                          const res = await fetch(endpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body)
                          });
                          const result = await res.json();
                          if (!res.ok) throw new Error(result.error);
                          
                          if (actionType === 'star-validator') {
                            if (result.isValid) {
                              toast.success('STAR Format Valid: ' + result.feedback);
                            } else {
                              toast.error('STAR Format Invalid: ' + result.feedback, { duration: 5000 });
                            }
                          } else {
                            const newDesc = [...(exp.description || [])];
                            newDesc[i] = result.text || result.result;
                            updateExperience(exp.id, { description: newDesc });
                            toast.success('Bullet point enhanced!');
                          }
                        } catch (err: any) {
                          toast.error(err.message || 'AI request failed');
                        } finally {
                          setActiveAiEditField(null);
                        }
                      }}
                      isAiEditing={activeAiEditField === `exp-${exp.id}-desc-${i}`}
                    />
                  ))}
                  <button
                    onClick={() => updateExperience(exp.id, { description: [...(exp.description || []), ''] })}
                    className="text-xs text-gray-500 hover:text-[#1a1a1a] flex items-center gap-1 mt-2 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add Bullet
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {data.experience.length === 0 && (
          <p className="text-sm text-gray-500 italic">No experience added yet.</p>
        )}
      </div>
    </section>
  );
}
