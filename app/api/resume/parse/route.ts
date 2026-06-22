import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 60; // 60 seconds to prevent Vercel timeout on large PDFs
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
    // Use gemini-2.5-flash as the primary, fallback to pro if needed
    const primaryModelName = 'gemini-2.5-flash';
    let model = genAI.getGenerativeModel({ model: primaryModelName });

    const prompt = `
You are an elite Senior Technical Recruiter at Google. 
Your goal is to parse the raw text of the user's resume below and extract it into a strictly formatted JSON structure that meets the highest FAANG hiring bars.
${setupContext}

CRITICAL FAANG-LEVEL INSTRUCTIONS (THE 10 ENGINE DIRECTIVES & 20 ERROR DESTRUCTIONS):

1. STRICT LENGTH & VISUAL HIERARCHY (1-PAGE RULE):
   - Keep the summary to a maximum of 2 short, impactful sentences. No Objective Statements (e.g. "Seeking a software engineering role").
   - Limit Experience to MAXIMUM 4 bullets per job. Limit Projects to 2-3 best projects with max 3 bullets each.
   - Ruthlessly summarize to prevent "orphan lines" (single words wrapping to a new line) and exceeding 1 page.

2. THE STAR / XYZ FRAMEWORK ENFORCER:
   - EVERY single bullet point MUST be rewritten into the XYZ format: "Accomplished [X] as measured by [Y], by doing [Z]".
   - Distinguish between "Impact" (what value was delivered) and "Duty" (what they were told to do). Delete task-based bullets entirely.

3. METRIC & QUANTIFICATION VALIDATOR:
   - Hunt down "Ghost Metrics" (e.g. "improved performance significantly"). You MUST quantify bullet points (%, $, ms, users). If no metric exists, intelligently extrapolate a realistic scale based on context, but do not hallucinate fake numbers randomly.

4. ACTION-VERB OPTIMIZER & LANGUAGE:
   - DESTROY weak openers ("Worked on", "Responsible for", "Helped with", "Duties included").
   - REPLACE them with elite verbs ("Architected", "Engineered", "Optimized", "Designed", "Developed").
   - NEVER use first-person pronouns ("I", "Me", "We", "My").
   - 100% HUMANIZED: Avoid robotic AI buzzwords ("Spearheaded", "Delve", "Synergized", "Revolutionized").

5. TECH STACK TAXONOMY & ATS RELEVANCY:
   - Intelligently group skills into categories like "Languages", "Frameworks", "Databases", "Tools".
   - DESTROY soft skills from the skills list ("Team Player", "Hard Worker"). Soft skills must be demonstrated in bullets, not listed.
   - Filter out vague tech exposure ("Familiar with React"). If it's in the skills list, it should ideally appear in the bullets.
   - Avoid keyword stuffing.

6. CONTENT FILTERS & REDUNDANCY ELIMINATOR:
   - Strip out internal company jargon and translate to industry-standard terminology.
   - Detect and eliminate task duplication (saying the exact same thing across multiple jobs).
   - Omit irrelevant hobbies. Extract competitive programming (LeetCode/CodeChef) or Hackathon ranks into 'achievements'.
   - Extract leadership/club roles into 'responsibilities'.
   - ONLY include "City, State" for location. Remove full street addresses.

7. CRITICAL DUPLICATION RULE: 
   - An item must belong to ONE section only. A job goes ONLY in 'experience'. A club goes ONLY in 'responsibilities'. NEVER output the exact same company/role twice.

8. JSON OUTPUT REQUIREMENTS:
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

    let result;
    try {
      console.log(`[AI] Attempting generation with primary model: ${primaryModelName}`);
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
    } catch (primaryError: any) {
      console.warn(`[AI] Primary model (${primaryModelName}) failed:`, primaryError.message);
      
      // Fallback logic
      const fallbackModelName = 'gemini-2.5-pro';
      console.log(`[AI] Attempting fallback with model: ${fallbackModelName}`);
      
      try {
        model = genAI.getGenerativeModel({ model: fallbackModelName });
        result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
      } catch (fallbackError: any) {
        console.error(`[AI] Fallback model (${fallbackModelName}) also failed:`, fallbackError.message);
        throw new Error(`Both primary and fallback models failed. Last error: ${fallbackError.message}`);
      }
    }
    
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
    const errStr = error.message || String(error);
    
    // User-friendly error mapping
    let errorMessage = 'An unexpected error occurred while processing your resume.';
    
    if (errStr.includes('404') || errStr.includes('not found')) {
      statusCode = 404;
      errorMessage = 'The AI model requested is currently unavailable. Please contact support to update the model configuration.';
    } else if (errStr.includes('503') || errStr.toLowerCase().includes('quota') || errStr.toLowerCase().includes('exhausted')) {
      statusCode = 503;
      errorMessage = 'Our AI service is currently experiencing high demand. Please try again in a few moments.';
    } else if (errStr.includes('401') || errStr.includes('403') || errStr.includes('API_KEY_INVALID')) {
      statusCode = 401;
      errorMessage = 'AI service authentication failed. The system API key may be invalid or expired.';
    }

    return NextResponse.json({ error: errorMessage, details: errStr }, { status: statusCode });
  }
}
