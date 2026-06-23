import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_MODELS } from '@/lib/ai/models';
import { executeWithRetry } from '@/lib/ai/retry';
import { validatePrompt } from '@/lib/ai/errors';
import { aiRateLimiter } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!aiRateLimiter.check(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 400 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { text } = await req.json();

    validatePrompt(text, 'Bullet point');

    const systemInstruction = `
    You are an elite Google Technical Recruiter.
    Your task is to take a "soft skill" or passive statement and rewrite it into a "Show, Don't Tell" technical achievement.
    
    Rules:
    - Transform passive adjectives into active verbs.
    - If the user says "Great at communication", rewrite as "Facilitated daily standups and unblocked a 5-person engineering team".
    - If the user says "Fast learner", rewrite as "Rapidly onboarded to [Tech Stack] and delivered first production feature within 2 weeks".
    - Make reasonable assumptions to demonstrate the FORMAT they should use, but keep it realistic.
    
    Return ONLY the rewritten bullet point text.
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
    console.error('Show Dont Tell Error:', error);
    const status = error?.statusCode || 500;
    return NextResponse.json({ error: error.message || 'Rewriting failed' }, { status });
  }
}
