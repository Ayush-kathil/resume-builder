'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, FileUp, Sparkles, LayoutTemplate, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { icon: <Plus className="w-4 h-4 text-accent" />, label: 'Create New Resume', action: () => alert('Create New') },
    { icon: <FileUp className="w-4 h-4 text-emerald-400" />, label: 'Import Resume (PDF/TXT)', action: () => alert('Import') },
    { icon: <Sparkles className="w-4 h-4 text-purple-400" />, label: 'Optimize for ATS', action: () => alert('Optimize') },
    { icon: <LayoutTemplate className="w-4 h-4 text-amber-400" />, label: 'Switch Template', action: () => alert('Switch Template') },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-[#111113]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-[101] overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/10">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 text-lg"
              />
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      cmd.action();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-left rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
                      {cmd.icon}
                    </div>
                    <span className="text-gray-200">{cmd.label}</span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">No commands found.</div>
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-white/5 bg-[#09090B]/50 text-xs text-gray-500 flex justify-between">
              <span>Use <kbd className="font-mono bg-white/10 px-1 rounded">↑</kbd> <kbd className="font-mono bg-white/10 px-1 rounded">↓</kbd> to navigate</span>
              <span><kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded">esc</kbd> to close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
