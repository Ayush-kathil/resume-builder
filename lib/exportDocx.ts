import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { ResumeData } from '@/types/resume';
import { saveAs } from 'file-saver';

export const exportToDocx = async (data: ResumeData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Name and Contact
        new Paragraph({
          text: data.personalInfo.fullName || 'Your Name',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun(data.personalInfo.email ? `${data.personalInfo.email} | ` : ''),
            new TextRun(data.personalInfo.phone ? `${data.personalInfo.phone} | ` : ''),
            new TextRun(data.personalInfo.location || ''),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun(data.personalInfo.linkedin ? `${data.personalInfo.linkedin} | ` : ''),
            new TextRun(data.personalInfo.github || ''),
          ],
        }),
        new Paragraph({ text: '' }), // Spacer

        // Summary
        ...(data.personalInfo.summary ? [
          new Paragraph({ text: 'SUMMARY', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.personalInfo.summary }),
          new Paragraph({ text: '' }),
        ] : []),

        // Experience
        ...(data.experience.length > 0 ? [
          new Paragraph({ text: 'EXPERIENCE', heading: HeadingLevel.HEADING_2 }),
          ...data.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.position || 'Role', bold: true }),
                new TextRun({ text: ` | ${exp.company || 'Company'}`, italics: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${exp.startDate} - ${exp.endDate} | ${exp.location}`, color: '666666' }),
              ],
            }),
            ...exp.description.map(bullet => 
              new Paragraph({
                text: bullet,
                bullet: { level: 0 }
              })
            ),
            new Paragraph({ text: '' }),
          ]),
        ] : []),

        // Education
        ...(data.education.length > 0 ? [
          new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_2 }),
          ...data.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution || 'School', bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${edu.degree} in ${edu.fieldOfStudy} | ${edu.startDate} - ${edu.endDate}`, italics: true }),
              ],
            }),
            new Paragraph({ text: '' }),
          ]),
        ] : []),

        // Skills
        ...(data.skills.length > 0 ? [
          new Paragraph({ text: 'SKILLS', heading: HeadingLevel.HEADING_2 }),
          ...data.skills.map(skill => 
            new Paragraph({
              children: [
                new TextRun({ text: `${skill.category}: `, bold: true }),
                new TextRun(skill.items.join(', ')),
              ]
            })
          ),
        ] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.personalInfo.fullName?.replace(/\s+/g, '_') || 'Resume'}.docx`);
};
