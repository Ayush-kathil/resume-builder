import { GoogleGenerativeAI, Part, GenerationConfig } from '@google/generative-ai';

// Fallback models in order of preference
// We start with the newest/fastest flash models, then fall back to pro if needed.
const MODELS = [
  'gemini-3.1-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash'
];

export async function generateContentWithFallback(
  promptData: string | Array<string | Part>, 
  config: GenerationConfig = {}
) {
  const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('Missing Gemini API Key. Please add GEMINIAPIKEY to your .env file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: any;
  
  for (const modelName of MODELS) {
    try {
      console.log(`Attempting generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: config
      });
      
      const result = await model.generateContent(promptData as any);
      return result.response.text();
    } catch (error: any) {
      console.warn(`Model ${modelName} failed. Error:`, error.message);
      lastError = error;
      
      // If it's a 403 (Invalid Key) we should probably not retry other models 
      // because the key itself is wrong, but since different models might have 
      // different access levels on the key, we can keep trying.
    }
  }
  
  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
