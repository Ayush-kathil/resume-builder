import { NextResponse } from 'next/server';
import { generateContentWithFallback } from '@/lib/gemini';
import { generateParsePrompt } from '@/lib/ai-pipeline';
import { AI_MODELS } from '@/lib/ai/models';
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

    const systemPrompt = generateParsePrompt(setupData);
    const prompt = `Parse the following resume text:\n\n${textContent}`;

    const rawContent = await generateContentWithFallback(
      prompt, 
      { temperature: 0.1 }, 
      AI_MODELS.PARSER, 
      systemPrompt
    );
    
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
