import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import { AI_MODELS } from '@/lib/ai/models';
import { validatePrompt } from '@/lib/ai/errors';

export async function POST(req: NextRequest) {
  try {
    const { bullet, company, position } = await req.json();

    // Fix Crash #17: Validate prompt before sending to Gemini
    validatePrompt(bullet, 'Bullet point');


    const prompt = `
      You are an expert technical recruiter and FAANG-tier AI resume writer.
      
      - Make sure the points follow the core structure of "Accomplished [X] as measured by [Y] by doing [Z]", but DO NOT use those exact robotic words. Use natural, humanized, and highly varied language.
      - Inject strong action verbs and weave in specific technologies where relevant.
      Rewrite the following resume bullet point using the XYZ/STAR method (Accomplished [X] as measured by [Y], by doing [Z]).
      
      CRITICAL TONE CONSTRAINT: You must completely eliminate "machine-like" language, AI filler words, corporate jargon, and dramatic verbs (e.g., "dazzling", "unleashed", "spearheaded", "conquered", "fostered"). Write in a direct, factual, highly humanized engineering tone. Focus on raw technical achievements and clear business impact without fluff.
      
      Context: Role was ${position} at ${company}.
      Original Bullet: "${bullet}"

      Return ONLY the single rewritten bullet point text without any bullet characters, quotes, or markdown.
    `;

    const content = await generateContentWithFallback(
      prompt, 
      { temperature: 0.7 },
      AI_MODELS.REWRITER
    );
    const text = content.trim().replace(/^[-*•]\s*/, '');

    return NextResponse.json({ bullet: text });
  } catch (error: any) {
    console.error("Bullet rewrite error:", error);
    return NextResponse.json({ error: error.message || 'Failed to rewrite bullet' }, { status: 500 });
  }
}
