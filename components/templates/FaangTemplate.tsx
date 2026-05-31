import React from 'react';
import { ResumeData } from '@/types/resume';
import { formatResumeDate } from '@/lib/formatDate';

import { useResumeStore } from '@/store/resumeStore';

interface FaangTemplateProps {
  data: ResumeData;
}

const HighlightText = ({ text }: { text: string }) => {
  const { atsViewMode, targetJobKeywords } = useResumeStore();
  
  if (!atsViewMode || !targetJobKeywords || !text) return <>{text}</>;

  const keywords = targetJobKeywords.split(',').map(k => k.trim()).filter(Boolean);
  if (keywords.length === 0) return <>{text}</>;

  // Simple string replacement for heatmap
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.some(k => k.toLowerCase() === part.toLowerCase())) {
          return <span key={i} className="bg-emerald-400/40 text-emerald-900 px-0.5 rounded shadow-sm">{part}</span>;
        }
        return part;
      })}
    </>
  );
};

export const FaangTemplate: React.FC<FaangTemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, projects, skills } = data;

  const sectionOrder = data.sectionOrder || ['education', 'experience', 'projects', 'skills'];

  const renderContactInfo = () => {
    return (
      <>
        <div className="flex flex-wrap justify-center items-center gap-1.5 text-[0.85rem] leading-snug">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span className="text-gray-400">|</span>}
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
          )}
        </div>
        {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
          <div className="flex flex-wrap justify-center items-center gap-1.5 text-[0.85rem] leading-snug mt-0.5">
            {personalInfo.linkedin && (
              <>
                <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn: {personalInfo.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}
                </a>
                {(personalInfo.github || personalInfo.website) && <span className="text-gray-400">|</span>}
              </>
            )}
            {personalInfo.github && (
              <>
                <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  GitHub: {personalInfo.github.replace(/https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')}
                </a>
                {personalInfo.website && <span className="text-gray-400">|</span>}
              </>
            )}
            {personalInfo.website && (
              <a href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Portfolio: {personalInfo.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            )}
          </div>
        )}
      </>
    );
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <h2 className="text-[1.1rem] uppercase tracking-wider font-semibold text-black border-b-[1px] border-black pb-0.5 mb-2 mt-4 font-sans">
      {title}
    </h2>
  );

  return (
    <div className="w-full h-full bg-white text-black text-[0.9rem] leading-snug p-8 font-sans" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <header className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-1 tracking-tight" style={{ fontVariant: 'small-caps' }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        {renderContactInfo()}
      </header>

      {/* Dynamic Sections */}
      {sectionOrder.map((sectionId) => {
        switch (sectionId) {
          case 'summary':
            return personalInfo.summary ? (
              <div 
                key="summary" 
                id="preview-summary"
                className="mb-4 text-justify cursor-pointer hover:bg-black/5 rounded transition-colors"
                onClick={() => document.getElementById('editor-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              >
                <HighlightText text={personalInfo.summary} />
              </div>
            ) : null;

          case 'education':
            return education && education.length > 0 ? (
              <div key="education">
                <SectionTitle title="Education" />
                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline font-bold">
                        <span className="text-[1rem]">{edu.institution}</span>
                        <span className="text-[0.85rem] font-normal whitespace-nowrap">
                          {formatResumeDate(edu.startDate)} - {edu.current ? 'Present' : formatResumeDate(edu.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mt-0.5">
                        <span className="italic">{edu.degree} in {edu.fieldOfStudy}</span>
                        {edu.gpa && <span className="text-[0.85rem] font-normal italic">CGPA: {edu.gpa}*</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          case 'experience':
            return experience && experience.length > 0 ? (
              <div 
                key="experience" 
                id="preview-experience"
                className="cursor-pointer hover:bg-black/5 rounded p-1 -m-1 transition-colors"
                onClick={() => document.getElementById('editor-experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <SectionTitle title="Experience" />
                <div className="space-y-4">
                  {experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline font-bold">
                        <span>{exp.position} | {exp.company}</span>
                        <span className="text-[0.85rem] font-normal whitespace-nowrap">
                          {formatResumeDate(exp.startDate)} - {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="italic text-[0.85rem] mt-0.5">{exp.location}</div>
                      )}
                      {exp.description && exp.description.length > 0 && (
                        <ul className="list-disc ml-5 mt-1.5 space-y-1 text-[0.85rem] text-justify">
                          {exp.description.map((desc, i) => (
                            <li key={i}><HighlightText text={desc} /></li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          case 'projects':
            return projects && projects.length > 0 ? (
              <div 
                key="projects" 
                id="preview-projects"
                className="cursor-pointer hover:bg-black/5 rounded p-1 -m-1 transition-colors"
                onClick={() => document.getElementById('editor-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <SectionTitle title="Projects" />
                <div className="space-y-3">
                  {projects.map((proj, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold">
                          {proj.name}
                          {proj.url && (
                            <span className="font-normal text-[0.85rem]">
                              {' - '}
                              <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline underline underline-offset-2">
                                Github Link
                              </a>
                            </span>
                          )}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span className="font-normal italic text-[0.85rem]"> | {proj.technologies.join(', ')}</span>
                          )}
                        </span>
                        <span className="text-[0.85rem] whitespace-nowrap">
                          {proj.startDate && (
                            <>
                              {formatResumeDate(proj.startDate)} - {proj.current ? 'Present' : formatResumeDate(proj.endDate)}
                            </>
                          )}
                        </span>
                      </div>
                      {proj.description && (
                        <ul className="list-disc ml-5 mt-1.5 space-y-1 text-[0.85rem] text-justify">
                          {(Array.isArray(proj.description) ? proj.description : typeof proj.description === 'string' ? proj.description.split('\n') : []).filter(Boolean).map((desc, i) => (
                            <li key={i}><HighlightText text={String(desc).replace(/^- /, '')} /></li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          case 'skills':
            return skills && skills.length > 0 ? (
              <div 
                key="skills" 
                id="preview-skills"
                className="cursor-pointer hover:bg-black/5 rounded p-1 -m-1 transition-colors"
                onClick={() => document.getElementById('editor-skills')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <SectionTitle title="Technical Skills" />
                <div className="space-y-1 text-[0.9rem]">
                  {skills.map((skillGroup, idx) => (
                    <div key={idx} className="flex">
                      <span className="font-bold w-[20%] min-w-[120px]">{skillGroup.category}:</span>
                      <span className="flex-1"><HighlightText text={skillGroup.items.join(', ')} /></span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
};
