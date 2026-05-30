import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { experience, education } = await req.json();

    const prompt = `
      You are an expert executive resume writer. 
      Based on the following experience and education, write a powerful, 3-sentence executive summary.
      Make it impactful, action-oriented, and highlight key achievements.
      Return ONLY the summary text, no quotes or additional formatting.

      Experience:
      ${JSON.stringify(experience)}

      Education:
      ${JSON.stringify(education)}
    `;

    const content = await generateContentWithFallback(prompt, { temperature: 0.7 });
    const text = content.trim();

    return NextResponse.json({ summary: text });
  } catch (error: any) {
    console.error("Summary generation error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate summary' }, { status: 500 });
  }
}
