import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { resumeData, prompt: userPrompt } = await req.json();

    if (!resumeData || !userPrompt) {
      return NextResponse.json({ error: 'Missing resume data or prompt' }, { status: 400 });
    }

    const systemPrompt = `
You are an expert ATS resume editor and AI assistant. The user wants to make a targeted edit to their existing resume.

CURRENT RESUME JSON:
${JSON.stringify(resumeData, null, 2)}

USER'S EDIT REQUEST:
"${userPrompt}"

INSTRUCTIONS:
1. Understand the user's request and locate the relevant sections in the provided JSON.
2. Make the requested edits (e.g. rewriting bullets, adding a skill, changing the summary).
3. If the user asks to add something vague, invent professional, ATS-optimized placeholder content for them.
4. Keep the unmodified sections exactly as they are.
5. Return ONLY the fully updated JSON object matching the exact schema provided below. Do NOT wrap it in markdown blockquotes or add conversational text.

SCHEMA EXPECTED:
{
  personalInfo: { fullName, email, phone, location, summary, website, linkedin, github },
  experience: [ { id, company, position, location, startDate, endDate, current, description: [] } ],
  education: [ { id, institution, degree, fieldOfStudy, location, startDate, endDate, current, gpa } ],
  skills: [ { id, category, items: [] } ],
  projects: [ { id, name, description, technologies: [], url } ],
  sectionOrder: [] // Optional
}
`;

    const content = await generateContentWithFallback(systemPrompt, { temperature: 0.2 });
    
    let text = content.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsedData = JSON.parse(text);
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('AI Chat Edit Error:', error);
    return NextResponse.json(
      { error: `Chat Edit Error: ${error instanceof Error ? error.message : String(error)}` }, 
      { status: 500 }
    );
  }
}
