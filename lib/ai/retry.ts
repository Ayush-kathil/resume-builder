import { AIError, parseGeminiError } from './errors';
import { MODEL_FALLBACKS } from './models';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';

// Exponential backoff delays: 2s, 5s, 10s
const RETRY_DELAYS = [2000, 5000, 10000];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function executeWithRetry<T>(
  operation: (modelName: string) => Promise<T>,
  preferredModel: string
): Promise<T> {
  let attempt = 0;
  const maxAttempts = RETRY_DELAYS.length + 1; // Initial + 3 retries
  let lastError: any = null;

  // We start by trying the preferred model. If it fails, we cycle through the fallbacks 
  // and backoff appropriately if it's a rate limit issue.
  const modelsToTry = [preferredModel, ...MODEL_FALLBACKS.filter(m => m !== preferredModel)];

  for (const modelName of modelsToTry) {
    while (attempt < maxAttempts) {
      try {
        console.log(`[AI Engine] Attempt ${attempt + 1}: Using model ${modelName}`);
        return await operation(modelName);
      } catch (rawError: any) {
        lastError = rawError;
        const aiError = parseGeminiError(rawError);
        
        // If it's a quota error or service unavailable, we back off and retry
        if (aiError.isQuotaError && attempt < RETRY_DELAYS.length) {
          const waitTime = RETRY_DELAYS[attempt];
          console.warn(`[AI Engine] ${aiError.message} Retrying in ${waitTime}ms...`);
          await delay(waitTime);
          attempt++;
        } else if (aiError.isQuotaError) {
          // Exhausted retries for this model, break inner loop to try next model
          console.warn(`[AI Engine] Exhausted retries for model ${modelName}. Switching to fallback.`);
          attempt = 0; // Reset attempts for the next model
          break;
        } else {
          // It's a hard error (403, 401, etc), throw immediately
          throw aiError;
        }
      }
    }
  }

  // If we get here, all models and retries failed
  throw parseGeminiError(lastError);
}
