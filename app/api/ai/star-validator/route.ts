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
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 400 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { text } = await req.json();

    validatePrompt(text, 'Bullet point');

    const systemInstruction = `
    You are an elite FAANG Technical Recruiter.
    Your task is to validate whether a bullet point follows the STAR method (Situation, Task, Action, Result).
    Specifically, we care deeply that it has an ACTION and a RESULT (quantified impact).
    
    Return a strictly formatted JSON object:
    {
      "isValid": boolean (true if it has clear action and clear result),
      "feedback": string (A concise 1-sentence critique. If invalid, tell them what is missing. If valid, say "Strong STAR format.")
    }
    
    Do not return any markdown wrappers like \`\`\`json. Return raw JSON.
    `;

    const finalResult = await executeWithRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        }
      });

      const prompt = `Validate this bullet point: ${text}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim().replace(/^```json\s*|```$/g, '');
    }, AI_MODELS.ENHANCE);

    return NextResponse.json(JSON.parse(finalResult));

  } catch (error: any) {
    console.error('STAR Validator Error:', error);
    const status = error?.statusCode || 500;
    return NextResponse.json({ error: error.message || 'Validation failed' }, { status });
  }
}
