import { SchemaType, FunctionDeclaration } from '@google/generative-ai';

// ----------------------------------------------------
// STAGE 2: PARSE RESUME (JSON STRUCTURE)
// ----------------------------------------------------
export const generateParsePrompt = (setupData: any) => `
You are a world-class AI Resume Parser. Ingest raw text and output a strictly structured JSON matching the ResumeData schema.

The user has provided specific SETUP CONTEXT to upgrade their resume during this parse step:
- Target Role: ${setupData.targetRole || 'None provided'}
- Target JD: ${setupData.targetJD || 'None provided'}
- Industry Keywords: ${setupData.industryKeywords || 'None provided'}
- New Achievements: ${setupData.achievements || 'None provided'}
- New Skills: ${setupData.newSkills || 'None provided'}
- Explaining Gaps: ${setupData.gaps || 'None provided'}
- Metrics to Add: ${setupData.metrics || 'None provided'}
- Business Outcomes: ${setupData.businessOutcomes || 'None provided'}
- Tone: ${setupData.tone || 'Professional'}
- Sections to Omit: ${setupData.sectionsToRemove || 'None provided'}

Required Fields:
- personalInfo (fullName, email, phone, location, linkedin, github, website, summary)
- experience (array of objects: company, position, location, startDate, endDate, current, description)
- education (array of objects: institution, degree, fieldOfStudy, location, startDate, endDate, current, gpa)
- projects (array of objects: name, description (array of exactly 3 bullet points, concise), technologies, url)
- certifications (array of objects: name, issuer, date)
- skills (array of objects: category, items)
- achievements (array of strings)
- awards (array of strings)
- publications (array of strings)
- volunteerExperience (array of objects)
- languages (array of strings)

Rules:
1. Normalize dates, companies, and skills.
2. Extract metrics and technologies.
3. Return ONLY valid JSON matching this exact structure with no markdown blocks.
4. CRITICAL: The entire resume content MUST be aggressively condensed and humanized to fit on a single page. Prioritize quality and impact.
5. Projects MUST have exactly 3 high-impact bullet points in the description array.
`;

// ----------------------------------------------------
// STAGE 3: EXPERIENCE INTELLIGENCE
// ----------------------------------------------------
export const ExperienceAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    experienceScore: { type: SchemaType.INTEGER, description: "0-100 score" },
    seniorityLevel: { type: SchemaType.STRING },
    careerTrajectory: { type: SchemaType.STRING },
    gapsDetected: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    promotionTimeline: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
  },
  required: ["experienceScore", "seniorityLevel", "careerTrajectory", "gapsDetected", "promotionTimeline"]
};

// ----------------------------------------------------
// STAGE 4: SKILL INTELLIGENCE
// ----------------------------------------------------
export const SkillAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    categories: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          categoryName: { type: SchemaType.STRING, description: "e.g., Frontend, Backend, AI/ML" },
          skills: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                confidenceScore: { type: SchemaType.INTEGER }
              }
            }
          }
        }
      }
    }
  }
};

// ----------------------------------------------------
// STAGE 5: PROJECT INTELLIGENCE
// ----------------------------------------------------
export const ProjectAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    projects: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          complexity: { type: SchemaType.STRING, description: "Beginner, Intermediate, Advanced, Professional" },
          businessImpact: { type: SchemaType.STRING },
          architectureQuality: { type: SchemaType.STRING },
          productionReadiness: { type: SchemaType.BOOLEAN }
        }
      }
    }
  }
};

// ----------------------------------------------------
// STAGE 6: ATS ANALYSIS
// ----------------------------------------------------
export const AtsAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    atsScore: { type: SchemaType.INTEGER, description: "0-100 score" },
    keywordCoverage: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    weakBullets: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    missingSections: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    formattingIssues: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    recommendations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
  },
  required: ["atsScore", "keywordCoverage", "weakBullets", "missingSections", "formattingIssues", "recommendations"]
};

// ----------------------------------------------------
// STAGE 8: JOB DESCRIPTION MATCHING
// ----------------------------------------------------
export const JdMatchingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    matchScore: { type: SchemaType.INTEGER, description: "0-100 score" },
    matchedSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    missingSkills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    recommendedKeywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    resumeGaps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    improvementSuggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
  },
  required: ["matchScore", "matchedSkills", "missingSkills", "recommendedKeywords", "resumeGaps", "improvementSuggestions"]
};
