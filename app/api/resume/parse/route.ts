import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import PDFParser from 'pdf2json';

export const dynamic = 'force-dynamic';

// Advanced, bulletproof PDF extraction utilizing pdf2json (Pure Node.js, no DOM required)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-expect-error: the type definitions incorrectly expect a boolean, but pdf2json supports 1 for text parsing
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
       const rawText = await extractTextFromPDF(buffer);
       textContent = rawText.replace(/\n{3,}/g, '\n\n').trim();
    } catch (e: any) {
       console.error("PDF Parse error", e);
       return NextResponse.json({ error: `Failed to extract text from PDF: ${e.message || e.toString()}` }, { status: 500 });
    }

    const systemPrompt = `You are a world-class AI Resume Parser and Career Engineer. Your task is to ingest raw, potentially chaotic, OCR-scanned, or unstructured resume text and output a perfectly structured JSON object matching the \`ResumeData\` schema.

    The user has provided specific SETUP CONTEXT to upgrade their resume during this parse step:
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
    1. **Multi-Format & Noise Filtering**: The input may be from messy PDFs, OCR text, or web scraping. Filter out watermarks, page numbers, and repetitive headers/footers. Extract tables and multi-column layouts logically.
    2. **Intelligent Section Detection**: Map non-standard headings (e.g., "Work History", "Career Journey") to "Experience", and combine scattered skills sections.
    3. **Personal Info Extraction & Validation**: You MUST actively search the text for URLs (linkedin.com, github.com, personal portfolio domains) and ensure they are populated in the JSON output. Detect and validate email addresses. Normalize phone numbers. Clean and verify LinkedIn and GitHub URLs.
    4. **Experience Parsing (CRITICAL)**: Normalize all dates to standard formats. Detect employment gaps and synthesize bridging entries if the user explained them in SETUP CONTEXT. Identify career progression (e.g., Intern -> Junior -> Senior) and ensure the timeline is clear and chronological (newest first). Standardize quirky job titles to global industry equivalents.
    5. **Bullet Point Intelligence**: You MUST convert poor, passive bullets into a highly impactful structure based on the formula: "Accomplished [X] as measured by [Y] by doing [Z]". However, DO NOT use those exact robotic words. Use humanized, varied, and natural language (e.g., "Boosted user retention by 40% through the implementation of a Redis caching layer"). Inject action verbs, highlight technologies, and explicitly extract metrics. Make the tone strictly objective and highly professional without dramatic fluff.
    6. **Skills Extraction Engine**: Extract skills from ALL sections (Skills, Experience, Projects). You MUST automatically categorize them into distinct buckets: "Programming", "Frontend", "Backend", "Cloud", "DevOps", "Database", "AI/ML", and "Tools". Ensure the user's "New Skills" are woven in appropriately.
    7. **Project Parsing**: Extract the tech stack, impact, features built, and complexity level for each project. Summarize the project description accurately.
    8. **FAANG Single-Page Constraint**: Even if the input is massive, summarize, condense, and select only the most impactful points to fit a single-page FAANG resume format. Limit experience bullets to 3-4 per role.
    9. **Omissions**: Leave omitted sections as empty arrays [].

    You MUST return ONLY valid JSON matching this structure exactly (no markdown formatting, no \`\`\`json tags):
    {
      "personalInfo": {
        "fullName": "...",
        "email": "...",
        "phone": "...",
        "location": "...",
        "linkedin": "...",
        "github": "...",
        "website": "...",
        "summary": "..." // Generate a highly targeted summary incorporating the Target Role, Tone, and JD keywords. Max 2 punchy lines.
      },
      "experience": [
        { "id": "uuid", "company": "...", "position": "...", "location": "...", "startDate": "...", "endDate": "...", "current": false, "description": ["augmented bullet 1", "augmented bullet 2"] }
      ],
      "education": [
        { "id": "uuid", "institution": "...", "degree": "...", "fieldOfStudy": "...", "location": "...", "startDate": "...", "endDate": "...", "current": false, "gpa": "..." }
      ],
      "skills": [
        { "id": "uuid", "category": "Programming", "items": ["Python", "Java"] },
        { "id": "uuid", "category": "Frontend", "items": ["React", "HTML"] }
      ],
      "projects": [
        { "id": "uuid", "name": "...", "description": "...", "technologies": ["tech1", "tech2"], "url": "..." }
      ]
    }`;

    const prompt = `${systemPrompt}\n\nParse the following resume text:\n\n${textContent}`;

    const rawContent = await generateContentWithFallback(prompt, { temperature: 0.1 });
    
    // Safely parse JSON (strip markdown if model accidentally includes it)
    const cleanedContent = rawContent.replace(/```json\n?|\n?```/g, '').trim();
    const parsedData = JSON.parse(cleanedContent);

    // Ensure all items have unique IDs
    if (parsedData.experience) parsedData.experience.forEach((e: any) => e.id = crypto.randomUUID());
    if (parsedData.education) parsedData.education.forEach((e: any) => e.id = crypto.randomUUID());
    if (parsedData.skills) parsedData.skills.forEach((e: any) => e.id = crypto.randomUUID());
    if (parsedData.projects) parsedData.projects.forEach((e: any) => e.id = crypto.randomUUID());

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: any) {
    console.error('Advanced Parsing Error:', error);
    return NextResponse.json({ error: error.message || 'Parsing failed' }, { status: 500 });
  }
}
