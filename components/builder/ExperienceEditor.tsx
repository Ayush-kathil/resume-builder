'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import { motion } from 'framer-motion';

export function ExperienceEditor() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <h3 className="text-lg font-medium text-white">Experience</h3>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }}
        >
          <button 
            onClick={() => addExperience({ id: uuidv4(), company: '', position: '', startDate: '', endDate: '', current: false, location: '', description: [''] })}
            className="text-xs flex items-center gap-1 bg-white/5 border border-white/10 text-blue-400 hover:text-blue-300 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all shadow-lg shadow-black/20"
          >
            <Plus className="h-3.5 w-3.5" /> Add Section
          </button>
        </motion.div>
      </div>

      <div className="space-y-6">
        {data.experience.map((exp, index) => (
          <div key={exp.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
            <button 
              onClick={() => removeExperience(exp.id)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 pr-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Company</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Position</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    placeholder="Jan 2020"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">End Date</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    placeholder="Present"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Description (Bullet Points)</label>
                <div className="space-y-2">
                  {exp.description.map((bullet, i) => (
                    <div key={i} className="relative group/bullet flex items-start gap-2">
                      <span className="text-gray-500 mt-2 text-xs">•</span>
                      <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all min-h-[60px]"
                        value={bullet}
                        onChange={(e) => {
                          const newDesc = [...exp.description];
                          newDesc[i] = e.target.value;
                          updateExperience(exp.id, { description: newDesc });
                        }}
                      />
                      <button
                        onClick={() => {
                          const newDesc = [...exp.description];
                          newDesc.splice(i, 1);
                          updateExperience(exp.id, { description: newDesc });
                        }}
                        className="absolute right-10 top-2 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover/bullet:opacity-100 transition-opacity"
                        title="Remove bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          toast.loading('Rewriting bullet...', { id: `rewrite-${exp.id}-${i}` });
                          try {
                            const res = await fetch('/api/ai/rewrite-bullet', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ bullet, company: exp.company, position: exp.position })
                            });
                            const result = await res.json();
                            if (!res.ok) throw new Error(result.error);
                            
                            const newDesc = [...exp.description];
                            newDesc[i] = result.bullet;
                            updateExperience(exp.id, { description: newDesc });
                            toast.success('Bullet rewritten!', { id: `rewrite-${exp.id}-${i}` });
                          } catch (e: any) {
                            toast.error(e.message || 'Failed to rewrite bullet', { id: `rewrite-${exp.id}-${i}` });
                          }
                        }}
                        className="absolute right-2 top-2 p-1 bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 rounded-md opacity-0 group-hover/bullet:opacity-100 transition-opacity shadow-lg"
                        title="AI Rewrite"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => updateExperience(exp.id, { description: [...exp.description, ''] })}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
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
