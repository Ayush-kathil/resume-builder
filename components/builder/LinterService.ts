export interface LintResult {
  text: string;
  hasNumbers: boolean;
  weakVerbs: string[];
  isTooLong: boolean;
}

const WEAK_VERBS = [
  'helped', 'worked', 'responsible for', 'did', 'made', 'was', 'managed',
  'handled', 'part of', 'assisted', 'supported', 'contributed'
];

export const LinterService = {
  analyzeBullet: (text: string): LintResult => {
    // Check for numbers, percentages, dollar amounts (including formats like $10M, 50%)
    const numberRegex = /\d+(?:,\d+)*(?:\.\d+)?(?:k|m|b|%)?|\$\d+/gi;
    const hasNumbers = numberRegex.test(text);

    // Check for weak verbs at the start of sentences or generally
    const lowerText = text.toLowerCase();
    const weakVerbsFound = WEAK_VERBS.filter(verb => {
      // Look for the verb as a whole word
      const regex = new RegExp(`\\b${verb}\\b`, 'i');
      return regex.test(lowerText);
    });

    // Check for length (a standard FAANG bullet is < 150 characters, typically 2 lines max on standard margins)
    const isTooLong = text.length > 160;

    return {
      text,
      hasNumbers,
      weakVerbs: weakVerbsFound,
      isTooLong
    };
  },

  // Helper to generate highlighted HTML for the text overlay
  generateHighlightedHtml: (text: string): string => {
    if (!text) return '';

    let html = text;

    // 1. Highlight numbers in green background
    const numberRegex = /(\d+(?:,\d+)*(?:\.\d+)?(?:k|m|b|%)?|\$\d+)/gi;
    html = html.replace(numberRegex, '<span class="bg-green-100 text-green-800 font-medium px-1 rounded">$1</span>');

    // 2. Highlight weak verbs in red underline
    WEAK_VERBS.forEach(verb => {
      const regex = new RegExp(`\\b(${verb})\\b`, 'gi');
      html = html.replace(regex, '<span class="underline decoration-red-500 decoration-wavy decoration-2 text-red-700 cursor-help" title="Weak verb. Try: Engineered, Spearheaded, Architected">$1</span>');
    });

    return html;
  }
};
