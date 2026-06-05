'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Sparkles, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { motion } from 'framer-motion';

export function RightSidebar() {
  const { themeConfig, setThemeConfig, targetJobDescription, data } = useResumeStore();

  const calculateDensity = () => {
    const textStr = JSON.stringify(data);
    if (textStr.length < 2000) return { label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (textStr.length < 4000) return { label: 'Excellent', color: 'text-blue-500', bg: 'bg-blue-50' };
    return { label: 'Overcrowded', color: 'text-red-500', bg: 'bg-red-50' };
  };

  const calculateATSScore = () => {
    const jd = targetJobDescription.toLowerCase();
    if (!jd) return null;
    
    const stopWords = ['this','that','with','from','your','have','will','must','should','would','could','experience','years','work','team','role','job','skills'];
    const jdWords = new Set(jd.split(/\W+/).filter(w => w.length > 3 && !stopWords.includes(w)));
    if (jdWords.size === 0) return null;

    const resumeStr = JSON.stringify(data).toLowerCase();
    let matchCount = 0;
    const missing: string[] = [];
    
    jdWords.forEach(word => {
      if (resumeStr.includes(word)) {
        matchCount++;
      } else {
        missing.push(word);
      }
    });

    const score = Math.round((matchCount / jdWords.size) * 100);
    return { score, missing: missing.slice(0, 4) };
  };

  const atsScoreData = calculateATSScore();

  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar font-sans bg-white text-[#1a1a1a]">
      
      {/* Target Job Description */}
      <div>
        <h3 className="text-sm font-medium mb-3">Target Job Matcher</h3>
        <textarea 
          className="w-full h-24 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl p-3 text-xs text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-all custom-scrollbar mb-4"
          placeholder="Paste the Job Description here to get a match score..."
          value={targetJobDescription}
          onChange={(e) => useResumeStore.getState().setTargetJobDescription(e.target.value)}
        />
        
        {/* Skill Alignment Card */}
        <div className="bg-gradient-to-b from-[#f0f4ff] to-[#f8faff] border border-[#d6e2ff] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-600 font-semibold">
              <Sparkles className="w-4 h-4" /> Skill Alignment
            </div>
            {atsScoreData && (
              <div className={`text-xl font-bold ${atsScoreData.score > 75 ? 'text-emerald-500' : atsScoreData.score > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {atsScoreData.score}%
              </div>
            )}
          </div>
          {atsScoreData ? (
            <>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                {atsScoreData.missing.length > 0 
                  ? <span className="font-medium text-blue-800">{atsScoreData.missing.length} skills found in JD</span>
                  : <span className="font-medium text-emerald-600">Great job!</span>} that are missing from your profile.
              </p>
              {atsScoreData.missing.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {atsScoreData.missing.map((w, i) => (
                    <span key={i} className="text-[10px] bg-white text-blue-700 px-2 py-1 rounded border border-blue-200 shadow-sm font-medium">
                      {w}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-medium hover:bg-gray-50 transition-colors">Ignore</button>
                <button className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm">Add skills</button>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Paste a Job Description above to see missing skills.
            </p>
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#e5e5e5]"></div>

      {/* Font & Text Formatting */}
      <div>
        <h3 className="text-sm font-medium mb-3">Text</h3>
        <div className="flex flex-col gap-3">
          <select
            value={themeConfig.fontFamily}
            onChange={(e) => setThemeConfig({ fontFamily: e.target.value as 'serif' | 'sans' })}
            className="w-full bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none font-medium cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231a1a1a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
          >
            <option value="sans">Geist (Sans)</option>
            <option value="serif">Times (Serif)</option>
          </select>

          {/* Dummy settings purely for visual matching */}
          <div className="flex gap-2">
            <div className="flex-1 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl px-3 py-2 flex justify-between items-center text-sm">
              <span className="font-medium">Regular</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>
            <div className="flex-1 bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl px-3 py-2 flex justify-between items-center text-sm">
              <span className="font-medium">14px</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#e5e5e5]"></div>

      {/* Colors */}
      <div>
        <h3 className="text-sm font-medium mb-3">Colors</h3>
        <div className="bg-[#f9f9f9] border border-[#e5e5e5] rounded-xl p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: themeConfig.accentColor }}></div>
            <span className="text-sm font-medium uppercase">{themeConfig.accentColor}</span>
          </div>
          <span className="text-gray-400 text-xs pr-2">▼</span>
        </div>
        
        {/* Preset Colors */}
        <div className="flex items-center gap-2 mt-3">
          {['#1B1B1B', '#2563EB', '#10B981', '#8B5CF6', '#F59E0B'].map(color => (
            <button
              key={color}
              onClick={() => setThemeConfig({ accentColor: color })}
              className={`w-6 h-6 rounded-md transition-transform ${themeConfig.accentColor === color ? 'scale-110 ring-2 ring-offset-1 ring-blue-500' : 'hover:scale-110 border border-gray-200'}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
