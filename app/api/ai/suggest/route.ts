import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import { AI_MODELS } from '@/lib/ai/models';

export async function POST(req: Request) {
  try {
    const { position, type } = await req.json();

    if (!position || !type) {
      return NextResponse.json({ error: 'Position and type are required' }, { status: 400 });
    }

    const prompt = `
      You are an expert technical resume writer.
      Generate exactly 3 powerful, action-oriented, metrics-driven bullet points for a ${position} role.
      Focus on ${type === 'skills' ? 'technical skills and tools' : 'achievements and impact'}.
      Use the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].
      
      Return ONLY a JSON array of strings. Do NOT wrap in markdown \`\`\`json block.
      Example: ["bullet 1", "bullet 2", "bullet 3"]
    `;

    const content = await generateContentWithFallback(
      prompt, 
      { temperature: 0.7 },
      AI_MODELS.REWRITER
    );

    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const suggestions = JSON.parse(cleanContent);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 });
  }
}
