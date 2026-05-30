import { ResumeData } from '@/types/resume';

export function ModernExecutive({ data }: { data: ResumeData }) {
  return (
    <div 
      className="w-full h-fit min-h-[1123px] bg-white text-gray-800 p-10 shadow-2xl font-sans"
    >
      <header className="pb-6 mb-6 text-left border-b-2 border-indigo-600">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        </div>
        {(data.projects || []).find(p => p.url) && (
          <div className="flex gap-4 text-sm font-medium mt-3">
            {(data.projects || []).filter(p => p.url).map((p, i) => (
              <a key={i} href={p.url} className="text-indigo-600 hover:text-indigo-800 transition-colors" target="_blank" rel="noopener noreferrer">
                {p.url?.toLowerCase().includes('github') ? 'GitHub' : p.url?.toLowerCase().includes('linkedin') ? 'LinkedIn' : 'Portfolio'}
              </a>
            ))}
          </div>
        )}
      </header>

      {data.personalInfo.summary && (
        <section className="mb-6">
          <p className="text-sm leading-relaxed text-gray-700">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {(data.skills || []).length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 mb-3">
            Core Competencies
          </h2>
          <div className="text-sm space-y-1.5">
            {(data.skills || []).map((skill, index) => (
              <div key={index} className="flex">
                <span className="font-semibold text-gray-900 w-1/4 flex-shrink-0">{skill.category}</span>
                <span className="text-gray-700">{(skill.items || []).join(' • ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(data.experience || []).length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 mb-4">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {(data.experience || []).map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-[15px] font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-[13px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[14px] font-medium text-gray-700">{exp.company}</span>
                  <span className="text-[13px] text-gray-500">{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 text-[13.5px] text-gray-700 space-y-1.5">
                  {(exp.description || []).map((item, i) => (
                    <li key={i} className="leading-snug pl-1">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {(data.projects || []).length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 mb-4">
            Key Projects
          </h2>
          <div className="space-y-4">
            {(data.projects || []).map((proj, index) => (
              <div key={index}>
                <div className="mb-1">
                  <h3 className="text-[15px] font-bold text-gray-900 inline">{proj.name}</h3>
                  {(proj.technologies || []).length > 0 && (
                    <span className="text-[13px] font-medium text-gray-500 ml-2">
                      | {(proj.technologies || []).join(', ')}
                    </span>
                  )}
                </div>
                <ul className="list-disc list-outside ml-4 text-[13.5px] text-gray-700">
                  <li className="leading-snug pl-1">{proj.description}</li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {(data.education || []).length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 mb-4">
            Education
          </h2>
          <div className="space-y-3">
            {(data.education || []).map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900">{edu.institution}</h3>
                  <div className="text-[14px] text-gray-700">
                    {edu.degree} in {edu.fieldOfStudy} {edu.gpa && <span className="font-medium text-indigo-600 ml-1">• GPA: {edu.gpa}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-gray-600">
                    {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                  </div>
                  <div className="text-[13px] text-gray-500">{edu.location}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
