import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const pdfParse = require('pdf-parse');

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
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

    const systemPrompt = `You are a world-class AI Resume Parser designed to ingest raw, potentially chaotic resume text (often from multi-column PDFs) and output a perfectly structured JSON object matching the \`ResumeData\` schema.

    CRITICAL INSTRUCTIONS:
    1. **Semantic Entity Extraction**: Accurately differentiate between tools used at jobs vs general skills.
    2. **Temporal Chronology Mapping**: Ensure dates are correctly formatted (e.g., 'Jan 2020 - Present'). Order experience chronologically, newest first.
    3. **Implicit Skill Synthesis**: Read passive bullet points and infer core competencies. Populate the \`skills\` array with these synthesized technical/soft skills categorized logically (e.g., "Languages", "Frameworks", "Soft Skills").
    4. **Automatic Taxonomical Standardization**: Standardize quirky job titles to their global industry equivalents (e.g., 'Code Ninja' -> 'Software Engineer').

    You MUST return ONLY valid JSON matching this structure exactly (no markdown formatting, no \`\`\`json tags):
    {
      "personalInfo": {
        "fullName": "...",
        "email": "...",
        "phone": "...",
        "location": "...",
        "website": "...",
        "linkedin": "...",
        "github": "...",
        "summary": "..."
      },
      "experience": [
        { "id": "uuid", "company": "...", "position": "...", "location": "...", "startDate": "...", "endDate": "...", "current": false, "description": ["bullet 1", "bullet 2"] }
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
