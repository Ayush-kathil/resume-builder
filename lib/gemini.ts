import { GoogleGenerativeAI, Part, GenerationConfig } from '@google/generative-ai';
import { executeWithRetry } from './ai/retry';
import { AI_MODELS } from './ai/models';

/**
 * Executes a Gemini request with built-in retry logic, model fallbacks, 
 * and rate-limit backoffs.
 */
export async function generateContentWithFallback(
  promptData: string | Array<string | Part>, 
  config: GenerationConfig = {},
  preferredModel: string = AI_MODELS.CHAT,
  systemInstruction?: string
) {
  const apiKey = process.env.GEMINIAPIKEY || process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('Missing Gemini API Key. Please add GEMINIAPIKEY to your .env file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // AbortController for request timeouts (60 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const resultText = await executeWithRetry(async (modelName) => {
      const modelConfig: any = {
        model: modelName,
        generationConfig: config
      };
      
      if (systemInstruction) {
        modelConfig.systemInstruction = {
          role: "system",
          parts: [{ text: systemInstruction }]
        };
      }

      const model = genAI.getGenerativeModel(modelConfig);
      
      // Pass the signal if the API supports it, otherwise rely on the retry logic to catch fetch errors
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: Array.isArray(promptData) ? promptData as any : [{ text: promptData }] }]
      });
      
      return result.response.text();
    }, preferredModel);

    return resultText;
  } finally {
    clearTimeout(timeoutId);
  }
}
