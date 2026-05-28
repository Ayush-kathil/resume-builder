import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env['GEMINI-API-KEY'] || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API Key. Please add GEMINI-API-KEY to your .env file.' }, { status: 401 });
    }

    const { position, type } = await req.json();

    if (!position || !type) {
      return NextResponse.json({ error: 'Position and type are required' }, { status: 400 });
    }

    const prompt = `
      You are an expert technical resume writer.
      Generate exactly 3 powerful, action-oriented, metrics-driven bullet points for a ${position} role.
      Focus on ${type === 'skills' ? 'technical skills and tools' : 'achievements and impact'}.
      Use the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].
      
      Return ONLY a JSON array of strings. Do NOT wrap in markdown \`\`\`json block.
      Example: ["bullet 1", "bullet 2", "bullet 3"]
    `;


    return NextResponse.json({ suggestion: responseText.trim() });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 });
  }
}

