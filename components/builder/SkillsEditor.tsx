'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

export function SkillsEditor() {
  const { data, addSkill, updateSkill, removeSkill, setResumeData } = useResumeStore();
  const [isGrouping, setIsGrouping] = useState(false);

  const handleSmartGroup = async () => {
    // Flatten all skills into one array
    const allSkills = data.skills.flatMap(s => s.items).filter(Boolean);
    if (allSkills.length === 0) {
      toast.error('Add some skills first before grouping.');
      return;
    }

    setIsGrouping(true);
    try {
      const res = await fetch('/api/ai/group-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: allSkills })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      // result should be an array of { category, skills }
      const newSkills = result.map((group: any) => ({
        id: uuidv4(),
        category: group.category,
        items: group.skills
      }));

      setResumeData({ ...data, skills: newSkills });
      toast.success('Skills smartly grouped!');
    } catch (err: any) {
      toast.error(err.message || 'Smart grouping failed');
    } finally {
      setIsGrouping(false);
    }
  };

  return (
    <section className="space-y-4 font-sans relative">
      <AnimatePresence>
        {isGrouping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-xl"
          >
            <div className="flex flex-col items-center gap-3 px-6 py-4 bg-white border border-[#e5e5e5] rounded-xl shadow-xl">
              <Loader2 className="w-6 h-6 animate-spin text-[#1a1a1a]" />
              <p className="text-sm font-medium text-[#1a1a1a]">AI is categorizing your skills...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center border-b border-[#e5e5e5] pb-2">
        <h3 className="text-lg font-medium text-[#1a1a1a]">Skills</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleSmartGroup}
            disabled={isGrouping}
            className="text-xs flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-all shadow-sm disabled:opacity-50"
            title="Auto-group skills into FAANG categories (Languages, Tools, etc.)"
          >
            <Sparkles className="h-3.5 w-3.5" /> Smart Group
          </button>
          
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
