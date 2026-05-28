'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function ProjectsEditor() {
  const { data, addProject, updateProject, removeProject } = useResumeStore();

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center border-b border-white/10 pb-2">
        <h3 className="text-lg font-medium text-white">Projects</h3>
        <button 
          onClick={() => addProject({ id: uuidv4(), name: '', description: '', url: '', technologies: [] })}
          className="text-sm flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="space-y-6">
        {data.projects.map((project) => (
          <div key={project.id} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
            <button 
              onClick={() => removeProject(project.id)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 pr-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                    placeholder="e.g. AI Resume Builder"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">URL (Optional)</label>
                  <input
                    type="url"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    value={project.url || ''}
                    onChange={(e) => updateProject(project.id, { url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Technologies (Comma separated)</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateProject(project.id, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="React, Node.js, OpenAI"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all min-h-[80px]"
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
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
