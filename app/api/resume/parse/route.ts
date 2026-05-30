import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import PDFParser from 'pdf2json';

export const dynamic = 'force-dynamic';

// Advanced, bulletproof PDF extraction utilizing pdf2json (Pure Node.js, no DOM required)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-ignore: the type definitions incorrectly expect a boolean, but pdf2json supports 1 for text parsing
    const pdfParser = new PDFParser(null, 1);
    
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });
    
    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const setupDataString = formData.get('setupData') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    let setupData: any = {};
    if (setupDataString) {
      try {
        setupData = JSON.parse(setupDataString);
      } catch (e) {
        console.error("Failed to parse setupData");
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    let textContent = '';
    try {
       textContent = await extractTextFromPDF(buffer);
    } catch (e: any) {
       console.error("PDF Parse error", e);
       return NextResponse.json({ error: `Failed to extract text from PDF: ${e.message || e.toString()}` }, { status: 500 });
    }

    const systemPrompt = `You are a world-class AI Resume Parser designed to ingest raw, potentially chaotic resume text and output a perfectly structured JSON object matching the \`ResumeData\` schema.

    The user has also provided specific SETUP CONTEXT to upgrade their resume during this parse step:
    - Target Role: ${setupData.targetRole || 'None provided'}
    - Target JD: ${setupData.targetJD || 'None provided'}
    - Industry Keywords: ${setupData.industryKeywords || 'None provided'}
    - New Achievements: ${setupData.achievements || 'None provided'}
    - New Skills: ${setupData.newSkills || 'None provided'}
    - Explaining Gaps: ${setupData.gaps || 'None provided'}
    - Metrics to Add: ${setupData.metrics || 'None provided'}
    - Business Outcomes: ${setupData.businessOutcomes || 'None provided'}
    - Tone: ${setupData.tone || 'Professional'}
    - Sections to Omit: ${setupData.sectionsToRemove || 'None provided'}

    CRITICAL INSTRUCTIONS:
    1. **Semantic Entity Extraction**: Extract tools/skills accurately. Weave the user's "New Skills" into the skills array.
    2. **Temporal Chronology Mapping**: Order experience chronologically, newest first. If the user mentioned "Gaps to explain", add a synthesized experience entry bridging that gap if appropriate.
    3. **Augmentation**: Rewrite and augment the passive bullet points using the user's "Metrics to Add", "New Achievements", and "Business Outcomes". Make the resume fit the requested "${setupData.tone}" Tone.
    4. **Automatic Taxonomical Standardization**: Standardize quirky job titles to global industry equivalents.
    5. **Omissions**: If they requested to omit certain sections, leave those arrays empty.

    You MUST return ONLY valid JSON matching this structure exactly (no markdown formatting, no \`\`\`json tags):
    {
      "personalInfo": {
        "fullName": "...",
        "email": "...",
        "phone": "...",
        "location": "...",
        "summary": "..." // Generate a brand new, highly targeted summary incorporating the Target Role, Tone, and JD keywords.
      },
      "experience": [
        { "id": "uuid", "company": "...", "position": "...", "location": "...", "startDate": "...", "endDate": "...", "current": false, "description": ["augmented bullet 1", "augmented bullet 2"] }
      ],
      "education": [
        { "id": "uuid", "institution": "...", "degree": "...", "fieldOfStudy": "...", "location": "...", "startDate": "...", "endDate": "...", "current": false, "gpa": "..." }
      ],
      "skills": [
        { "id": "uuid", "category": "...", "items": ["skill1", "skill2"] }
      ],
      "projects": [
        { "id": "uuid", "name": "...", "description": "...", "technologies": ["tech1"], "url": "..." }
      ]
    }`;

    const prompt = `${systemPrompt}\n\nParse the following resume text:\n\n${textContent}`;

    const rawContent = await generateContentWithFallback(prompt, { temperature: 0.1 });
    
    // Safely parse JSON (strip markdown if model accidentally includes it)
    const cleanedContent = rawContent.replace(/```json\n?|\n?```/g, '').trim();
    const parsedData = JSON.parse(cleanedContent);

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error('Advanced Parsing Error:', error);
    return NextResponse.json({ error: error.message || 'Parsing failed' }, { status: 500 });
  }
}
