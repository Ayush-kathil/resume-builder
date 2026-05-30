import { ResumeData } from '@/types/resume';
import { formatResumeDate } from '@/lib/formatDate';

export function ClassicATS({ data }: { data: ResumeData }) {
  return (
    <div 
      className="w-full h-fit min-h-[1123px] bg-white text-black p-10 shadow-2xl font-serif"
    >
      <header className="border-b-[1.5px] border-black pb-4 mb-4 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-center mb-4 text-black">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-2 text-[13px]">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
          <div className="flex justify-center gap-3 text-[13px] mt-1">
            {data.personalInfo.linkedin && (
              <a href={data.personalInfo.linkedin} className="text-black hover:underline" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {data.personalInfo.linkedin && (data.personalInfo.github || data.personalInfo.website) && <span>•</span>}
            {data.personalInfo.github && (
              <a href={data.personalInfo.github} className="text-black hover:underline" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {data.personalInfo.github && data.personalInfo.website && <span>•</span>}
            {data.personalInfo.website && (
              <a href={data.personalInfo.website} className="text-black hover:underline" target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            )}
          </div>
        )}
      </header>

      {(data.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills']).map((sectionId) => {
        switch (sectionId) {
          case 'summary':
            return data.personalInfo.summary ? (
              <section key="summary" className="mb-4">
                <p className="text-[13px] leading-relaxed text-justify">
                  {data.personalInfo.summary}
                </p>
              </section>
            ) : null;
          
          case 'skills':
            return (data.skills || []).length > 0 ? (
              <section key="skills" className="mb-4">
                <h2 className="text-[14px] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">
                  Skills
                </h2>
                <div className="text-[13px] space-y-1">
                  {(data.skills || []).map((skill, index) => (
                    <div key={index} className="flex">
                      <span className="font-bold whitespace-nowrap pr-2">{skill.category}:</span>
                      <span>{(skill.items || []).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'experience':
            return (data.experience || []).length > 0 ? (
              <section key="experience" className="mb-4">
                <h2 className="text-[14px] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">
                  Experience
                </h2>
                <div className="space-y-3">
                  {(data.experience || []).map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-[14px] font-bold">{exp.position}</h3>
                        <span className="text-[13px] font-bold">
                          {formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-[13px] italic">{exp.company}</span>
                        <span className="text-[13px] italic">{exp.location}</span>
                      </div>
                      <ul className="list-disc list-outside ml-5 text-[13px] space-y-1">
                        {(exp.description || []).map((item, i) => (
                          <li key={i} className="leading-snug pl-1">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'projects':
            return (data.projects || []).length > 0 ? (
              <section key="projects" className="mb-4">
                <h2 className="text-[14px] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">
                  Projects
                </h2>
                <div className="space-y-3">
                  {(data.projects || []).map((proj, index) => (
                    <div key={index}>
                      <div className="mb-1">
                        <h3 className="text-[14px] font-bold inline">{proj.name}</h3>
                        {(proj.technologies || []).length > 0 && (
                          <span className="text-[13px] italic ml-2">
                            | {(proj.technologies || []).join(', ')}
                          </span>
                        )}
                      </div>
                      <ul className="list-disc list-outside ml-5 text-[13px]">
                        <li className="leading-snug pl-1">{proj.description}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          case 'education':
            return (data.education || []).length > 0 ? (
              <section key="education" className="mb-4">
                <h2 className="text-[14px] font-bold uppercase border-b-[1px] border-black pb-1 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {(data.education || []).map((edu, index) => (
                    <div key={index} className="flex justify-between items-baseline">
                      <div>
                        <h3 className="text-[14px] font-bold">{edu.institution}</h3>
                        <div className="text-[13px]">
                          {edu.degree} in {edu.fieldOfStudy} {edu.gpa && `| GPA: ${edu.gpa}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-bold">
                          {formatResumeDate(edu.startDate)} – {edu.current ? 'Present' : formatResumeDate(edu.endDate)}
                        </div>
                        <div className="text-[13px] italic">{edu.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}
