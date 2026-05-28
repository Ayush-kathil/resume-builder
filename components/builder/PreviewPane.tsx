'use client';

import { useResumeStore } from '@/store/resumeStore';
import { useRef } from 'react';

export function PreviewPane() {
  const { data } = useResumeStore();
  const resumeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full bg-[#111111] p-8 flex justify-center overflow-y-auto relative">
      {/* Resume Paper (A4) */}
      <div 
        ref={resumeRef}
        id="resume-preview"
        className={`w-full max-w-[800px] h-fit min-h-[1123px] bg-white text-black p-10 shadow-2xl transition-colors duration-300`}
        style={{ fontFamily: "Inter, Roboto, sans-serif" }}
      >
        {/* Header - Contact */}
        <header className="border-b-2 border-black pb-4 mb-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight uppercase mb-2">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-[#374151] font-medium">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
          </div>
          {/* Social Links (if added later) could go here */}
          {data.projects.find(p => p.url) && (
            <div className="flex justify-center gap-3 text-sm font-medium mt-2">
              {data.projects.filter(p => p.url).map((p, i) => {
                const isGithub = p.url?.toLowerCase().includes('github');
                const isLinkedin = p.url?.toLowerCase().includes('linkedin');
                const label = isGithub ? 'GitHub' : isLinkedin ? 'LinkedIn' : 'Link';
                
                return (
                  <a key={i} href={p.url} className="text-[#2563eb] hover:underline" target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                );
              })}
            </div>
          )}
        </header>

        {/* Summary */}
        {data.personalInfo.summary && (
          <section className="mb-4">
            <p className="text-[13px] leading-relaxed text-[#1f2937]">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-[#d1d5db] pb-1 mb-2">
              Skills
            </h2>
            <div className="text-[13px] space-y-1">
              {data.skills.map((skill, index) => (
                <div key={index}>
                  <span className="font-bold text-[#111827]">{skill.category}:</span>{' '}
                  <span className="text-[#1f2937]">{skill.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-[#d1d5db] pb-1 mb-2">
              Experience
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[14px] font-bold text-[#111827]">{exp.position}</h3>
                    <span className="text-[12px] font-bold text-[#374151] whitespace-nowrap">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[13px] italic text-[#1f2937]">{exp.company}</span>
                    <span className="text-[12px] italic text-[#374151]">{exp.location}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 text-[13px] text-[#1f2937] space-y-1">
                    {exp.description.map((item, i) => (
                      <li key={i} className="leading-snug">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-[#d1d5db] pb-1 mb-2">
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, index) => (
                <div key={index}>
                  <div className="mb-1">
                    <h3 className="text-[14px] font-bold text-[#111827] inline">{proj.name}</h3>
                    {proj.technologies.length > 0 && (
                      <span className="text-[13px] italic text-[#374151] ml-2">
                        Technologies: {proj.technologies.join(', ')}
                      </span>
                    )}
                  </div>
                  <ul className="list-disc list-outside ml-4 text-[13px] text-[#1f2937]">
                    <li className="leading-snug">{proj.description}</li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-[#d1d5db] pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#111827]">{edu.institution}</h3>
                    <div className="text-[13px] text-[#1f2937]">
                      {edu.degree} in {edu.fieldOfStudy} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-[#374151]">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                    <div className="text-[12px] italic text-[#374151]">{edu.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
