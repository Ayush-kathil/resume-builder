import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_MODELS } from '@/lib/ai/models';
import { executeWithRetry } from '@/lib/ai/retry';
import { validatePrompt } from '@/lib/ai/errors';
import { aiRateLimiter } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    // Fix Crash #9: Rate limiting to prevent 429 from spamming Enhance button
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!aiRateLimiter.check(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before clicking Enhance again.' },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 400 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { text, context } = await req.json();

    // Fix Crash #17: Validate prompt before sending to Gemini
    validatePrompt(text, 'Bullet point');

    const systemInstruction = `
    You are an elite Staff-Level Technical Resume Writer.
    Your task is to rewrite the provided bullet point into a highly impactful STAR-format achievement.
    
    Requirements:
    - Quantify impact where possible.
    - Use strong action verbs.
    - Be strictly objective and professional (no fluff).
    - ATS optimize the wording.
    
    User Context (Company/Role): ${context || 'None'}
    
    Return ONLY the rewritten bullet point text (no explanations, no quotes, no markdown).
    `;

    const finalResult = await executeWithRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        }
      });

      const prompt = `Rewrite this: ${text}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim().replace(/^\"|\"$|^•\s*/g, '');
    }, AI_MODELS.ENHANCE);

    return NextResponse.json({ success: true, text: finalResult });

  } catch (error: any) {
    console.error('Enhance Error:', error);
    const status = error?.statusCode || 500;
    return NextResponse.json({ error: error.message || 'Enhancement failed' }, { status });
  }
}
