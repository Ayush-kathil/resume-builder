import React from 'react';
import { ResumeData } from '@/types/resume';
import { formatResumeDate } from '@/lib/formatDate';
import { MapPin, Mail, Phone, Globe, Github, Linkedin } from 'lucide-react';

interface FaangTemplateProps {
  data: ResumeData;
}

export const FaangTemplate: React.FC<FaangTemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, projects, skills } = data;

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
    <h2 className="text-[1.1rem] uppercase tracking-wider font-semibold text-black border-b-[1px] border-black pb-0.5 mb-2 mt-4 font-serif">
      {title}
    </h2>
  );

  return (
    <div className="w-full h-full bg-white text-black text-[0.9rem] leading-snug p-8 font-serif" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
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
              <div key="summary" className="mb-4 text-justify">
                {personalInfo.summary}
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
              <div key="experience">
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
                            <li key={i}>{desc}</li>
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
              <div key="projects">
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
                          {formatResumeDate(proj.startDate)} - {proj.current ? 'Present' : formatResumeDate(proj.endDate)}
                        </span>
                      </div>
                      {proj.description && (
                        <ul className="list-disc ml-5 mt-1.5 space-y-1 text-[0.85rem] text-justify">
                          {(Array.isArray(proj.description) ? proj.description : typeof proj.description === 'string' ? proj.description.split('\n') : []).filter(Boolean).map((desc, i) => (
                            <li key={i}>{String(desc).replace(/^- /, '')}</li>
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
              <div key="skills">
                <SectionTitle title="Technical Skills" />
                <div className="space-y-1 text-[0.9rem]">
                  {skills.map((skillGroup, idx) => (
                    <div key={idx} className="flex">
                      <span className="font-bold w-[20%] min-w-[120px]">{skillGroup.category}:</span>
                      <span className="flex-1">{skillGroup.items.join(', ')}</span>
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
