import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { targetRole, department, tone } = await req.json();

    if (!targetRole) {
      return NextResponse.json({ error: 'Target role is required' }, { status: 400 });
    }

    const prompt = `
You are an expert ATS resume writer. Your task is to generate a complete boilerplate resume tailored exactly for the role of "${targetRole}"${department ? ` in the ${department} department/industry` : ''}.
${tone ? `CRITICAL INSTRUCTION: Emphasize the following features/tone throughout the resume: ${tone}.` : ''}

The goal is to give the user a massive headstart. Fill in the JSON structure with high-quality, ATS-optimized placeholder content that a ${targetRole} would typically have.
Include strong action verbs, industry-standard keywords, and ensure high impact.
Use the XYZ formula for bullet points where possible (Accomplished [X] as measured by [Y], by doing [Z]).

Generate exactly 2 placeholder experiences and 1 education.

The JSON MUST exactly match this TypeScript interface structure:
{
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string; // A highly targeted, 3-sentence professional summary for a ${targetRole}
  };
  experience: Array<{
    id: string; // generate a random UUID
    company: string; // e.g. "Tech Corp" or placeholder
    position: string; // Should be relevant to ${targetRole}
    startDate: string; // e.g. "Jan 2020"
    endDate: string; // e.g. "Present"
    current: boolean;
    location: string;
    description: string[]; // 3-4 highly tailored bullet points
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
    items: string[]; // Array of relevant skills for ${targetRole}
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

    const content = await generateContentWithFallback(prompt, { temperature: 0.7 });
    
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
