import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Code, Briefcase } from 'lucide-react';

export const CreativeMinimalist = ({ data }: { data: ResumeData }) => {
  return (
    <div className="w-full bg-white text-gray-800 font-sans shadow-lg mx-auto" style={{ minHeight: '1056px', maxWidth: '816px' }}>
      <div className="flex flex-col md:flex-row min-h-full">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gray-50 p-8 border-r border-gray-100 flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none mb-2">
              {data.personalInfo.fullName.split(' ')[0]}
              <br />
              {data.personalInfo.fullName.split(' ').slice(1).join(' ')}
            </h1>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Contact</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {data.personalInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              {data.personalInfo.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a href={data.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 truncate">
                    {data.personalInfo.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <a href={data.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 truncate">
                    {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {data.personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-400" />
                  <a href={data.personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 truncate">
                    {data.personalInfo.github.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {data.skills && data.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Expertise</h3>
              <div className="flex flex-col gap-4">
                {data.skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="text-xs font-bold text-gray-700 mb-1">{skill.category}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.items.map((item, i) => (
                        <span key={i} className="bg-white border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-600 shadow-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 p-8 flex flex-col gap-8">
          {(data.sectionOrder || ['summary', 'experience', 'projects', 'education']).map((sectionId) => {
            switch (sectionId) {
              case 'summary':
                return data.personalInfo.summary ? (
                  <section key="summary">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Profile</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data.personalInfo.summary}
                    </p>
                  </section>
                ) : null;
                
              case 'experience':
                return data.experience && data.experience.length > 0 ? (
                  <section key="experience">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Experience</h3>
                    <div className="space-y-6">
                      {data.experience.map((exp) => (
                        <div key={exp.id} className="relative">
                          <div className="absolute left-[-16px] top-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full hidden md:block" />
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-gray-900 text-base">{exp.position}</h4>
                            <span className="text-xs text-indigo-600 font-medium whitespace-nowrap bg-indigo-50 px-2 py-1 rounded">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-800 mb-2">{exp.company} | {exp.location}</div>
                          <ul className="list-none space-y-1.5">
                            {exp.description.map((desc, idx) => (
                              <li key={idx} className="text-sm text-gray-600 pl-4 relative">
                                <span className="absolute left-0 top-1.5 w-1 h-1 bg-gray-300 rounded-full" />
                                {desc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;

              case 'projects':
                return data.projects && data.projects.length > 0 ? (
                  <section key="projects">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Projects</h3>
                    <div className="grid grid-cols-1 gap-6">
                      {data.projects.map((proj) => (
                        <div key={proj.id} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="font-bold text-gray-900">{proj.name}</h4>
                            {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">View Project</a>}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{proj.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {proj.technologies.map((tech, idx) => (
                              <span key={idx} className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null;

              case 'education':
                return data.education && data.education.length > 0 ? (
                  <section key="education">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Education</h3>
                    <div className="space-y-4">
                      {data.education.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h4>
                          <div className="text-sm text-gray-600 flex justify-between mt-1">
                            <span>{edu.institution} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</span>
                            <span>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</span>
                          </div>
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
    </div>
  );
};
