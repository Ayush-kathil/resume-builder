export const AI_MODELS = {
  // Fast, cheap models for standard parsing and extraction
  PARSER: "gemini-1.5-flash",
  ATS: "gemini-1.5-flash",
  SKILLS: "gemini-1.5-flash",
  PROJECTS: "gemini-1.5-flash",
  CHAT: "gemini-1.5-flash",

  // Slower, powerful reasoning models for writing and transformation
  REWRITER: "gemini-1.5-pro",
  JD_MATCHER: "gemini-1.5-pro",
  SUMMARY: "gemini-1.5-pro",
  MODERNIZE: "gemini-1.5-pro",
  ENHANCE: "gemini-1.5-pro",
};

export const MODEL_FALLBACKS = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];
