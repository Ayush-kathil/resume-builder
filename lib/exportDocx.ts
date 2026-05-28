import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, FileChild, ExternalHyperlink, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '@/types/resume';

const createHeading = (text: string): Paragraph => {
  return new Paragraph({
    text: text.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 100 },
    border: {
      bottom: { color: "000000", space: 1, value: BorderStyle.SINGLE, size: 6 }
    }
  });
};

const createSubHeading = (leftText: string, rightText: string): Paragraph => {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 100, after: 50 },
    children: [
      new TextRun({ text: leftText, bold: true, size: 24 }),
      new TextRun({ text: rightText, bold: true, size: 20, rightToLeft: false }),
    ],
    tabStops: [{ type: "right", position: 10000 }]
  });
};

const createItalicSub = (leftText: string, rightText: string): Paragraph => {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 100 },
    children: [
      new TextRun({ text: leftText, italics: true, size: 20 }),
      new TextRun({ text: rightText, italics: true, size: 20 }),
    ],
    tabStops: [{ type: "right", position: 10000 }]
  });
};

const createBullet = (text: string): Paragraph => {
  return new Paragraph({
    text: text,
    bullet: { level: 0 },
    spacing: { after: 50 },
    style: "Normal"
  });
};

export const exportDocx = async (data: ResumeData) => {
  const children: FileChild[] = [];

  // Header Section
  children.push(
    new Paragraph({
      text: data.personalInfo.fullName || 'YOUR NAME',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  const contactInfo: TextRun[] = [];
  if (data.personalInfo.email) contactInfo.push(new TextRun(`Email: ${data.personalInfo.email}`));
  if (data.personalInfo.phone) contactInfo.push(new TextRun(` | Phone: ${data.personalInfo.phone}`));
  if (data.personalInfo.location) contactInfo.push(new TextRun(` | Location: ${data.personalInfo.location}`));

  children.push(
    new Paragraph({
      children: contactInfo,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Links
  if (data.projects.some(p => p.url) || data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) {
     const linksParagraph = new Paragraph({
       alignment: AlignmentType.CENTER,
       spacing: { after: 200 },
       children: [
         ...(data.personalInfo.linkedin ? [new ExternalHyperlink({ children: [new TextRun({ text: "LinkedIn", color: "0000FF", underline: {} })], link: data.personalInfo.linkedin }), new TextRun(" | ")] : []),
         ...(data.personalInfo.github ? [new ExternalHyperlink({ children: [new TextRun({ text: "GitHub", color: "0000FF", underline: {} })], link: data.personalInfo.github }), new TextRun(" | ")] : []),
         ...(data.personalInfo.website ? [new ExternalHyperlink({ children: [new TextRun({ text: "Portfolio", color: "0000FF", underline: {} })], link: data.personalInfo.website }), new TextRun(" | ")] : []),
       ]
     });
     children.push(linksParagraph);
  }


  // Professional Summary
  if (data.personalInfo.summary) {
    children.push(createHeading('Professional Summary'));
    children.push(new Paragraph({ text: data.personalInfo.summary, spacing: { after: 200 } }));
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    children.push(createHeading('Skills'));
    data.skills.forEach(skill => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${skill.category}: `, bold: true }),
            new TextRun({ text: skill.items.join(', ') })
          ],
          spacing: { after: 50 }
        })
      );
    });
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    children.push(createHeading('Experience'));
    data.experience.forEach(exp => {
      const dateRange = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 24 }),
            new TextRun({ text: `\t${dateRange}`, bold: true, size: 20 })
          ],
          tabStops: [{ type: "right", position: 10000 }],
          spacing: { before: 100, after: 50 }
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, italics: true, size: 20 }),
            new TextRun({ text: `\t${exp.location}`, italics: true, size: 20 })
          ],
          tabStops: [{ type: "right", position: 10000 }],
          spacing: { after: 100 }
        })
      );
      exp.description.forEach(desc => {
        children.push(createBullet(desc));
      });
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    children.push(createHeading('Projects'));
    data.projects.forEach(proj => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true, size: 24 }),
            ...(proj.technologies.length > 0 ? [new TextRun({ text: ` | ${proj.technologies.join(', ')}`, italics: true, size: 20 })] : [])
          ],
          spacing: { before: 100, after: 50 }
        })
      );
      children.push(createBullet(proj.description));
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    children.push(createHeading('Education'));
    data.education.forEach(edu => {
      const dateRange = `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 24 }),
            new TextRun({ text: `\t${dateRange}`, bold: true, size: 20 })
          ],
          tabStops: [{ type: "right", position: 10000 }],
          spacing: { before: 100, after: 50 }
        })
      );
      
      const degreeStr = `${edu.degree} in ${edu.fieldOfStudy}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: degreeStr, italics: true, size: 20 }),
            new TextRun({ text: `\t${edu.location}`, italics: true, size: 20 })
          ],
          tabStops: [{ type: "right", position: 10000 }],
          spacing: { after: 100 }
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${(data.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.docx`);
};
