import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
});

export async function POST(req: Request) {
  try {
    // Polyfill DOMMatrix for pdf-parse (pdfjs-dist) in Node 18+
    if (typeof globalThis.DOMMatrix === 'undefined') {
      (globalThis as any).DOMMatrix = class DOMMatrix {};
    }

    const pdfParse = require('pdf-parse');
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
    
    // Fallback simple PDF text extraction (Note: For true Layout-Aware Vision OCR, 
    // we would convert PDF pages to images and send to gpt-4o's vision model.
    // For this demonstration, we use pdf-parse combined with gpt-4o's advanced semantic extraction).
    let textContent = '';
    try {
       const pdfData = await pdfParse(buffer);
       textContent = pdfData.text;
    } catch (e) {
       console.error("PDF Parse error", e);
       return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Parse the following resume text:\n\n${textContent}` }
      ],
      temperature: 0.1, // Low temperature for high deterministic accuracy
    });

    const rawContent = completion.choices[0].message.content || '{}';
    
    // Safely parse JSON (strip markdown if model accidentally includes it)
    const cleanedContent = rawContent.replace(/```json\n?|\n?```/g, '').trim();
    const parsedData = JSON.parse(cleanedContent);

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error('Advanced Parsing Error:', error);
    return NextResponse.json({ error: error.message || 'Parsing failed' }, { status: 500 });
  }
}
