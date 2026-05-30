import { ResumeData } from '@/types/resume';
import { Code, Globe, Mail, MapPin, Phone, Briefcase } from 'lucide-react';

export function TechMinimalist({ data }: { data: ResumeData }) {
  return (
    <div className="w-full h-fit min-h-[1123px] bg-white text-gray-900 p-8 shadow-2xl font-mono text-[11px]" style={{ maxWidth: '816px', margin: '0 auto' }}>
      <header className="mb-6 flex justify-between items-end border-b-2 border-gray-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 uppercase">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="text-[13px] font-semibold text-gray-600">Software Engineer</div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          {data.personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {data.personalInfo.email}</div>}
          {data.personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {data.personalInfo.phone}</div>}
          {data.personalInfo.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {data.personalInfo.location}</div>}
          
          <div className="flex gap-4 mt-1">
            {data.personalInfo.github && <a href={data.personalInfo.github} className="flex items-center gap-1 hover:underline"><Code className="w-3 h-3" /> GitHub</a>}
            {data.personalInfo.linkedin && <a href={data.personalInfo.linkedin} className="flex items-center gap-1 hover:underline"><Briefcase className="w-3 h-3" /> LinkedIn</a>}
            {data.personalInfo.website && <a href={data.personalInfo.website} className="flex items-center gap-1 hover:underline"><Globe className="w-3 h-3" /> Portfolio</a>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Experience and Projects */}
        <div className="md:col-span-8 space-y-6">
          {(data.experience || []).length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 mb-3 border-l-4 border-gray-900">
                Experience
              </h2>
              <div className="space-y-4">
                {(data.experience || []).map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-[13px]">{exp.position}</h3>
                      <span className="text-[11px] text-gray-500 bg-gray-50 px-1 rounded">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[12px] font-semibold text-gray-700 mb-2">{exp.company} • {exp.location}</div>
                    <ul className="list-square list-outside ml-4 space-y-1 text-[11px] text-gray-800">
                      {(exp.description || []).map((item, i) => (
                        <li key={i} className="leading-relaxed pl-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(data.projects || []).length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 mb-3 border-l-4 border-gray-900">
                Open Source & Projects
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {(data.projects || []).map((proj, index) => (
                  <div key={index} className="border border-gray-200 p-3 rounded-sm bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[13px]">{proj.name}</h3>
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            <Code className="w-3.5 h-3.5 inline" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-700 mb-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(proj.technologies || []).map((tech, i) => (
                        <span key={i} className="text-[10px] bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded-sm font-bold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Skills and Education */}
        <div className="md:col-span-4 space-y-6">
          {(data.skills || []).length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 mb-3 border-l-4 border-gray-900">
                Tech Stack
              </h2>
              <div className="space-y-3">
                {(data.skills || []).map((skill, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="font-bold text-gray-900 mb-1 border-b border-gray-200 pb-0.5">{skill.category}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(skill.items || []).map((item, i) => (
                        <span key={i} className="text-[10px] bg-white border border-gray-300 text-gray-700 px-1.5 py-0.5 rounded-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(data.education || []).length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 mb-3 border-l-4 border-gray-900">
                Education
              </h2>
              <div className="space-y-4">
                {(data.education || []).map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-[12px]">{edu.degree}</h3>
                    <div className="text-[11px] text-gray-600 mb-1">{edu.fieldOfStudy}</div>
                    <div className="font-semibold text-gray-800 mb-1">{edu.institution}</div>
                    <div className="text-[10px] text-gray-500">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                    {edu.gpa && <div className="text-[10px] font-bold mt-0.5">GPA: {edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
