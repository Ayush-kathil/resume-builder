export const AI_MODELS = {
  // Fast, cheap models for standard parsing and extraction
  PARSER: "gemini-2.5-flash",
  ATS: "gemini-2.5-flash",
  SKILLS: "gemini-2.5-flash",
  PROJECTS: "gemini-2.5-flash",
  CHAT: "gemini-2.5-flash",
  
  // Slower, powerful reasoning models for writing and transformation
  REWRITER: "gemini-2.5-pro",
  JD_MATCHER: "gemini-2.5-pro",
  SUMMARY: "gemini-2.5-pro",
  MODERNIZE: "gemini-2.5-pro",
  ENHANCE: "gemini-2.5-pro"
};

export const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro"
];
