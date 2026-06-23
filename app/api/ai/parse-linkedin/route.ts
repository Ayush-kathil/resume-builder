import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_MODELS } from '@/lib/ai/models';
import { executeWithRetry } from '@/lib/ai/retry';
import { aiRateLimiter } from '@/lib/rateLimit';
import { initialResumeData } from '@/types/resume';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!aiRateLimiter.check(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 400 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { linkedinText } = await req.json();

    if (!linkedinText) return NextResponse.json({ error: 'Missing LinkedIn text' }, { status: 400 });

    const systemInstruction = `
    You are an expert ATS Resume Parser.
    Your job is to take a massive, unstructured blob of text copy-pasted from a user's LinkedIn profile page, and structure it PERFECTLY into the exact JSON schema provided.
    
    Target JSON Schema Structure:
    ${JSON.stringify(initialResumeData)}
    
    Rules:
    1. Extract the name, email, and linkedin URL into personalInfo.
    2. Extract all Experience into the experience array. Generate UUIDs for the 'id' field. Try to format descriptions into 3-4 professional bullet points.
    3. Extract all Education into the education array. Generate UUIDs for the 'id' field.
    4. Group all unstructured skills into logical categories (Languages, Frameworks, Tools) inside the skills array. Generate UUIDs.
    5. Return ONLY pure JSON. No markdown wrappers like \`\`\`json.
    `;

    const finalResult = await executeWithRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        }
      });

      const prompt = `Parse this LinkedIn text into the JSON schema: \n\n${linkedinText}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim().replace(/^```json\s*|```$/g, '');
    }, AI_MODELS.ENHANCE);

    return NextResponse.json(JSON.parse(finalResult));

  } catch (error: any) {
    console.error('LinkedIn Parser Error:', error);
    const status = error?.statusCode || 500;
    return NextResponse.json({ error: error.message || 'Parsing failed' }, { status });
  }
}
