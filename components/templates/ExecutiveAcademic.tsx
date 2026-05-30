import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Code, Briefcase } from 'lucide-react';
import { formatResumeDate } from '@/lib/formatDate';

export const ExecutiveAcademic = ({ data }: { data: ResumeData }) => {
  return (
    <div className="w-full bg-white text-gray-900 shadow-lg mx-auto p-12" style={{ minHeight: '1056px', maxWidth: '816px', fontFamily: '"Times New Roman", Times, serif' }}>
      
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-6 mb-6 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">{data.personalInfo.fullName}</h1>
        {data.personalInfo.summary && <h2 className="text-xl italic text-gray-700 mb-4">{data.personalInfo.summary.substring(0, 50)}...</h2>}
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{data.personalInfo.location}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700 mt-2">
          {data.personalInfo.website && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {data.personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.personalInfo.github && (
            <div className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {data.personalInfo.github.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-8">
        {(data.sectionOrder || ['summary', 'experience', 'education', 'projects', 'skills']).map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return data.personalInfo.summary ? (
                <section key="summary">
                  <h3 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Executive Summary</h3>
                  <p className="text-[15px] leading-relaxed text-justify">
                    {data.personalInfo.summary}
                  </p>
                </section>
              ) : null;
              
            case 'experience':
              return data.experience && data.experience.length > 0 ? (
                <section key="experience">
                  <h3 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">Professional Experience</h3>
                  <div className="space-y-6">
                    {data.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-[16px]">{exp.position}</h4>
                          <span className="text-sm italic">
                            {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline mb-3 text-sm">
                          <span className="font-semibold text-gray-800">{exp.company}</span>
                          <span className="text-gray-600">{exp.location}</span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1.5">
                          {exp.description.map((desc, idx) => (
                            <li key={idx} className="text-[14px] leading-relaxed text-justify pl-1">
                              {desc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'education':
              return data.education && data.education.length > 0 ? (
                <section key="education">
                  <h3 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">Education & Academic Background</h3>
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-[15px]">{edu.degree} in {edu.fieldOfStudy}</h4>
                          <span className="text-sm italic">{formatResumeDate(edu.startDate)} - {edu.current ? 'Present' : formatResumeDate(edu.endDate)}</span>
                        </div>
                        <div className="text-[15px] text-gray-800 mt-1">{edu.institution} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'projects':
              return data.projects && data.projects.length > 0 ? (
                <section key="projects">
                  <h3 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">Selected Publications & Projects</h3>
                  <div className="space-y-5">
                    {data.projects.map((proj) => (
                      <div key={proj.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-[15px]">{proj.name}</h4>
                          {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-sm italic text-blue-800 hover:underline">Link</a>}
                        </div>
                        <p className="text-[14px] leading-relaxed text-justify mb-1.5">{proj.description}</p>
                        <div className="text-sm text-gray-700 italic">
                          Keywords: {proj.technologies.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            case 'skills':
              return data.skills && data.skills.length > 0 ? (
                <section key="skills">
                  <h3 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-4">Core Competencies</h3>
                  <div className="text-[14px] leading-relaxed space-y-2">
                    {data.skills.map((skill, idx) => (
                      <div key={idx}>
                        <span className="font-bold">{skill.category}: </span>
                        <span>{skill.items.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

            default: return null;
          }
        })}
      </div>
    </div>
  );
};
