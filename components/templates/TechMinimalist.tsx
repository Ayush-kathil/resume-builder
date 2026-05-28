import { ResumeData } from '@/types/resume';

export function TechMinimalist({ data }: { data: ResumeData }) {
  return (
    <div 
      className="w-full h-fit min-h-[1123px] bg-white text-gray-900 p-8 shadow-2xl"
      style={{ fontFamily: "Inter, Roboto, sans-serif" }}
    >
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          {data.personalInfo.email && <span className="font-mono">{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="font-mono">• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          {data.projects.find(p => p.url) && data.projects.filter(p => p.url).map((p, i) => (
            <a key={i} href={p.url} className="text-blue-600 hover:underline font-mono" target="_blank" rel="noopener noreferrer">
              • {p.url?.toLowerCase().includes('github') ? 'github' : p.url?.toLowerCase().includes('linkedin') ? 'linkedin' : 'link'}
            </a>
          ))}
        </div>
      </header>

      {data.personalInfo.summary && (
        <section className="mb-3">
          <p className="text-xs leading-relaxed">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">
            Skills
          </h2>
          <div className="text-xs space-y-0.5">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex">
                <span className="font-bold w-[120px] flex-shrink-0">{skill.category}:</span>
                <span className="font-mono text-[11px] text-gray-700">{skill.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">
            Experience
          </h2>
          <div className="space-y-2.5">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[13px] font-bold">{exp.position}</span>
                    <span className="text-[12px] text-gray-600 ml-2">at {exp.company}</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate} | {exp.location}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 mt-0.5 text-[12px] space-y-0.5">
                  {exp.description.map((item, i) => (
                    <li key={i} className="leading-snug pl-0.5">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">
            Projects
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj, index) => (
              <div key={index}>
                <div className="flex items-baseline">
                  <span className="text-[13px] font-bold">{proj.name}</span>
                  {proj.technologies.length > 0 && (
                    <span className="text-[11px] font-mono text-gray-500 ml-2">
                      [{proj.technologies.join(', ')}]
                    </span>
                  )}
                </div>
                <ul className="list-disc list-outside ml-4 mt-0.5 text-[12px]">
                  <li className="leading-snug pl-0.5">{proj.description}</li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-300 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-1.5">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <span className="text-[13px] font-bold">{edu.institution}</span>
                  <span className="text-[12px] text-gray-600 ml-2">
                    {edu.degree} in {edu.fieldOfStudy} {edu.gpa && <span className="font-mono text-[11px] ml-1">GPA: {edu.gpa}</span>}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-gray-500">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate} | {edu.location}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
