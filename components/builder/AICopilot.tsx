'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, MessageSquare, Target, X, ChevronRight, FileSearch } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

export const AICopilotSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'ats'>('suggestions');

  return (
    <>
      {/* Floating Toggle Button (if closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full shadow-lg text-white"
          >
            <Bot className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-[320px] bg-[#09090B]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-medium">
                <Sparkles className="w-4 h-4 text-accent" />
                AI Copilot
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-white/10">
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'suggestions' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Suggestions
              </button>
              <button
                onClick={() => setActiveTab('ats')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'ats' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                ATS
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Chat
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
              
              {activeTab === 'suggestions' && (
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-amber-400 mb-1 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Enhance Summary
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">
                      Your summary lacks concrete metrics. Want me to generate an executive-level summary?
                    </p>
                    <button className="text-xs bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded transition-colors w-full">
                      Generate Summary
                    </button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Quantify Impact
                    </h4>
                    <p className="text-xs text-gray-400 mb-2">
                      Found 3 bullet points starting with "Worked on". Let's convert them to the STAR format.
                    </p>
                    <button className="text-xs bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded transition-colors w-full">
                      Fix Bullets
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'ats' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <FileSearch className="w-8 h-8 text-gray-500" />
                  <p className="text-xs text-gray-400">
                    Paste a job description to overlay the ATS Heatmap and see missing keywords.
                  </p>
                  <button className="text-xs bg-accent hover:bg-blue-600 text-white py-1.5 px-4 rounded-full transition-colors font-medium">
                    Analyze Job Description
                  </button>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 text-xs text-gray-400">
                    How can I help you improve your resume today?
                  </div>
                  <div className="mt-auto pt-4 relative">
                    <input 
                      type="text" 
                      placeholder="Ask AI..." 
                      className="w-full bg-black/50 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-white/20"
                    />
                    <button className="absolute right-2 top-[22px] text-gray-500 hover:text-white transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
