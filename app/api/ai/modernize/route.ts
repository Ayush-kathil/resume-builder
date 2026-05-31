import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { AI_MODELS } from '@/lib/ai/models';
import { executeWithRetry } from '@/lib/ai/retry';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 400 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { legacyResume } = await req.json();

    if (!legacyResume) {
      return NextResponse.json({ error: 'Missing legacyResume data' }, { status: 400 });
    }

    const systemInstruction = `
    You are an elite Enterprise Resume Transformation Engine.
    Your task is to take a legacy/messy JSON resume and completely modernize it while strictly preserving facts, dates, companies, and core achievements.
    
    You must output a JSON object containing 5 specific formats:
    1. originalResume: The legacy data (exactly as provided).
    2. parsedResume: The legacy data cleaned and mapped to the standard schema without rewriting content.
    3. enhancedResume: The parsed resume with all bullets rewritten into STAR-format using elite action verbs and quantified metrics (inferred or placeholder).
    4. atsResume: A stripped-down, highly keyword-dense version optimized purely for ATS parsers (no fluff).
    5. modernResume: The final, perfectly formatted version balancing ATS-friendliness with human readability.
    `;

    const ModernizationSchema = {
      type: SchemaType.OBJECT,
      properties: {
        originalResume: { type: SchemaType.OBJECT },
        parsedResume: { type: SchemaType.OBJECT },
        enhancedResume: { type: SchemaType.OBJECT },
        atsResume: { type: SchemaType.OBJECT },
        modernResume: { type: SchemaType.OBJECT }
      },
      required: ["originalResume", "parsedResume", "enhancedResume", "atsResume", "modernResume"]
    };

    const finalResult = await executeWithRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: ModernizationSchema as Schema,
        },
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        }
      });

      const prompt = `Modernize this legacy resume:\n\n${JSON.stringify(legacyResume)}`;
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    }, AI_MODELS.MODERNIZE);

    return NextResponse.json({ success: true, data: finalResult });

  } catch (error: any) {
    console.error('Modernize Error:', error);
    return NextResponse.json({ error: error.message || 'Modernization failed' }, { status: 500 });
  }
}
