import { parseAIJson } from '@/lib/ai/json-parser';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Schema } from '@google/generative-ai';
import { JdMatchingSchema } from '@/lib/ai-pipeline';
import { AI_MODELS } from '@/lib/ai/models';
import { executeWithRetry } from '@/lib/ai/retry';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 400 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { resumeData, jobDescription } = await req.json();

    if (!resumeData || !jobDescription) {
      return NextResponse.json({ error: 'Missing resumeData or jobDescription' }, { status: 400 });
    }

    const systemInstruction = "Analyze the provided resume JSON against the provided Job Description. Perform detailed gap analysis. Return a matchScore (0-100) and highlight matched/missing skills.";

    const finalResult = await executeWithRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: JdMatchingSchema as Schema,
        },
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        }
      });

      const prompt = `RESUME JSON:\n${JSON.stringify(resumeData)}\n\nJOB DESCRIPTION:\n${jobDescription}`;
      const result = await model.generateContent(prompt);
      return parseAIJson(result.response.text());
    }, AI_MODELS.JD_MATCHER);

    return NextResponse.json({ success: true, data: finalResult });

  } catch (error: any) {
    console.error('JD Match Error:', error);
    return NextResponse.json({ error: error.message || 'Match failed' }, { status: 500 });
  }
}
