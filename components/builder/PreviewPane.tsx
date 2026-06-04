'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilLine, ScanSearch, FileText } from 'lucide-react';
// PDF Renderer removed

export function PreviewPane() {
  const { data, isEditing, atsViewMode, setAtsViewMode, themeConfig, targetJobDescription, setTargetJobDescription } = useResumeStore();
  const resumeRef = useRef<HTMLDivElement>(null);

  // Simple Density Analyzer
  const calculateDensity = () => {
    const textStr = JSON.stringify(data);
    if (textStr.length < 2000) return { label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (textStr.length < 4000) return { label: 'Excellent', color: 'text-blue-500', bg: 'bg-blue-50' };
    return { label: 'Overcrowded', color: 'text-red-500', bg: 'bg-red-50' };
  };

  const density = calculateDensity();

  const calculateATSScore = () => {
    const jd = targetJobDescription.toLowerCase();
    if (!jd) return null;
    
    // Very basic keyword extractor (ignore common stop words)
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
    return { score, missing: missing.slice(0, 8) };
  };

  const atsScoreData = calculateATSScore();

  const processATS = (text: string) => {
    if (!atsViewMode) return <>{text}</>;
    
    let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Highlight metrics (green)
    escaped = escaped.replace(/(\$?\d+(?:,\d{3})*(?:\.\d+)?(?:[KkMmBb]|\+)?%?)/g, '<span class="bg-green-100 text-green-800 px-0.5 rounded font-bold border-b border-green-500" title="Quantifiable Metric (Good!)">$1</span>');
    
    // Highlight weak verbs (red)
    escaped = escaped.replace(/\b(helped|worked on|assisted|participated|was responsible for|did|made|handled|supported)\b/gi, '<span class="bg-red-100 text-red-800 px-0.5 rounded font-bold border-b border-red-500" title="Weak Action Verb - Upgrade this!">$&</span>');
    
    // Highlight strong verbs (blue)
    escaped = escaped.replace(/\b(architected|spearheaded|engineered|optimized|designed|developed|implemented|managed|led|directed|delivered|reduced|increased|pioneered|orchestrated)\b/gi, '<span class="bg-blue-100 text-blue-800 px-0.5 rounded font-bold border-b border-blue-500" title="Strong FAANG Action Verb">$&</span>');

    return <span dangerouslySetInnerHTML={{ __html: escaped }} />;
  };

  const renderTemplate = () => {
    return (
      <div className={`w-full min-h-[1131px] bg-white text-black p-10 text-sm flex flex-col ${themeConfig.fontFamily === 'sans' ? 'font-sans' : 'font-serif'}`}>
        {/* Header */}
        <div className="text-center mb-6 border-b-2 pb-4" style={{ borderColor: themeConfig.accentColor }}>
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2" style={{ color: themeConfig.accentColor }}>{data.personalInfo.fullName || "YOUR NAME"}</h1>
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
            {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
            {data.personalInfo.github && <span>• {data.personalInfo.github}</span>}
          </div>
        </div>

        {/* Dynamic Sections */}
        <AnimatePresence>
          {(data.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills']).map((sectionId) => {
            if (sectionId === 'summary' && data.personalInfo.summary) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="summary" className="mb-4">
                  <p className="text-justify leading-relaxed">{processATS(data.personalInfo.summary)}</p>
                </motion.div>
              );
            }
            if (sectionId === 'experience' && data.experience.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="experience" className="mb-4">
                  <h2 className="text-lg font-bold uppercase border-b mb-2 pb-1" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Experience</h2>
                  {data.experience.map(exp => (
                    <div key={exp.id} className="mb-3">
                      <div className="flex justify-between items-baseline font-bold">
                        <span>{exp.company}</span>
                        <span className="text-xs font-normal">{exp.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline italic text-gray-800 mb-1">
                        <span>{exp.position}</span>
                        <span className="text-xs font-normal not-italic">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-[13px] leading-snug">
                        {exp.description.map((desc, i) => <li key={i}>{processATS(desc)}</li>)}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              );
            }
            if (sectionId === 'education' && data.education.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="education" className="mb-4">
                  <h2 className="text-lg font-bold uppercase border-b mb-2 pb-1" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Education</h2>
                  {data.education.map(edu => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between items-baseline font-bold">
                        <span>{edu.institution}</span>
                        <span className="text-xs font-normal">{edu.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-gray-800">
                        <span>{edu.degree} in {edu.fieldOfStudy}</span>
                        <span className="text-xs">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      {edu.gpa && <div className="text-[13px] text-gray-600">GPA: {edu.gpa}</div>}
                    </div>
                  ))}
                </motion.div>
              );
            }
            if (sectionId === 'projects' && data.projects.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="projects" className="mb-4">
                  <h2 className="text-lg font-bold uppercase border-b mb-2 pb-1" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Projects</h2>
                  {data.projects.map(proj => (
                    <div key={proj.id} className="mb-2">
                      <div className="font-bold flex items-center gap-2">
                        {proj.name}
                        {proj.url && <span className="text-xs font-normal text-blue-600 underline">{proj.url}</span>}
                      </div>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="text-xs italic text-gray-600 mb-1">Technologies: {proj.technologies.join(", ")}</div>
                      )}
                      <ul className="list-disc pl-5 space-y-1 text-[13px] leading-snug">
                        {proj.description.map((desc, i) => <li key={i}>{processATS(desc)}</li>)}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              );
            }
            if (sectionId === 'skills' && data.skills.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="skills" className="mb-4">
                  <h2 className="text-lg font-bold uppercase border-b mb-2 pb-1" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Skills</h2>
                  <div className="space-y-1">
                    {data.skills.map(skill => (
                      <div key={skill.id} className="text-[13px] leading-snug">
                        <span className="font-bold">{skill.category}:</span> {skill.items.join(", ")}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#f9f9f9] border-l border-[#e5e5e5] p-8 flex flex-col items-center overflow-y-auto relative print-container custom-scrollbar">
      
      {/* Preview Header / Tools */}
      <div className="w-full max-w-[800px] flex flex-col gap-4 mb-6 print:hidden">
        <div className="flex flex-col bg-white p-4 rounded-2xl border border-[#e5e5e5] shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              
              {/* Density Analyzer */}
              <div className="flex items-center gap-2 text-xs font-medium border-r border-[#e5e5e5] pr-6">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Density:</span>
                <span className={`${density.color} ${density.bg} px-2 py-1 rounded-full`}>{density.label}</span>
              </div>

              {/* Accent Color Picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Accent:</span>
                <div className="flex items-center gap-1.5">
                  {['#000000', '#2563EB', '#10B981', '#8B5CF6', '#F59E0B'].map(color => (
                    <button
                      key={color}
                      onClick={() => useResumeStore.getState().setThemeConfig({ accentColor: color })}
                      className={`w-5 h-5 rounded-full transition-transform ${useResumeStore.getState().themeConfig.accentColor === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Typography Selector */}
              <div className="flex items-center gap-2 border-l border-[#e5e5e5] pl-6">
                <span className="text-xs font-medium text-gray-500">Font:</span>
                <select
                  value={useResumeStore.getState().themeConfig.fontFamily}
                  onChange={(e) => useResumeStore.getState().setThemeConfig({ fontFamily: e.target.value as 'serif' | 'sans' })}
                  className="text-xs border border-[#e5e5e5] rounded-md px-2 py-1 bg-white text-[#1a1a1a] focus:outline-none"
                >
                  <option value="serif">Classic Serif</option>
                  <option value="sans">Modern Sans</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setAtsViewMode(!atsViewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                atsViewMode 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-inner' 
                  : 'bg-[#f9f9f9] text-gray-600 border border-[#e5e5e5] hover:bg-[#e5e5e5]'
              }`}
            >
              <ScanSearch className="w-4 h-4" />
              {atsViewMode ? 'FAANG Pro-Score Active' : 'Enable FAANG Pro-Score'}
            </button>
          </div>
          
          <AnimatePresence>
            {atsViewMode && (
              <motion.div 
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden border-t border-[#e5e5e5]"
              >
                <div className="pt-4 flex gap-6">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Target Job Description (JD Matcher)</label>
                    <textarea 
                      className="w-full h-24 bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg p-3 text-xs text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none transition-all custom-scrollbar"
                      placeholder="Paste the FAANG Job Description here to get a match score and missing keywords..."
                      value={targetJobDescription}
                      onChange={(e) => setTargetJobDescription(e.target.value)}
                    />
                  </div>
                  
                  {targetJobDescription.trim().length > 20 && atsScoreData && (
                    <div className="w-[200px] flex flex-col justify-center items-center bg-[#f9f9f9] rounded-xl border border-[#e5e5e5] p-4">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ATS Match Score</div>
                      <div className={`text-4xl font-bold ${atsScoreData.score > 75 ? 'text-emerald-500' : atsScoreData.score > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {atsScoreData.score}%
                      </div>
                      {atsScoreData.missing.length > 0 && (
                        <div className="mt-2 text-center w-full">
                          <div className="text-[10px] text-gray-500 mb-1">Missing Keywords:</div>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {atsScoreData.missing.map((w, i) => (
                              <span key={i} className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-100 border border-green-500 block"></span> <span className="text-gray-600 font-medium">Impact Metrics (Quantified)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500 block"></span> <span className="text-gray-600 font-medium">Strong FAANG Verbs</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-500 block"></span> <span className="text-gray-600 font-medium">Weak Action Verbs</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Resume Paper (A4) */}
      <div 
        ref={resumeRef}
        id="resume-preview"
        className="w-full max-w-[800px] transition-all duration-300 print:max-w-none print:w-full print:p-0 print:shadow-none print:bg-white relative shadow-2xl"
      >
        {renderTemplate()}

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-sm"
            >
              <motion.div
                animate={{ 
                  x: [0, 20, -20, 15, -15, 0],
                  y: [0, -10, -5, 10, 5, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="bg-purple-600 p-4 rounded-full shadow-2xl shadow-purple-500/50 text-white"
              >
                <PencilLine className="h-8 w-8" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
