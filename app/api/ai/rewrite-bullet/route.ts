import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { bullet, company, position } = await req.json();

    const prompt = `
      You are an expert technical recruiter and FAANG-tier AI resume writer.
      Rewrite the following resume bullet point using the XYZ/STAR method (Accomplished [X] as measured by [Y], by doing [Z]).
      
      CRITICAL TONE CONSTRAINT: You must completely eliminate "machine-like" language, AI filler words, corporate jargon, and dramatic verbs (e.g., "dazzling", "unleashed", "spearheaded", "conquered", "fostered"). Write in a direct, factual, highly humanized engineering tone. Focus on raw technical achievements and clear business impact without fluff.
      
      Context: Role was ${position} at ${company}.
      Original Bullet: "${bullet}"

      Return ONLY the single rewritten bullet point text without any bullet characters, quotes, or markdown.
    `;

    const content = await generateContentWithFallback(prompt, { temperature: 0.7 });
    const text = content.trim().replace(/^[-*•]\s*/, '');

    return NextResponse.json({ bullet: text });
  } catch (error: any) {
    console.error("Bullet rewrite error:", error);
    return NextResponse.json({ error: error.message || 'Failed to rewrite bullet' }, { status: 500 });
  }
}
