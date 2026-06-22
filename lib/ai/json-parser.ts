/**
 * A robust JSON parser specifically designed to handle AI outputs.
 * Fix Crash #8: AI models often wrap JSON in markdown blocks (e.g., ```json ... ```) 
 * and sometimes include trailing commas, extra whitespace, or control characters.
 */
export function parseAIJson<T>(rawText: string): T {
  let cleaned = rawText.trim();
  
  // Remove markdown json wrapping (handles both ```json and ``` variants)
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
  cleaned = cleaned.replace(/\n?```\s*$/i, '');
  cleaned = cleaned.trim();

  // Remove any BOM or zero-width characters that break JSON.parse
  cleaned = cleaned.replace(/^\uFEFF/, '');
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Find the first { or [ to strip any leading text before JSON begins
  const firstBrace = cleaned.search(/[{[]/);
  if (firstBrace > 0) {
    cleaned = cleaned.slice(firstBrace);
  }

  // Find the last } or ] to strip any trailing text after JSON ends
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));
  if (lastBrace !== -1 && lastBrace < cleaned.length - 1) {
    cleaned = cleaned.slice(0, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("AI JSON Parse Error. Raw string (first 500 chars):", rawText.slice(0, 500));
    
    // Attempt auto-fixes in order of likelihood:
    try {
      // 1. Remove trailing commas before closing braces/brackets
      let fixed = cleaned.replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(fixed) as T;
    } catch {
      try {
        // 2. Remove single-line comments (// ...) that Gemini sometimes adds
        let fixed = cleaned.replace(/\/\/[^\n]*/g, '');
        // 3. Remove trailing commas again after comment removal
        fixed = fixed.replace(/,\s*([\]}])/g, '$1');
        return JSON.parse(fixed) as T;
      } catch (fallbackError) {
        throw new Error(`Failed to parse AI JSON output: ${(fallbackError as Error).message}`);
      }
    }
  }
}
