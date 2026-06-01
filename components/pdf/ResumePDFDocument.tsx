import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';
import { formatResumeDate } from '@/lib/formatDate';

const styles = StyleSheet.create({
  page: {
    padding: 20, // Reduced from 24
    fontFamily: 'Helvetica',
    fontSize: 9.5, // Slightly reduced
    color: '#000000',
    lineHeight: 1.1, // Denser line height
  },
  header: {
    marginBottom: 4,
    textAlign: 'center',
  },
  name: {
    fontSize: 20, // Reduced from 22
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    marginBottom: 2,
    paddingBottom: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 9.5,
    flexWrap: 'wrap',
    gap: 4,
  },
  contactItem: {
    color: '#000000',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 2,
  },
  summaryText: {
    textAlign: 'justify',
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 1,
    paddingLeft: 4,
  },
  skillBullet: {
    width: 6,
    fontSize: 9.5,
  },
  skillContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillCategory: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
  expBlock: {
    marginBottom: 3,
  },
  expHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  expTitleCompany: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 9.5,
  },
  expDates: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 9.5,
  },
  expSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  expSubtitle: {
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    fontSize: 9.5,
  },
  expLocation: {
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 0.5,
    paddingLeft: 4,
    paddingRight: 2,
  },
  bulletPoint: {
    width: 6,
    fontSize: 9.5,
  },
  bulletContent: {
    flex: 1,
    textAlign: 'justify',
  },
  eduBlock: {
    marginBottom: 3,
  },
  eduHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  eduInst: {
    fontFamily: 'Times-Roman',
    fontWeight: 'bold',
    fontSize: 9.5,
  },
  eduDates: {
    fontFamily: 'Times-Roman',
    fontWeight: 'bold',
    fontSize: 9.5,
  },
  eduSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  eduDegree: {
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
  },
  eduGpa: {
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    fontSize: 9.5,
  },
  projHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  projTitleBox: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  projTitle: {
    fontFamily: 'Times-Roman',
    fontWeight: 'bold',
    fontSize: 9.5,
  },
  projTech: {
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    fontSize: 9.5,
  }
});

export const ResumePDFDocument = ({ data }: { data: ResumeData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header - Mimicking the LaTeX center block */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName || "Your Name"}</Text>
          <View style={styles.contactInfo}>
            {data.personalInfo.phone && <Text style={styles.contactItem}>{data.personalInfo.phone} |</Text>}
            {data.personalInfo.email && (
              <Link src={`mailto:${data.personalInfo.email}`} style={styles.contactItem}>
                {data.personalInfo.email}
              </Link>
            )}
          </View>
          {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
            <View style={{ ...styles.contactInfo, marginTop: 2 }}>
              {data.personalInfo.linkedin && (
                <>
                  <Link src={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} style={styles.contactItem}>
                    LinkedIn
                  </Link>
                  {(data.personalInfo.github || data.personalInfo.website) && <Text style={styles.contactItem}>|</Text>}
                </>
              )}
              {data.personalInfo.github && (
                <>
                  <Link src={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`} style={styles.contactItem}>
                    GitHub
                  </Link>
                  {data.personalInfo.website && <Text style={styles.contactItem}>|</Text>}
                </>
              )}
              {data.personalInfo.website && (
                <Link src={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} style={styles.contactItem}>
                  Portfolio
                </Link>
              )}
            </View>
          )}
        </View>

        {/* Dynamic Sections */}
        {(data.sectionOrder || ['education', 'experience', 'projects', 'skills']).map((sectionId) => {
          switch (sectionId) {
            case 'summary':
              return data.personalInfo.summary ? (
                <View key="summary" style={styles.section} wrap={false}>
                  <Text style={styles.summaryText}>{data.personalInfo.summary}</Text>
                </View>
              ) : null;

            case 'education':
              return (data.education || []).length > 0 ? (
                <View key="education" style={styles.section}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {(data.education || []).map((edu, index) => (
                    <View key={index} style={styles.eduBlock} wrap={false}>
                      <View style={styles.eduHeaderRow}>
                        <Text style={styles.eduInst}>{edu.institution}</Text>
                        <Text style={styles.eduDates}>{formatResumeDate(edu.startDate)} – {edu.current ? 'Present' : formatResumeDate(edu.endDate)}</Text>
                      </View>
                      <View style={styles.eduSubRow}>
                        <Text style={styles.eduDegree}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</Text>
                        <Text style={styles.eduGpa}>{edu.gpa ? `CGPA: ${edu.gpa}` : edu.location}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null;

            case 'experience':
              return (data.experience || []).length > 0 ? (
                <View key="experience" style={styles.section}>
                  <Text style={styles.sectionTitle}>Experience</Text>
                  {(data.experience || []).map((exp, index) => (
                    <View key={index} style={styles.expBlock} wrap={false}>
                      <View style={styles.expHeaderRow}>
                        {/* The latex uses Company on the left, but we have Company & Position. We'll format it identically to LaTeX logic if possible, or standard Company on left */}
                        <Text style={styles.expTitleCompany}>{exp.company}</Text>
                        <Text style={styles.expDates}>{formatResumeDate(exp.startDate)} – {exp.current ? 'Present' : formatResumeDate(exp.endDate)}</Text>
                      </View>
                      <View style={styles.expSubRow}>
                        <Text style={styles.expSubtitle}>{exp.position}</Text>
                        {exp.location && <Text style={styles.expLocation}>{exp.location}</Text>}
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
                      <View style={styles.projHeaderRow}>
                        <View style={styles.projTitleBox}>
                          {proj.url ? (
                            <Link src={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} style={{ ...styles.projTitle, textDecoration: 'none', color: 'black' }}>
                              {proj.name}
                            </Link>
                          ) : (
                            <Text style={styles.projTitle}>{proj.name}</Text>
                          )}
                          {((proj.technologies || []).length > 0) && (
                            <Text style={styles.projTech}> | {proj.technologies.join(', ')}</Text>
                          )}
                        </View>
                      </View>
                      {(proj.description || []).filter(Boolean).map((desc, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletContent}>{String(desc).replace(/^- /, '')}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              ) : null;

            case 'skills':
              return (data.skills || []).length > 0 ? (
                <View key="skills" style={styles.section} wrap={false}>
                  <Text style={styles.sectionTitle}>Technical Skills</Text>
                  {(data.skills || []).map((skill, index) => (
                    <View key={index} style={styles.skillRow}>
                      <Text style={styles.skillBullet}>•</Text>
                      <View style={styles.skillContent}>
                        <Text style={styles.skillCategory}>{skill.category}: </Text>
                        <Text>{(skill.items || []).join(', ')}</Text>
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
