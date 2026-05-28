import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env['GEMINI-API-KEY'] || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { resumeData } = await req.json();

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const prompt = `
You are an expert ATS resume writer. I am providing you with a JSON object representing a user's resume.
Your task is to take this resume and aggressively shorten it so that it perfectly fits onto a single A4 page.

CRITICAL LENGTH LIMITS:
- Maximum of 3-4 Work Experiences total. Cut out older or less relevant experiences.
- Maximum of 3-4 bullet points per experience.
- Be incredibly concise. Merge similar bullet points. Strip out "fluff" and generic corporate jargon.
- Retain only the most impactful metrics (XYZ formula).
- Keep the Education section brief.

DO NOT alter the core structure of the JSON. Do not change the JSON schema.
Only return the shortened, optimized JSON.

Here is the current resume data:
${JSON.stringify(resumeData, null, 2)}

RETURN ONLY VALID JSON. NO MARKDOWN FORMATTING OR BACKTICKS.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent(prompt);
    
    let text = result.response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsedData = JSON.parse(text);
    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('AI Shorten Error:', error);
    return NextResponse.json(
      { error: `Shortening Error: ${error instanceof Error ? error.message : String(error)}` }, 
      { status: 500 }
    );
  }
}
