export const weakVerbs = [
  "helped",
  "worked",
  "made",
  "did",
  "responsible for",
  "handled",
  "managed", // 'managed' can be weak if overused, but usually okay, we'll omit it from 'weak' to be safe.
  "assisted",
  "supported",
  "contributed",
  "participated in",
  "was part of",
  "tried",
  "used",
];

export const strongVerbs = [
  "Architected",
  "Engineered",
  "Spearheaded",
  "Optimized",
  "Deployed",
  "Orchestrated",
  "Pioneered",
  "Formulated",
  "Executed",
  "Accelerated",
  "Conceptualized",
  "Transformed",
  "Championed",
];

export const scanForWeakVerbs = (text: string): string[] => {
  const detected: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const verb of weakVerbs) {
    // Basic regex to match whole words/phrases
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(lowerText)) {
      detected.push(verb);
    }
  }
  
  return detected;
};
