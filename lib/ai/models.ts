export const AI_MODELS = {
  // Fast, cheap models for standard parsing and extraction
  PARSER: "gemini-3.1-flash",
  ATS: "gemini-3.1-flash",
  SKILLS: "gemini-3.1-flash",
  PROJECTS: "gemini-3.1-flash",
  CHAT: "gemini-3.1-flash",

  // Slower, powerful reasoning models for writing and transformation
  REWRITER: "gemini-3.1-pro",
  JD_MATCHER: "gemini-3.1-pro",
  SUMMARY: "gemini-3.1-pro",
  MODERNIZE: "gemini-3.1-pro",
  ENHANCE: "gemini-3.1-pro",
};

export const MODEL_FALLBACKS = [
  "gemini-3.1-flash",
  "gemini-3.1-pro",
];
