import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { ThemeConfig } from '@/store/resumeStore';

// Base layout styles (colors and fonts injected dynamically)
const styles = StyleSheet.create({
  page: {
    padding: '24px 32px',
    fontSize: 9.5,
    lineHeight: 1.25,
    color: '#000000',
  },
  header: {
    marginBottom: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    textTransform: 'uppercase',
    marginBottom: 8,
    lineHeight: 1,
  },
  contact: {
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  contactItem: {
    color: '#0000EE',
    textDecoration: 'none',
  },
  sectionTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    marginTop: 10,
    marginBottom: 6,
    paddingBottom: 2,
  },
  summary: {
    fontSize: 10,
    textAlign: 'justify',
    marginBottom: 6,
  },
  itemContainer: {
    marginBottom: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  itemTitle: {
    fontSize: 10,
  },
  itemLocation: {
    fontSize: 10,
  },
  itemSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 10,
  },
  itemDate: {
    fontSize: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    paddingLeft: 12,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletContent: {
    flex: 1,
    fontSize: 10,
    textAlign: 'justify',
  },
  skillTable: {
    width: '100%',
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 12,
  },
  skillCategory: {
    width: 130, // Fixed width for alignment as seen in LaTeX
  },
  skillItems: {
    flex: 1,
  },
  link: {
    color: '#0000EE',
    textDecoration: 'none',
  },
  projectHeaderInline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
  },
  projectTech: {
    // dynamically styled
  },
  coursework: {
    fontSize: 10,
  },
  courseworkText: {
    // dynamically styled
  }
});

interface PdfDocumentProps {
  data: ResumeData;
  themeConfig: ThemeConfig;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ data, themeConfig }) => {
  const { personalInfo, experience, education, projects, skills, achievements = [], responsibilities = [], sectionOrder } = data;
  const order = sectionOrder || ['summary', 'education', 'achievements', 'projects', 'experience', 'responsibilities', 'skills'];

  const isSans = themeConfig.fontFamily === 'sans';
  const baseFont = isSans ? 'Helvetica' : 'Times-Roman';
  const boldFont = isSans ? 'Helvetica-Bold' : 'Times-Bold';
  const italicFont = isSans ? 'Helvetica-Oblique' : 'Times-Italic';
  const accentColor = themeConfig.accentColor;

  return (
    <Document>
      <Page size="A4" style={{ ...styles.page, fontFamily: baseFont }}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={{ ...styles.name, color: accentColor }}>{personalInfo.fullName || "YOUR NAME"}</Text>
          <View style={styles.contact}>
            {personalInfo.email && <Link src={`mailto:${personalInfo.email}`} style={styles.contactItem}>{personalInfo.email}</Link>}
            {(personalInfo.email && (personalInfo.phone || personalInfo.linkedin || personalInfo.github || personalInfo.website)) && <Text> | </Text>}
            
            {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
            {(personalInfo.phone && (personalInfo.linkedin || personalInfo.github || personalInfo.website)) && <Text> | </Text>}
            
            {personalInfo.linkedin && <Link src={personalInfo.linkedin} style={styles.contactItem}>LinkedIn</Link>}
            {(personalInfo.linkedin && (personalInfo.github || personalInfo.website)) && <Text> | </Text>}
            
            {personalInfo.github && <Link src={personalInfo.github} style={styles.contactItem}>GitHub</Link>}
            {(personalInfo.github && personalInfo.website) && <Text> | </Text>}
            
            {personalInfo.website && <Link src={personalInfo.website} style={styles.contactItem}>Portfolio</Link>}
          </View>
        </View>

        {/* Dynamic Sections */}
        {order.map((sectionId) => {
          if (sectionId === 'summary' && personalInfo.summary) {
            return (
              <View key="summary">
                <Text style={styles.summary}>{personalInfo.summary}</Text>
              </View>
            );
          }

          if (sectionId === 'education' && education.length > 0) {
            return (
              <View key="education">
                <Text style={{ ...styles.sectionTitle, borderBottomColor: accentColor, color: accentColor }}>Education</Text>
                {education.map(edu => (
                  <View key={edu.id} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={{ ...styles.itemTitle, fontFamily: boldFont }}>{edu.institution}</Text>
                      <Text style={styles.itemLocation}>{edu.location}</Text>
                    </View>
                    <View style={styles.itemSubHeader}>
                      <Text style={styles.itemSubtitle}>
                        {edu.degree} in {edu.fieldOfStudy} {edu.gpa ? <Text style={{ fontFamily: boldFont }}> CGPA: {edu.gpa}</Text> : ''}
                      </Text>
                      <Text style={styles.itemDate}>{edu.startDate} - {edu.endDate}</Text>
                    </View>
                    {edu.coursework && (
                      <Text style={{ ...styles.coursework, fontFamily: boldFont }}>Relevant Coursework: <Text style={{ fontFamily: baseFont }}>{edu.coursework}</Text></Text>
                    )}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === 'achievements' && achievements.length > 0) {
            return (
              <View key="achievements">
                <Text style={{ ...styles.sectionTitle, borderBottomColor: accentColor, color: accentColor }}>Achievements</Text>
                {achievements.map((achieve, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletContent}>{achieve}</Text>
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === 'projects' && projects.length > 0) {
            return (
              <View key="projects">
                <Text style={{ ...styles.sectionTitle, borderBottomColor: accentColor, color: accentColor }}>Projects</Text>
                {projects.map(proj => (
                  <View key={proj.id} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', flex: 1 }}>
                        <Text style={{ ...styles.itemTitle, fontFamily: boldFont }}>{proj.name}</Text>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <Text> | <Text style={{ fontFamily: italicFont }}>{proj.technologies.join(", ")}</Text></Text>
                        )}
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        {proj.url && (
                          <Link src={proj.url} style={styles.link}>[GitHub]</Link>
                        )}
                      </View>
                    </View>
                    {Array.isArray(proj.description) && proj.description.map((desc, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletContent}>{desc}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === 'experience' && experience.length > 0) {
            return (
              <View key="experience">
                <Text style={{ ...styles.sectionTitle, borderBottomColor: accentColor, color: accentColor }}>Experience</Text>
                {experience.map(exp => (
                  <View key={exp.id} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={{ ...styles.itemTitle, fontFamily: boldFont }}>{exp.position} | {exp.company}</Text>
                      <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate}</Text>
                    </View>
                    {Array.isArray(exp.description) && exp.description.map((desc, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletContent}>{desc}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === 'responsibilities' && responsibilities.length > 0) {
            return (
              <View key="responsibilities">
                <Text style={{ ...styles.sectionTitle, borderBottomColor: accentColor, color: accentColor }}>Position of Responsibility</Text>
                {responsibilities.map(resp => (
                  <View key={resp.id} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={{ ...styles.itemTitle, fontFamily: boldFont }}>{resp.position} | {resp.company}</Text>
                      <Text style={styles.itemDate}>{resp.startDate}</Text>
                    </View>
                    {Array.isArray(resp.description) && resp.description.map((desc, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletContent}>{desc}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          }

          if (sectionId === 'skills' && skills.length > 0) {
            return (
              <View key="skills">
                <Text style={{ ...styles.sectionTitle, borderBottomColor: accentColor, color: accentColor }}>Skills</Text>
                <View style={styles.skillTable}>
                  {skills.map(skill => (
                    <View key={skill.id} style={styles.skillRow}>
                      <Text style={{ ...styles.skillCategory, fontFamily: boldFont }}>{skill.category}: </Text>
                      <Text style={styles.skillItems}>{skill.items.join(", ")}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          }

          return null;
        })}
      </Page>
    </Document>
  );
};
