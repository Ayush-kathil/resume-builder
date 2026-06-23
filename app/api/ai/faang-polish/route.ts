import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_MODELS } from '@/lib/ai/models';
import { executeWithRetry } from '@/lib/ai/retry';
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
    const { resumeData } = await req.json();

    if (!resumeData) return NextResponse.json({ error: 'Missing resume data' }, { status: 400 });

    const systemInstruction = `
    You are the Ultimate Google Technical Recruiter and Staff Resume Writer.
    Your task is to take a raw resume JSON object and perform a "Nuclear FAANG Polish".
    
    Operations to execute:
    1. Fix all grammar, spelling, and tense inconsistencies.
    2. Convert all passive voice to active voice.
    3. Strengthen every bullet point to use elite Action Verbs.
    4. Ensure the STAR method is strictly followed.
    5. Cut fluff words and jargon.
    
    You must return the EXACT same JSON schema provided to you, just with the text fields professionally enhanced. Do NOT change IDs or array lengths.
    
    Return pure JSON. No markdown wrappers.
    `;

    const finalResult = await executeWithRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        }
      });

      const prompt = `Polish this resume data: ${JSON.stringify(resumeData)}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim().replace(/^```json\s*|```$/g, '');
    }, AI_MODELS.ENHANCE);

    return NextResponse.json(JSON.parse(finalResult));

  } catch (error: any) {
    console.error('FAANG Polish Error:', error);
    const status = error?.statusCode || 500;
    return NextResponse.json({ error: error.message || 'Polishing failed' }, { status });
  }
}
