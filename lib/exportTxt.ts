import { ResumeData } from '@/types/resume';

export const exportTxt = (data: ResumeData) => {
  let content = '';

  // Personal Info
  content += `${data.personalInfo.fullName.toUpperCase()}\n`;
  if (data.personalInfo.email) content += `${data.personalInfo.email} | `;
  if (data.personalInfo.phone) content += `${data.personalInfo.phone} | `;
  if (data.personalInfo.location) content += `${data.personalInfo.location}`;
  content += '\n';

  if (data.personalInfo.website) content += `${data.personalInfo.website}\n`;
  if (data.personalInfo.linkedin) content += `${data.personalInfo.linkedin}\n`;
  if (data.personalInfo.github) content += `${data.personalInfo.github}\n`;
  content += '\n';

  // Dynamic Sections
  const order = data.sectionOrder || ['summary', 'experience', 'projects', 'education', 'skills'];

  order.forEach(section => {
    switch (section) {
      case 'summary':
        if (data.personalInfo.summary) {
          content += `SUMMARY\n`;
          content += `--------------------------------------------------\n`;
          content += `${data.personalInfo.summary}\n\n`;
        }
        break;

      case 'experience':
        if (data.experience && data.experience.length > 0) {
          content += `EXPERIENCE\n`;
          content += `--------------------------------------------------\n`;
          data.experience.forEach(exp => {
            content += `${exp.position} | ${exp.company} - ${exp.location}\n`;
            content += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
            exp.description.forEach(desc => {
              content += `- ${desc}\n`;
            });
            content += '\n';
          });
        }
        break;

      case 'projects':
        if (data.projects && data.projects.length > 0) {
          content += `PROJECTS\n`;
          content += `--------------------------------------------------\n`;
          data.projects.forEach(proj => {
            content += `${proj.name}`;
            if (proj.url) content += ` | ${proj.url}`;
            content += '\n';
            if (proj.technologies && proj.technologies.length > 0) {
              content += `Technologies: ${proj.technologies.join(', ')}\n`;
            }
            content += `- ${proj.description}\n\n`;
          });
        }
        break;

      case 'education':
        if (data.education && data.education.length > 0) {
          content += `EDUCATION\n`;
          content += `--------------------------------------------------\n`;
          data.education.forEach(edu => {
            content += `${edu.degree} in ${edu.fieldOfStudy}\n`;
            content += `${edu.institution}`;
            if (edu.location) content += `, ${edu.location}`;
            content += '\n';
            content += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`;
            if (edu.gpa) content += ` | GPA: ${edu.gpa}`;
            content += '\n\n';
          });
        }
        break;

      case 'skills':
        if (data.skills && data.skills.length > 0) {
          content += `SKILLS\n`;
          content += `--------------------------------------------------\n`;
          data.skills.forEach(skill => {
            content += `${skill.category}: ${skill.items.join(', ')}\n`;
          });
          content += '\n';
        }
        break;
    }
  });

  // Create Blob and trigger download
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_Plain.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
