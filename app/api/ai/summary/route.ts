import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import { AI_MODELS } from '@/lib/ai/models';

export async function POST(req: NextRequest) {
  try {
    const { experience, education } = await req.json();

    const prompt = `
      You are an expert executive resume writer. 
      Based on the following experience and education, write a highly scannable, punchy 2-line executive summary.
      Make it impactful, action-oriented, and highlight key achievements. AVOID overblown, dramatic language like "dazzling", "unleashed", or "conquered". Use a strictly objective, highly professional corporate tone. Rely on raw technical achievements without fluff.
      Return ONLY the summary text, no quotes or additional formatting.

      Experience:
      ${JSON.stringify(experience)}

      Education:
      ${JSON.stringify(education)}
    `;

    const content = await generateContentWithFallback(
      prompt, 
      { temperature: 0.7 },
      AI_MODELS.SUMMARY
    );
    const text = content.trim();

    return NextResponse.json({ summary: text });
  } catch (error: any) {
    console.error("Summary generation error:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate summary' }, { status: 500 });
  }
}
