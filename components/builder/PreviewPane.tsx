'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilLine, ScanSearch, FileText, Download, Code } from 'lucide-react';
import { exportToDocx } from '@/lib/exportDocx';
// PDF Renderer removed

export function PreviewPane() {
  const { data, isEditing, atsViewMode, setAtsViewMode, themeConfig, targetJobDescription, setTargetJobDescription } = useResumeStore();
  const [rawAtsMode, setRawAtsMode] = useState(false);
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
    const order = data.sectionOrder || ['summary', 'education', 'achievements', 'projects', 'experience', 'responsibilities', 'skills'];

    if (rawAtsMode) {
      // Pure, unstyled ATS extraction output
      const rawText = JSON.stringify(data, null, 2);
      return (
        <div className="w-full min-h-[1131px] bg-white text-black p-10 font-mono text-xs whitespace-pre-wrap">
          {`--- ATS PARSER EXTRACTION PREVIEW ---\n\n`}
          {data.personalInfo.fullName}\n
          {data.personalInfo.email} | {data.personalInfo.phone}\n\n
          {order.map(section => {
            if (section === 'summary' && data.personalInfo.summary) return `SUMMARY\n${data.personalInfo.summary}\n\n`;
            if (section === 'education' && data.education.length) return `EDUCATION\n${data.education.map(e => `${e.institution} - ${e.degree}\n`).join('')}\n`;
            if (section === 'experience' && data.experience.length) return `EXPERIENCE\n${data.experience.map(e => `${e.company} - ${e.position}\n${e.description.join('\n')}\n`).join('\n')}\n`;
            if (section === 'skills' && data.skills.length) return `SKILLS\n${data.skills.map(s => `${s.category}: ${s.items.join(', ')}\n`).join('')}\n`;
            return '';
          }).join('')}
          {`\n--- RAW JSON DATA ---\n${rawText}`}
        </div>
      );
    }

    return (
      <div className={`w-full min-h-[1131px] bg-white text-black py-8 px-10 flex flex-col ${themeConfig.fontFamily === 'sans' ? 'font-sans' : 'font-serif'}`}>
        {/* Header */}
        <div className="text-center mb-4 border-b-2 pb-2" style={{ borderColor: themeConfig.accentColor }}>
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-1" style={{ color: themeConfig.accentColor }}>{data.personalInfo.fullName || "YOUR NAME"}</h1>
          <div className="flex justify-center flex-wrap gap-1 text-[11px] text-gray-800">
            {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="text-blue-600 hover:underline">{data.personalInfo.email}</a>}
            {(data.personalInfo.email && (data.personalInfo.phone || data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website)) && <span>|</span>}
            
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {(data.personalInfo.phone && (data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website)) && <span>|</span>}
            
            {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>}
            {(data.personalInfo.linkedin && (data.personalInfo.github || data.personalInfo.website)) && <span>|</span>}
            
            {data.personalInfo.github && <a href={data.personalInfo.github} className="text-blue-600 hover:underline">GitHub</a>}
            {(data.personalInfo.github && data.personalInfo.website) && <span>|</span>}
            
            {data.personalInfo.website && <a href={data.personalInfo.website} className="text-blue-600 hover:underline">Portfolio</a>}
          </div>
        </div>

        {/* Dynamic Sections */}
        <AnimatePresence>
          {order.map((sectionId) => {
            if (sectionId === 'summary' && data.personalInfo.summary) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="summary" className="mb-3">
                  <p className="text-justify text-[11px] leading-relaxed">{processATS(data.personalInfo.summary)}</p>
                </motion.div>
              );
            }
            if (sectionId === 'education' && data.education.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="education" className="mb-3">
                  <h2 className="text-[12px] font-bold uppercase border-b mb-1.5 pb-0.5" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Education</h2>
                  {data.education.map(edu => (
                    <div key={edu.id} className="mb-1.5">
                      <div className="flex justify-between items-baseline font-bold text-[11px]">
                        <span>{edu.institution}</span>
                        <span className="font-normal">{edu.location}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-[11px] text-gray-800">
                        <span>{edu.degree} in {edu.fieldOfStudy} {edu.gpa && <span className="font-bold text-black"> CGPA: {edu.gpa}</span>}</span>
                        <span>{edu.startDate} - {edu.endDate}</span>
                      </div>
                      {edu.coursework && (
                        <div className="text-[11px]"><span className="font-bold">Relevant Coursework:</span> {edu.coursework}</div>
                      )}
                    </div>
                  ))}
                </motion.div>
              );
            }
            if (sectionId === 'achievements' && data.achievements && data.achievements.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="achievements" className="mb-3">
                  <h2 className="text-[12px] font-bold uppercase border-b mb-1.5 pb-0.5" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Achievements</h2>
                  <ul className="list-disc pl-5 space-y-0.5 text-[11px] leading-snug">
                    {data.achievements.map((achieve, i) => <li key={i}>{processATS(achieve)}</li>)}
                  </ul>
                </motion.div>
              );
            }
            if (sectionId === 'projects' && data.projects.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="projects" className="mb-3">
                  <h2 className="text-[12px] font-bold uppercase border-b mb-1.5 pb-0.5" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Projects</h2>
                  {data.projects.map(proj => (
                    <div key={proj.id} className="mb-2">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <div className="font-bold">
                          {proj.name}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span className="font-normal italic"> | {proj.technologies.join(", ")}</span>
                          )}
                        </div>
                        {proj.url && <a href={proj.url} className="text-blue-600 hover:underline font-normal">[GitHub]</a>}
                      </div>
                      <ul className="list-disc pl-5 space-y-0.5 text-[11px] leading-snug">
                        {proj.description.map((desc, i) => <li key={i}>{processATS(desc)}</li>)}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              );
            }
            if (sectionId === 'experience' && data.experience.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="experience" className="mb-3">
                  <h2 className="text-[12px] font-bold uppercase border-b mb-1.5 pb-0.5" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Experience</h2>
                  {data.experience.map(exp => (
                    <div key={exp.id} className="mb-2">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <span className="font-bold">{exp.position} | {exp.company}</span>
                        <span>{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-0.5 text-[11px] leading-snug">
                        {exp.description.map((desc, i) => <li key={i}>{processATS(desc)}</li>)}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              );
            }
            if (sectionId === 'responsibilities' && data.responsibilities && data.responsibilities.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="responsibilities" className="mb-3">
                  <h2 className="text-[12px] font-bold uppercase border-b mb-1.5 pb-0.5" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Position of Responsibility</h2>
                  {data.responsibilities.map(resp => (
                    <div key={resp.id} className="mb-2">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <span className="font-bold">{resp.position} | {resp.company}</span>
                        <span>{resp.startDate}</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-0.5 text-[11px] leading-snug">
                        {resp.description.map((desc, i) => <li key={i}>{processATS(desc)}</li>)}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              );
            }
            if (sectionId === 'skills' && data.skills.length > 0) {
              return (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="skills" className="mb-3">
                  <h2 className="text-[12px] font-bold uppercase border-b mb-1.5 pb-0.5" style={{ borderColor: themeConfig.accentColor, color: themeConfig.accentColor }}>Skills</h2>
                  <div className="space-y-0.5 w-full">
                    {data.skills.map(skill => (
                      <div key={skill.id} className="flex text-[11px] leading-snug">
                        <div className="font-bold w-[130px] flex-shrink-0">{skill.category}:</div>
                        <div>{skill.items.join(", ")}</div>
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
    <div className="w-full h-full bg-[#F2F1ED] p-4 md:p-8 overflow-auto relative print-container custom-scrollbar pb-32">
      
      {/* Floating Formatting Toolbar */}
      <div className="sticky top-0 z-20 w-max mx-auto mb-8 bg-white border border-[#e5e5e5] rounded-full shadow-md px-4 py-2 flex items-center gap-2 text-gray-600 print:hidden transition-all">
        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors tooltip" title="Bold"><strong className="font-serif">B</strong></button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors tooltip" title="Italic"><em className="font-serif">I</em></button>
        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors tooltip" title="Underline"><span className="underline font-serif">U</span></button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
        <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors tooltip text-xs flex gap-1 items-center" title="Text Color">
          <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: themeConfig.accentColor }}></span>
        </button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
        <button 
          onClick={() => setAtsViewMode(!atsViewMode)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${atsViewMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <ScanSearch className="w-3.5 h-3.5" />
          {atsViewMode ? 'Pro-Score ON' : 'Pro-Score OFF'}
        </button>
        <button 
          onClick={() => setRawAtsMode(!rawAtsMode)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${rawAtsMode ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <Code className="w-3.5 h-3.5" />
          {rawAtsMode ? 'Raw ATS ON' : 'Raw ATS OFF'}
        </button>
        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
        <button 
          onClick={() => exportToDocx(data)}
          className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          DOCX
        </button>
      </div>

      {/* Resume Paper (A4) */}
      <div 
        ref={resumeRef}
        id="resume-preview"
        className="mx-auto w-[800px] min-w-[800px] transition-all duration-300 print:min-w-0 print:max-w-none print:w-full print:p-0 print:shadow-none print:bg-white relative shadow-2xl"
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
