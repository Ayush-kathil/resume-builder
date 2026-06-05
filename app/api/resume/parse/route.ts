import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Get raw buffer from the uploaded file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 2. Extract text natively using pdf2json
    const PDFParser = require('pdf2json');
    const pdfParser = new PDFParser(null, 1);
    
    const rawText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
      pdfParser.parseBuffer(buffer);
    });

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Failed to extract text from PDF. It may be an image-based PDF.' }, { status: 400 });
    }

    // 3. Extract setupData from formData
    let setupContext = '';
    const setupDataStr = formData.get('setupData') as string | null;
    if (setupDataStr) {
      try {
        const setupData = JSON.parse(setupDataStr);
        const { targetRole, targetCompany, targetSkills, achievements } = setupData;
        setupContext = `
CRITICAL TARGET CONTEXT:
The user is specifically targeting the role of: "${targetRole || 'Not specified'}".
Target Company: "${targetCompany || 'Not specified'}".
Key Skills they want to highlight: "${targetSkills || 'Not specified'}".
Special User-Provided Achievements to guarantee inclusion: "${achievements || 'None'}".

You MUST actively bias the extraction of their Experience, Skills, and Projects to highlight aspects relevant to this Target Role and these Key Skills. If they provided specific achievements above, you MUST include them in the achievements section.
`;
      } catch (e) {
        console.error('Failed to parse setupData', e);
      }
    }

    // 4. Optimize and extract to JSON using Google Generative AI
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an elite Resume Optimizer. 
Your goal is to parse the raw text of the user's resume below and extract it into a strictly formatted JSON structure.
${setupContext}

CRITICAL INSTRUCTIONS FOR A STRICT 1-PAGE, HUMANIZED RESUME:
1. STRICT LENGTH LIMITS (1-PAGE RULE):
   - Keep the summary to a maximum of 2 short, impactful sentences.
   - Limit Experience bullet points to MAXIMUM 3-4 bullets per job. Only keep the most impactful achievements.
   - Limit Projects to a MAXIMUM of 2-3 best projects. Discard minor or irrelevant projects. Limit project bullets to 2-3.
2. 100% HUMANIZED LANGUAGE (NO AI BUZZWORDS):
   - DO NOT use obvious AI words like: "Spearheaded", "Architected", "Engineered", "Orchestrated", "Delve", "Synergized", "Revolutionized", "Pioneered".
   - Use natural, professional, and grounded action verbs (e.g., Developed, Built, Led, Managed, Created, Improved).
   - Write in a tone that sounds like a real senior professional wrote it, not an AI.
3. FORMATTING:
   - Rewrite bullet points to focus on Impact (What you did + What the result was).
   - Do NOT hallucinate entirely new jobs or fake metrics, but optimize the existing ones.
   - Tailor and group skills logically (Languages, Frameworks, Tools) based on modern job requirements.
   - For 'achievements', meticulously extract LeetCode/CodeChef ratings, Hackathon ranks, and awards as a simple array of strings.
   - For 'responsibilities', extract leadership roles and extracurriculars. 
   - CRITICAL DUPLICATION RULE: Ensure ABSOLUTELY NO DUPLICATES exist within or across any sections. An item must belong to ONE section only. If it's a job/internship, put it ONLY in 'experience'. If it's a club/volunteer role, put it ONLY in 'responsibilities'. NEVER output the exact same company/role twice.
   - For 'projects' and 'experience', generate EXACTLY 2-3 highly impactful, pro-level, 100% humanized bullet points per item. Emphasize senior-level phrasing. Perfect balance between technical metrics and natural language. Avoid robotic extremes.
   - Return ONLY valid JSON matching this exact structure:

{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string",
    "summary": "string"
  },
  "experience": [
    {
      "id": "generate-uuid",
      "company": "string",
      "position": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "description": ["string", "string"] // these must be the rewritten X-Y-Z FAANG bullet points
    }
  ],
  "education": [
    {
      "id": "generate-uuid",
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string",
      "coursework": "string"
    }
  ],
  "achievements": ["string", "string"],
  "responsibilities": [
    {
      "id": "generate-uuid",
      "company": "Organization Name",
      "position": "Role Name",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "description": ["string", "string"]
    }
  ],
  "skills": [
    {
      "id": "generate-uuid",
      "category": "string (e.g. Languages, Frameworks, Tools)",
      "items": ["string", "string"]
    }
  ],
  "projects": [
    {
      "id": "generate-uuid",
      "name": "string",
      "description": ["string", "string"], // FAANG-optimized bullet points
      "technologies": ["string", "string"],
      "url": "string"
    }
  ],
  "sectionOrder": ["summary", "education", "experience", "projects", "responsibilities", "skills", "achievements"]
}

RAW RESUME TEXT:
"""
${rawText}
"""
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    
    const responseText = result.response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse AI response into JSON' }, { status: 500 });
    }

    return NextResponse.json({ data: jsonData }, { status: 200 });

  } catch (error: any) {
    console.error('PDF Parse Error:', error);
    
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred while parsing the document.';

    const errStr = error.message || String(error);
    if (errStr.includes('503') || errStr.toLowerCase().includes('high demand') || errStr.toLowerCase().includes('busy') || errStr.toLowerCase().includes('quota')) {
      statusCode = 503;
      errorMessage = 'AI service is temporarily busy due to high demand. Spikes in demand are usually temporary. Please try again in a few moments.';
    } else {
      errorMessage = errStr;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
