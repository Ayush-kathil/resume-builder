import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';

// Use the exact key name requested by the user
const apiKey = process.env['GEMINI-API-KEY'] || process.env.GEMINI_API_KEY || '';

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Gemini API Key. Please add GEMINI-API-KEY to your .env file.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const targetRole = formData.get('targetRole') as string | null;

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Instead of using buggy pdf-parse, we will feed the PDF directly to Gemini!
    // Gemini natively supports PDF processing via inlineData and does a MUCH better job
    // because it can see the actual layout of the resume.

    const rolePrompt = targetRole 
      ? `\nCRITICAL REQUIREMENT: The user is specifically targeting the role of "${targetRole}". You MUST heavily tailor the entire resume (summary, bullet points, skills) to highlight experience relevant to a ${targetRole}. Cut out entirely irrelevant experiences if necessary.`
      : '';

    const prompt = `
You are an expert ATS resume parser and writer. Your task is to extract information from the attached resume document (PDF or DOCX) and format it into a strictly typed JSON object.
Enforce the XYZ formula for bullet points where possible (Accomplished [X] as measured by [Y], by doing [Z]).
CRITICALLY IMPORTANT: Rewrite and enhance the resume content so that its ATS score will be strictly greater than 95. Use strong action verbs, incorporate industry-standard keywords, and ensure high impact.
${rolePrompt}

CRITICAL LENGTH LIMIT (SINGLE PAGE REQUIREMENT):
You MUST aggressively shorten the resume so it fits beautifully on a single A4 page. 
- Maximum of 3-4 Work Experiences total. 
- Maximum of 3-4 bullet points per experience (fewer if you have 4 experiences).
- Be incredibly concise. Merge similar bullet points. Strip out "fluff" and generic corporate jargon.
- If the original resume has 10 years of history, only include the most recent or most relevant roles.

The JSON MUST exactly match this TypeScript interface structure:
{
  "personalInfo": {
    "fullName": string,
    "email": string,
    "phone": string,
    "location": string,
    "website": string (optional),
    "linkedin": string (optional),
    "github": string (optional),
    "summary": string
  },
  "experience": [
    {
      "id": string (generate a unique uuid-like string),
      "company": string,
      "position": string,
      "startDate": string (e.g. "Jan 2020"),
      "endDate": string (e.g. "Present" or "Dec 2022"),
      "current": boolean,
      "location": string,
      "description": string[] (Array of bullet points. Max 5. Enforce XYZ formula)
    }
  ],
  "education": [
    {
      "id": string,
      "institution": string,
      "degree": string,
      "fieldOfStudy": string,
      "startDate": string,
      "endDate": string,
      "current": boolean,
      "location": string,
      "gpa": string (optional)
    }
  ],
  "skills": [
    {
      "id": string,
      "category": string (e.g. "Languages", "Frameworks", "Tools"),
      "items": string[]
    }
  ],
  "projects": [
    {
      "id": string,
      "name": string,
      "description": string,
      "url": string (optional),
      "technologies": string[]
    }
  ]
}

Return ONLY the raw JSON object. Do not wrap it in markdown block quotes (like \`\`\`json). Just the raw object.
    `;

    let content: string | undefined;

    // Determine mimeType (fallback to application/pdf)
    let mimeType = 'application/pdf';
    if (file.name && file.name.toLowerCase().endsWith('.docx')) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    try {
      content = await generateContentWithFallback([
        prompt,
        {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType: file.type || mimeType
          }
        }
      ], {
        responseMimeType: 'application/json',
      });
      
    } catch (err: any) {
      console.error('Gemini API call failed:', err);
      // Surface API Key or quota errors gracefully
      if (err.status === 403 || err.message?.includes('API key')) {
        return NextResponse.json({ error: 'Invalid or missing Gemini API Key.' }, { status: 403 });
      }
      if (err.status === 429 || err.message?.includes('quota')) {
        return NextResponse.json({ error: 'Gemini API quota exceeded. Please try again later.' }, { status: 429 });
      }
      throw err;
    }
    
    if (!content) {
      throw new Error('Gemini returned an empty response.');
    }

    // Clean up potential markdown formatting from the response (just in case, despite responseMimeType)
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedJson = JSON.parse(cleanContent);
    return NextResponse.json(parsedJson);

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
