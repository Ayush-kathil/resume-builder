'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { motion } from 'framer-motion';

export function ProjectsEditor() {
  const { data, addProject, updateProject, removeProject } = useResumeStore();

  return (
    <section className="space-y-4 font-sans">
      <div className="flex justify-between items-center border-b border-[#e5e5e5] pb-2">
        <h3 className="text-lg font-medium text-[#1a1a1a]">Projects</h3>
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 }}
        >
          <button 
            onClick={() => addProject({ id: uuidv4(), name: '', description: [], url: '', technologies: [] })}
            className="text-xs flex items-center gap-1 bg-[#f9f9f9] border border-[#e5e5e5] text-gray-700 hover:text-[#1a1a1a] hover:bg-[#e5e5e5] px-3 py-1.5 rounded-full transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Section
          </button>
        </motion.div>
      </div>

      <div className="space-y-6">
        {data.projects.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 bg-[#f9f9f9] border border-dashed border-[#e5e5e5] rounded-xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 border border-[#e5e5e5]">
              <Sparkles className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">No projects added yet</h4>
            <p className="text-xs text-gray-500 max-w-[200px] mb-4">Showcase your side projects, open-source contributions, or portfolio work.</p>
            <button 
              onClick={() => addProject({ id: uuidv4(), name: '', description: [], url: '', technologies: [] })}
              className="text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              Add Project
            </button>
          </div>
        )}
        {data.projects.map((project) => (
          <div key={project.id} className="p-4 bg-white border border-[#e5e5e5] rounded-xl relative group hover:shadow-md transition-shadow">
            <button 
              onClick={() => removeProject(project.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 pr-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Project Name</label>
                  <input
                    type="text"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                    placeholder="e.g. AI Resume Builder"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">URL (Optional)</label>
                  <input
                    type="url"
                    className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={project.url || ''}
                    onChange={(e) => updateProject(project.id, { url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Technologies (Comma separated)</label>
                <input
                  type="text"
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateProject(project.id, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="React, Node.js, OpenAI"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea
                  className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg px-3 py-2 text-[#1a1a1a] text-sm focus:outline-none focus:ring-1 focus:ring-[#1a1a1a] transition-all min-h-[80px]"
                  value={(project.description || []).join('\n')}
                  onChange={(e) => updateProject(project.id, { description: e.target.value.split('\n') })}
                  placeholder="Built a tool that..."
                />
              </div>
            </div>
          </div>
        ))}
        {data.projects.length === 0 && (
          <p className="text-sm text-gray-500 italic">No projects added yet.</p>
        )}
      </div>
    </section>
  );
}
