'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Sparkles, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export function RightSidebar() {
  const { themeConfig, setThemeConfig, targetJobDescription, data, setResumeData } = useResumeStore();
  const [isPolishing, setIsPolishing] = useState(false);
  const [isShiftingTone, setIsShiftingTone] = useState(false);
  const [activeTone, setActiveTone] = useState<string>('Standard');

  const handleFaangPolish = async () => {
    setIsPolishing(true);
    try {
      const res = await fetch('/api/ai/faang-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setResumeData(result);
      toast.success('FAANG Polish Complete! Your resume has been structurally optimized.');
    } catch (err: any) {
      toast.error(err.message || 'FAANG Polish failed');
    } finally {
      setIsPolishing(false);
    }
  };

  const handleToneShift = async (tone: string) => {
    setActiveTone(tone);
    if (tone === 'Standard') return; // Don't do anything for standard

    setIsShiftingTone(true);
    try {
      const res = await fetch('/api/ai/tone-shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, tone })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setResumeData(result);
      toast.success(`Tone shifted to ${tone}!`);
    } catch (err: any) {
      toast.error(err.message || 'Tone shift failed');
    } finally {
      setIsShiftingTone(false);
    }
  };

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

  // Synthetic metrics based on resume length/content
  const impactScore = Math.min(100, (data.experience.length * 15) + (JSON.stringify(data).match(/\d+/g)?.length || 0) * 5);
  const techScore = Math.min(100, data.skills.flatMap(s => s.items).length * 8);
  const leadScore = Math.min(100, (JSON.stringify(data).match(/led|managed|spearheaded|architected/gi)?.length || 0) * 15);
  const clarityScore = calculateDensity().label === 'Overcrowded' ? 60 : 95;

  const radarData = [
    { subject: 'Impact', A: impactScore, fullMark: 100 },
    { subject: 'Tech Depth', A: techScore, fullMark: 100 },
    { subject: 'Leadership', A: leadScore, fullMark: 100 },
    { subject: 'Clarity', A: clarityScore, fullMark: 100 },
  ];

  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar font-sans bg-white text-[#1a1a1a] relative">
      
      <AnimatePresence>
        {(isPolishing || isShiftingTone) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4 px-8 py-6 bg-white border border-[#e5e5e5] rounded-2xl shadow-2xl text-center max-w-[280px]">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 mb-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1a1a1a] mb-1">{isPolishing ? 'Applying FAANG Polish' : 'Shifting Tone...'}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{isPolishing ? 'Rewriting bullets, fixing grammar, and optimizing ATS keywords...' : 'Applying psychological persona rewriting...'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAANG Polish Action */}
      <div>
        <button 
          onClick={handleFaangPolish}
          disabled={isPolishing}
          className="w-full relative overflow-hidden group bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-xl p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col items-start text-left">
            <span className="font-bold text-sm flex items-center gap-1.5 mb-0.5">
              <ShieldCheck className="w-4 h-4" /> 1-Click FAANG Polish
            </span>
            <span className="text-[10px] text-indigo-100 font-medium opacity-90">Auto-fix grammar, verbs, & ATS format</span>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-200 relative z-10 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-[#e5e5e5]"></div>

      {/* Tone Dial Engine */}
      <div>
        <h3 className="text-sm font-medium mb-3">Psychological Tone</h3>
        <div className="grid grid-cols-3 gap-2 bg-[#f9f9f9] p-1.5 rounded-xl border border-[#e5e5e5]">
          {['Standard', 'Aggressive', 'Analytical'].map(tone => (
            <button
              key={tone}
              onClick={() => handleToneShift(tone)}
              className={`py-1.5 px-1 text-[10px] font-medium rounded-lg transition-all ${activeTone === tone ? 'bg-white shadow-sm border border-gray-200 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full h-[1px] bg-[#e5e5e5]"></div>

      {/* Career Velocity Radar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Career Velocity</h3>
          <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">FAANG Benchmark</span>
        </div>
        <div className="w-full h-[200px] bg-gradient-to-br from-gray-50 to-white rounded-xl border border-[#e5e5e5] p-2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 600 }} />
              <Radar name="Resume" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="w-full h-[1px] bg-[#e5e5e5]"></div>

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

      {/* Visual Density Scorer */}
      <div>
        <h3 className="text-sm font-medium mb-3">Document Health</h3>
        <div className={`border rounded-xl p-4 ${calculateDensity().bg} border-${calculateDensity().color.split('-')[1]}-200`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Visual Density</span>
            <span className={`text-xs font-bold ${calculateDensity().color}`}>{calculateDensity().label}</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
            {calculateDensity().label === 'Overcrowded' 
              ? 'Your resume is too text-heavy. Recruiters prefer white space. Try shortening bullets.' 
              : 'Your resume has a great balance of text and white space for easy reading.'}
          </p>
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
