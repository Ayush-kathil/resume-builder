import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import { AI_MODELS } from '@/lib/ai/models';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      targetRole, targetJD, industryKeywords,
      achievements, newSkills, gaps,
      metrics, businessOutcomes, peopleBudgets,
      tone, layout, sectionsToRemove
    } = data;

    if (!targetRole) {
      return NextResponse.json({ error: 'Target role is required' }, { status: 400 });
    }

    const prompt = `
You are an expert FAANG-tier ATS resume writer. Your task is to generate a complete boilerplate resume tailored exactly for the role of "${targetRole}".

CRITICAL SETUP CONTEXT PROVIDED BY USER:
1. Target Job Description Context: ${targetJD ? targetJD : 'None provided.'}
2. Industry Keywords to heavily inject: ${industryKeywords ? industryKeywords : 'None provided.'}
3. New Achievements since last update: ${achievements ? achievements : 'None provided.'}
4. New Skills/Tools learned: ${newSkills ? newSkills : 'None provided.'}
5. Gaps to explain smoothly: ${gaps ? gaps : 'None provided.'}
6. Metrics/Dollars/Percentages to use: ${metrics ? metrics : 'None provided.'}
7. Business Outcomes to highlight: ${businessOutcomes ? businessOutcomes : 'None provided.'}
8. People/Budgets Managed: ${peopleBudgets ? peopleBudgets : 'None provided.'}
9. Resume Tone requested: ${tone ? tone : 'Corporate/Professional'}
10. Target Layout Density: ${layout ? layout : '1-page'}
11. Sections to completely omit/hide: ${sectionsToRemove ? sectionsToRemove : 'None provided.'}

INSTRUCTIONS:
- Generate a complete, high-quality placeholder resume tailored exactly for the role of "${targetRole}".
- CRITICAL TONE CONSTRAINT: You must completely eliminate "machine-like" language, AI filler words, corporate jargon, and dramatic verbs (e.g., "dazzling", "unleashed", "spearheaded", "conquered", "fostered"). Write in a direct, factual, highly humanized engineering tone. Focus on raw technical achievements and clear business impact.
- FAANG Single-Page Constraint: You MUST summarize, condense, and structure the content to fit a single-page FAANG resume format. Limit experience bullets to 3-4 highly impactful points per role.
- Use the provided context to construct realistic, metric-driven bullet points using the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).
- If requested to omit sections (like 'Projects' or 'Education'), return those arrays as empty [].

The JSON MUST exactly match this TypeScript interface structure:
{
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string; // A highly targeted, punchy 2-line professional summary for a ${targetRole}, matching the requested ${tone} tone.
  };
  experience: Array<{
    id: string; // generate a random UUID
    company: string; // e.g. "Tech Corp" or placeholder
    position: string; // Should be relevant to ${targetRole}
    startDate: string; // e.g. "Jan 2020"
    endDate: string; // e.g. "Present"
    current: boolean;
    location: string;
    description: string[]; // 3-4 highly tailored bullet points embedding metrics and keywords.
  }>;
  education: Array<{
    id: string; // generate a random UUID
    institution: string; // e.g. "University Name"
    degree: string;
    fieldOfStudy: string; // relevant to ${targetRole}
    startDate: string;
    endDate: string;
    current: boolean;
    location: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string; // generate a random UUID
    category: string; // e.g. "Technical Skills", "Soft Skills"
    items: string[]; // Array of relevant skills for ${targetRole}, definitely include ${newSkills}
  }>;
  projects: Array<{
    id: string; // generate a random UUID
    name: string; // Relevant project name
    description: string; // 2 sentence description
    technologies: string[];
    url?: string;
  }>;
}

RETURN ONLY VALID JSON. NO MARKDOWN FORMATTING OR BACKTICKS.
`;

    const content = await generateContentWithFallback(
      prompt, 
      { temperature: 0.7 },
      AI_MODELS.REWRITER
    );
    
    let text = content.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsedData = JSON.parse(text);
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: `Generation Error: ${error instanceof Error ? error.message : String(error)}` }, 
      { status: 500 }
    );
  }
}
