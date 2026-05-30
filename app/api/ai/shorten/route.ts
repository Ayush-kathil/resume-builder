import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { resumeData } = await req.json();

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const prompt = `
You are an expert executive resume writer. Your task is to aggressively shorten the provided resume JSON so it fits beautifully on a single A4 page.

CRITICAL INSTRUCTIONS:
1. Shorten the summary to maximum 3 concise sentences.
2. Keep only the 3-4 most relevant or recent work experiences.
3. For each experience, keep a maximum of 3 highly impactful bullet points.
4. Merge related skills to save space.
5. Keep only the top 2 most impressive projects (if any).
6. Do NOT change the JSON structure/keys at all. Only modify the values.
7. Return ONLY the raw JSON object. Do not wrap it in markdown block quotes (like \`\`\`json).

Input JSON:
${JSON.stringify(resumeData)}
`;

    const content = await generateContentWithFallback(prompt, { responseMimeType: 'application/json' });

    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(cleanContent);
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('AI Shorten Error:', error);
    return NextResponse.json(
      { error: `Shortening Error: ${error instanceof Error ? error.message : String(error)}` }, 
      { status: 500 }
    );
  }
}
