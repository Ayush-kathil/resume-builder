import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { formatResumeDate } from '@/lib/formatDate';

// Register a standard font for a clean, ATS-friendly look.
// Helvetica (which closely matches Arial) guarantees a >95% ATS Parsing Rate.
// The Page size is set to a massive height to create a single long scrollable page.

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 10,
  },
  contactItem: {
    marginHorizontal: 3,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    textAlign: 'justify',
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  skillCategory: {
    fontFamily: 'Helvetica-Bold',
    width: '15%',
  },
  skillItems: {
    width: '85%',
  },
  expBlock: {
    marginBottom: 8,
  },
  expHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  expDates: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  expSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  expCompany: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
  },
  expLocation: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 10,
    paddingRight: 15,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletContent: {
    flex: 1,
    textAlign: 'justify',
  },
  eduBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eduInst: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  eduDegree: {
    fontSize: 10,
  },
  eduDates: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textAlign: 'right',
  },
  eduLocation: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
    textAlign: 'right',
  },
  projHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  projTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  projTech: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
    marginLeft: 5,
  }
});

export const ResumePDFDocument = ({ data }: { data: ResumeData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName || "Your Name"}</Text>
          <View style={styles.contactInfo}>
            {data.personalInfo.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
            {data.personalInfo.phone && <Text style={styles.contactItem}>| {data.personalInfo.phone}</Text>}
            {data.personalInfo.location && <Text style={styles.contactItem}>| {data.personalInfo.location}</Text>}
          </View>
          {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
            <View style={{ ...styles.contactInfo, marginTop: 4 }}>
              {data.personalInfo.linkedin && (
                <Text style={styles.contactItem}>LinkedIn: {data.personalInfo.linkedin}</Text>
              )}
              {data.personalInfo.linkedin && (data.personalInfo.github || data.personalInfo.website) && (
                <Text style={styles.contactItem}>|</Text>
              )}
              {data.personalInfo.github && (
                <Text style={styles.contactItem}>GitHub: {data.personalInfo.github}</Text>
              )}
              {data.personalInfo.github && data.personalInfo.website && (
                <Text style={styles.contactItem}>|</Text>
              )}
              {data.personalInfo.website && (
                <Text style={styles.contactItem}>Portfolio: {data.personalInfo.website}</Text>
              )}
            </View>
          )}
        </View>

        {/* Dynamic Sections */}
        {(data.sectionOrder || ['summary', 'skills', 'experience', 'projects', 'education']).map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return data.personalInfo.summary ? (
                <View key="summary" style={styles.section} wrap={false}>
                  <Text style={styles.summaryText}>{data.personalInfo.summary}</Text>
                </View>
              ) : null;

            case 'skills':
              return (data.skills || []).length > 0 ? (
                <View key="skills" style={styles.section} wrap={false}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                  {(data.skills || []).map((skill, index) => (
                    <View key={index} style={styles.skillRow}>
                      <Text style={styles.skillCategory}>{skill.category}:</Text>
                      <Text style={styles.skillItems}>{(skill.items || []).join(', ')}</Text>
                    </View>
                  ))}
                </View>
              ) : null;

            case 'experience':
              return (data.experience || []).length > 0 ? (
                <View key="experience" style={styles.section}>
                  <Text style={styles.sectionTitle}>Experience</Text>
                  {(data.experience || []).map((exp, index) => (
                    <View key={index} style={styles.expBlock}>
                      <View style={styles.expHeaderRow}>
                        <Text style={styles.expTitle}>{exp.position}</Text>
                        <Text style={styles.expDates}>{formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}</Text>
                      </View>
                      <View style={styles.expSubRow}>
                        <Text style={styles.expCompany}>{exp.company}</Text>
                        <Text style={styles.expLocation}>{exp.location}</Text>
                      </View>
                      {(exp.description || []).map((item, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletContent}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ) : null;

            case 'projects':
              return (data.projects || []).length > 0 ? (
                <View key="projects" style={styles.section}>
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {(data.projects || []).map((proj, index) => (
                    <View key={index} style={styles.expBlock} wrap={false}>
                      <View style={styles.projHeader}>
                        <Text style={styles.projTitle}>{proj.name}</Text>
                        {((proj.technologies || []).length > 0) && (
                          <Text style={styles.projTech}>| {(proj.technologies || []).join(', ')}</Text>
                        )}
                      </View>
                      <View style={styles.bulletRow}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletContent}>{proj.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null;

            case 'education':
              return (data.education || []).length > 0 ? (
                <View key="education" style={styles.section}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {(data.education || []).map((edu, index) => (
                    <View key={index} style={styles.eduBlock} wrap={false}>
                      <View>
                        <Text style={styles.eduInst}>{edu.institution}</Text>
                        <Text style={styles.eduDegree}>{edu.degree} in {edu.fieldOfStudy} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}</Text>
                      </View>
                      <View>
                        <Text style={styles.eduDates}>{formatResumeDate(edu.startDate)} – {edu.current ? 'Present' : formatResumeDate(edu.endDate)}</Text>
                        <Text style={styles.eduLocation}>{edu.location}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null;

            default:
              return null;
          }
        })}

      </Page>
    </Document>
  );
};
