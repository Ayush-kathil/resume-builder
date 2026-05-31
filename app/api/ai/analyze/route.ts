import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, Schema } from '@google/generative-ai';
import { ExperienceAnalysisSchema, SkillAnalysisSchema, ProjectAnalysisSchema, AtsAnalysisSchema } from '@/lib/ai-pipeline';
import { AI_MODELS } from '@/lib/ai/models';
import { executeWithRetry } from '@/lib/ai/retry';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 400 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const { resumeData, analysisType } = await req.json();

    if (!resumeData || !analysisType) {
      return NextResponse.json({ error: 'Missing resumeData or analysisType' }, { status: 400 });
    }

    let schema: Schema | undefined;
    let systemInstruction = '';
    let preferredModel = AI_MODELS.PARSER;

    switch (analysisType) {
      case 'experience':
        schema = ExperienceAnalysisSchema as Schema;
        systemInstruction = "Analyze the provided resume JSON for Experience Intelligence. Detect gaps, calculate a trajectory and experienceScore, and identify the seniority progression.";
        break;
      case 'skills':
        schema = SkillAnalysisSchema as Schema;
        preferredModel = AI_MODELS.SKILLS;
        systemInstruction = "Analyze the provided resume JSON for Skill Intelligence. Group all skills into clear technical categories (Frontend, Backend, AI/ML, etc), normalize aliases, and generate confidence scores (0-100) based on their application in the experience section.";
        break;
      case 'projects':
        schema = ProjectAnalysisSchema as Schema;
        preferredModel = AI_MODELS.PROJECTS;
        systemInstruction = "Analyze the provided resume JSON for Project Intelligence. Evaluate the complexity, business impact, architecture quality, and assign a level (Beginner, Intermediate, Advanced, Professional) to each project.";
        break;
      case 'ats':
        schema = AtsAnalysisSchema as Schema;
        preferredModel = AI_MODELS.ATS;
        systemInstruction = "Analyze the provided resume JSON for ATS compliance. Evaluate action verbs, metric usage, readability, and missing sections. Provide an atsScore (0-100) and specific formatting/keyword recommendations.";
        break;
      default:
        return NextResponse.json({ error: 'Invalid analysisType' }, { status: 400 });
    }

    const finalResult = await executeWithRetry(async (modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
        systemInstruction: {
          role: "system",
          parts: [{ text: systemInstruction }]
        }
      });

      const prompt = `Analyze the following resume JSON:\n\n${JSON.stringify(resumeData, null, 2)}`;
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    }, preferredModel);

    return NextResponse.json({ success: true, data: finalResult });

  } catch (error: any) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
