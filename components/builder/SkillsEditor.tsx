'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

export function SkillsEditor() {
  const { data, addSkill, updateSkill, removeSkill } = useResumeStore();

  return (
    <section className="space-y-4 font-sans">
      <div className="flex justify-between items-center border-b border-[#e5e5e5] pb-2">
        <h3 className="text-lg font-medium text-[#1a1a1a]">Skills</h3>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.6 }}
        >
          <button 
            onClick={() => addSkill({ id: uuidv4(), category: '', items: [] })}
            className="text-xs flex items-center gap-1 bg-[#f9f9f9] border border-[#e5e5e5] text-gray-700 hover:text-[#1a1a1a] hover:bg-[#e5e5e5] px-3 py-1.5 rounded-full transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Section
          </button>
        </motion.div>
      </div>

      <div className="space-y-4">
        {data.skills.map((skill) => (
          <div key={skill.id} className="p-4 bg-white border border-[#e5e5e5] rounded-xl relative group hover:shadow-md transition-shadow">
            <button 
              onClick={() => removeSkill(skill.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            <div className="space-y-3">
              <div className="pr-6">
                <label className="block text-xs font-medium text-gray-500 mb-1">Category (e.g. Languages, Frameworks)</label>
                <input
                  type="text"
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                  placeholder="e.g. Frameworks"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Skills (Comma separated)</label>
                <textarea
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all min-h-[60px]"
                  value={skill.items.join(', ')}
                  onChange={(e) => updateSkill(skill.id, { items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="React, Next.js, TailwindCSS"
                />
              </div>
            </div>
          </div>
        ))}
        {data.skills.length === 0 && (
          <p className="text-sm text-gray-500 italic">No skills added yet.</p>
        )}
      </div>
    </section>
  );
}
