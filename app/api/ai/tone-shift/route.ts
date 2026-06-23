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
    const { resumeData, tone } = await req.json();

    if (!resumeData || !tone) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    let persona = '';
    if (tone === 'Aggressive') {
      persona = 'Rewrite every single bullet point to sound extremely aggressive, hyper-confident, and relentlessly focused on massive business impact. Use strong power verbs like "Dominated", "Spearheaded", "Engineered", "Overhauled".';
    } else if (tone === 'Analytical') {
      persona = 'Rewrite every single bullet point to sound hyper-analytical, data-driven, and methodical. Focus heavily on metrics, optimization, architecture, algorithms, and precise measurements. Use words like "Quantified", "Optimized", "Architected", "Analyzed".';
    } else {
      persona = 'Rewrite every single bullet point to sound collaborative, empathetic, and leadership-oriented. Focus on cross-functional teamwork, mentorship, and lifting others up. Use words like "Mentored", "Facilitated", "Collaborated", "Fostered".';
    }

    const systemInstruction = `
    You are an expert Resume Editor.
    You will receive a JSON representing a resume.
    ${persona}
    
    You must return the EXACT same JSON schema provided to you, just with the text fields professionally enhanced to match this psychological tone. Do NOT change IDs or array lengths.
    
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

      const prompt = `Shift the tone of this resume data to ${tone}: ${JSON.stringify(resumeData)}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim().replace(/^```json\s*|```$/g, '');
    }, AI_MODELS.ENHANCE);

    return NextResponse.json(JSON.parse(finalResult));

  } catch (error: any) {
    console.error('Tone Shift Error:', error);
    const status = error?.statusCode || 500;
    return NextResponse.json({ error: error.message || 'Tone shift failed' }, { status });
  }
}
