import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env['GEMINI-API-KEY'] || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API Key. Please add GEMINI-API-KEY to your .env file.' }, { status: 401 });
    }

    const { text, context } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const prompt = `
      You are an expert resume writer and career coach.
      Please rewrite the following bullet point to make it more impactful.
      Use the STAR (Situation, Task, Action, Result) or PAR (Problem, Action, Result) framework.
      Start with a strong action verb.
      Quantify results where possible.
      Do NOT use cliché or generic corporate jargon. Output only the rewritten text.

      Original text: "${text}"
      Context (e.g. role or industry): "${context || 'General professional'}"
    `;

    const modelsToTry = ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-2.5-flash'];
    let responseText = '';
    let lastError: any;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) {
          console.log(`Successfully generated suggestion using model: ${modelName}`);
          break; // Exit the loop if successful
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err.message);
        lastError = err;
      }
    }

    if (!responseText) {
      throw lastError || new Error('All Gemini models returned an empty response or failed.');
    }

    return NextResponse.json({ suggestion: responseText.trim() });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 });
  }
}

