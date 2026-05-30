// Basic Regex for PII
const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_REGEX = /(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;

export const redactPII = (text: string): { redactedText: string; hasPII: boolean } => {
  let hasPII = false;
  
  let redactedText = text.replace(EMAIL_REGEX, () => {
    hasPII = true;
    return '[REDACTED_EMAIL]';
  });

  redactedText = redactedText.replace(PHONE_REGEX, () => {
    hasPII = true;
    return '[REDACTED_PHONE]';
  });

  return { redactedText, hasPII };
};

// Basic jailbreak keywords
const JAILBREAK_KEYWORDS = [
  'ignore previous instructions',
  'disregard previous instructions',
  'system prompt',
  'you are a generic',
  'bypass',
  'write a poem',
  'write code',
  'forget instructions',
];

export const detectJailbreak = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return JAILBREAK_KEYWORDS.some((keyword) => lowerText.includes(keyword));
};
