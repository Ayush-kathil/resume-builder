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
    You are a Senior Technical Recruiter and Hiring Manager at a FAANG company (Google/Meta/Apple).
    The candidate has submitted their resume.
    Your task is to review their experience and generate exactly 5 aggressive, highly specific interview questions tailored to the claims made in their bullet points.
    
    Output format: Return ONLY a JSON array of strings. Do not use markdown wrappers like \`\`\`json.
    Example: ["You stated you increased revenue by 10%. How exactly did you measure that?", "Tell me about a time the React architecture you built failed."]
    `;

    const finalResult = await executeWithRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        }
      });

      const prompt = `Generate 5 interview questions based on this resume: ${JSON.stringify(resumeData)}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim().replace(/^```json\s*|```$/g, '');
    }, AI_MODELS.ENHANCE);

    return NextResponse.json(JSON.parse(finalResult));

  } catch (error: any) {
    console.error('Interview Prep Error:', error);
    const status = error?.statusCode || 500;
    return NextResponse.json({ error: error.message || 'Generation failed' }, { status });
  }
}
