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
  const msg = error?.message || '';
  
  if (msg.includes('429') || msg.includes('Quota exceeded') || msg.includes('Too Many Requests')) {
    return new AIError('AI service is temporarily busy due to high demand. Please try again in a few moments.', 429, true);
  }
  
  if (msg.includes('403') || msg.includes('API key not valid') || msg.includes('Forbidden')) {
    return new AIError('AI service configuration error. Please check API keys.', 403, false);
  }
  
  if (msg.includes('401') || msg.includes('Unauthorized')) {
    return new AIError('AI service configuration error. Unauthorized access.', 401, false);
  }
  
  if (msg.includes('404') || msg.includes('not found') || msg.includes('Model Not Found')) {
    return new AIError('Requested AI model is currently unavailable.', 404, false);
  }
  
  if (msg.includes('503') || msg.includes('Service Unavailable') || msg.includes('overloaded')) {
    return new AIError('AI service is temporarily overloaded. Please try again in a few moments.', 503, true);
  }

  // Fallback 500 error for unknown Gemini errors so we don't leak raw JSON to the frontend
  console.error("Raw Gemini Error:", error);
  return new AIError('An unexpected AI service error occurred. Please try again later.', 500, false);
}
