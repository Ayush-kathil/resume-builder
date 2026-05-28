'use client';

import { useResumeStore } from '@/store/resumeStore';
import { motion } from 'framer-motion';
import { Target, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export function ATSWidget() {
  const { data, targetJobKeywords, setTargetJobKeywords } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);

  const { matchScore, foundKeywords, missingKeywords } = useMemo(() => {
    if (!targetJobKeywords.trim()) return { matchScore: 0, foundKeywords: [], missingKeywords: [] };

    const keywords = targetJobKeywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
    if (keywords.length === 0) return { matchScore: 0, foundKeywords: [], missingKeywords: [] };

    // Create a massive string of the entire resume
    const resumeText = JSON.stringify(data).toLowerCase();

    const found: string[] = [];
    const missing: string[] = [];

    keywords.forEach(kw => {
      if (resumeText.includes(kw)) {
        found.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const score = Math.round((found.length / keywords.length) * 100);

    return { matchScore: score, foundKeywords: found, missingKeywords: missing };
  }, [data, targetJobKeywords]);

  const circumference = 2 * Math.PI * 18; // r=18
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-80 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-indigo-500/10"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Target Keywords
            </h3>
            <span className="text-2xl font-bold text-white">{matchScore}%</span>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="e.g. react, node.js, AWS, leadership"
              value={targetJobKeywords}
              onChange={(e) => setTargetJobKeywords(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <p className="text-[10px] text-gray-400 mt-1">Comma separated</p>
          </div>

          {targetJobKeywords && (
            <div className="space-y-3">
              {foundKeywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-green-400 mb-1">Found</h4>
                  <div className="flex flex-wrap gap-1">
                    {foundKeywords.map(kw => (
                      <span key={kw} className="text-[10px] bg-green-500/10 text-green-300 px-2 py-0.5 rounded-full border border-green-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {missingKeywords.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-red-400 mb-1">Missing</h4>
                  <div className="flex flex-wrap gap-1">
                    {missingKeywords.map(kw => (
                      <span key={kw} className="text-[10px] bg-red-500/10 text-red-300 px-2 py-0.5 rounded-full border border-red-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/10 relative group"
      >
        {targetJobKeywords ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22" cy="22" r="18"
                className="stroke-white/10"
                strokeWidth="4" fill="none"
              />
              <motion.circle
                cx="22" cy="22" r="18"
                className="stroke-white"
                strokeWidth="4" fill="none" strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                style={{ strokeDasharray: circumference }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <span className="text-xs font-bold text-white z-10">{matchScore}%</span>
          </div>
        ) : (
          <Target className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}
