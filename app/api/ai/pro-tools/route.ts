import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import { AI_MODELS } from '@/lib/ai/models';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { action, content, context } = await req.json();

    if (!action || !content) {
      return NextResponse.json({ error: 'Action and content are required' }, { status: 400 });
    }

    let systemPrompt = '';

    switch (action) {
      case 'academic-translate':
        systemPrompt = `You are a corporate hiring manager. Translate the following college coursework, academic project, or university experience into a professional, corporate-ready Experience block. Use strong action verbs. Highlight leadership, systems architecture, or project management skills rather than purely academic terms.`;
        break;
      case 'xyz-formula':
        systemPrompt = `You are an elite executive resume writer from Google. Rewrite the following resume bullet point using the strict X-Y-Z Action-Impact Formula: "Accomplished [X], as measured by [Y], by doing [Z]". 
        Ensure it is metrics-driven. If the user didn't provide specific metrics, intelligently infer a plausible scale based on the context or add placeholders like [Metric]. 
        Return ONLY the rewritten bullet point, without quotes.`;
        break;
      case 'legacy-filter':
        systemPrompt = `You are a C-level executive recruiter. The user is a Senior/Executive level candidate. 
        Take the following mundane, day-to-day task description and elevate it to emphasize macro-level metrics, long-term strategy, market-entry victories, enterprise digital transformations, or corporate restructuring. 
        Filter out the low-level execution details. Return ONLY the elevated bullet point, without quotes.`;
        break;
      case 'keyword-injector':
        systemPrompt = `You are an ATS-optimization engine. Rewrite the following resume bullet point to naturally weave in the following Job Description keywords without sounding robotic. 
        Target Keywords: ${context?.keywords || ''}.
        Return ONLY the rewritten bullet point, without quotes.`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const prompt = `${systemPrompt}\n\nUser Content:\n${content}`;

    const rawContent = await generateContentWithFallback(
      prompt, 
      { temperature: 0.7 },
      AI_MODELS.REWRITER
    );

    return NextResponse.json({ success: true, result: rawContent.trim() });

  } catch (error: any) {
    console.error('AI Pro Tool Error:', error);
    return NextResponse.json({ error: error.message || 'AI request failed' }, { status: 500 });
  }
}
