export const AI_MODELS = {
  // Fast, cheap models for standard parsing and extraction
  PARSER: "gemini-1.5-flash-latest",
  ATS: "gemini-1.5-flash-latest",
  SKILLS: "gemini-1.5-flash-latest",
  PROJECTS: "gemini-1.5-flash-latest",
  CHAT: "gemini-1.5-flash-latest",

  // Slower, powerful reasoning models for writing and transformation
  REWRITER: "gemini-1.5-pro-latest",
  JD_MATCHER: "gemini-1.5-pro-latest",
  SUMMARY: "gemini-1.5-pro-latest",
  MODERNIZE: "gemini-1.5-pro-latest",
  ENHANCE: "gemini-1.5-pro-latest",
};

export const MODEL_FALLBACKS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
];
