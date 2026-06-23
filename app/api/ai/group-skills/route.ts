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
    const { skills } = await req.json();

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: 'Invalid skills array' }, { status: 400 });
    }

    const systemInstruction = `
    You are an elite Technical Resume Formatter.
    Your task is to take a raw list of skills and group them perfectly into standard FAANG categories.
    
    Common Categories to use (only use what is necessary):
    - Languages
    - Frameworks & Libraries
    - Databases
    - Tools & Platforms
    - Cloud & DevOps
    
    Return a strictly formatted JSON array of objects:
    [
      { "category": "Languages", "skills": ["Python", "JavaScript"] },
      { "category": "Tools", "skills": ["Git", "Docker"] }
    ]
    
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

      const prompt = `Group these skills: ${skills.join(', ')}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim().replace(/^```json\s*|```$/g, '');
    }, AI_MODELS.ENHANCE);

    return NextResponse.json(JSON.parse(finalResult));

  } catch (error: any) {
    console.error('Group Skills Error:', error);
    const status = error?.statusCode || 500;
    return NextResponse.json({ error: error.message || 'Grouping failed' }, { status });
  }
}
