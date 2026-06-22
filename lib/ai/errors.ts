export class AIError extends Error {
  public statusCode: number;
  public isQuotaError: boolean;

  constructor(message: string, statusCode: number, isQuotaError: boolean = false) {
    super(message);
    this.name = 'AIError';
    this.statusCode = statusCode;
    this.isQuotaError = isQuotaError;
  }
}

export function parseGeminiError(error: any): AIError {
  const msg = (error?.message || '').toLowerCase();
  
  if (msg.includes('429') || msg.includes('quota exceeded') || msg.includes('too many requests') || msg.includes('resource_exhausted')) {
    return new AIError('AI service is temporarily busy due to high demand. Please try again in a few moments.', 429, true);
  }
  
  if (msg.includes('403') || msg.includes('api key not valid') || msg.includes('forbidden')) {
    return new AIError('AI service configuration error. Please check API keys.', 403, false);
  }
  
  if (msg.includes('401') || msg.includes('unauthorized')) {
    return new AIError('AI service configuration error. Unauthorized access.', 401, false);
  }
  
  // Fix Crash #1 safety net: If a 404 "model not found" slips through 
  // (e.g. a hardcoded gemini-2.5 string somewhere), treat it as a quota/fallback 
  // error so the retry engine tries a different model instead of hard-failing.
  if (msg.includes('404') || msg.includes('not found') || msg.includes('model not found') || msg.includes('model_not_found')) {
    return new AIError('Requested AI model is currently unavailable. Trying a fallback model.', 404, true);
  }
  
  if (msg.includes('503') || msg.includes('service unavailable') || msg.includes('overloaded')) {
    return new AIError('AI service is temporarily overloaded. Please try again in a few moments.', 503, true);
  }
  
  // Fix Crash #17: Empty prompt 400 errors from Gemini — return a 400, not a 500
  if (msg.includes('400') || msg.includes('bad request') || msg.includes('invalid argument')) {
    return new AIError('Invalid request sent to AI service. Please check your input.', 400, false);
  }

  // Fallback 500 error for unknown Gemini errors so we don't leak raw JSON to the frontend
  console.error("Raw Gemini Error:", error);
  return new AIError('An unexpected AI service error occurred. Please try again later.', 500, false);
}

/**
 * Fix Crash #17: Validates that a prompt is non-empty before sending to Gemini.
 * Call this in any route before making an AI request.
 */
export function validatePrompt(text: string | undefined | null, fieldName = 'Input'): void {
  if (!text || text.trim().length === 0) {
    throw new AIError(`${fieldName} cannot be empty. Please provide some content before requesting AI assistance.`, 400, false);
  }
}
