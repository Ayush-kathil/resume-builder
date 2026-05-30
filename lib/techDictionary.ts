export const techDictionary: Record<string, string> = {
  "mongo_db": "MongoDB",
  "mongodb": "MongoDB",
  "reactjs": "React",
  "react.js": "React",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "node.js": "Node.js",
  "nodejs": "Node.js",
  "javascript": "JavaScript",
  "typescript": "TypeScript",
  "vuejs": "Vue.js",
  "vue.js": "Vue.js",
  "angularjs": "Angular",
  "postgresql": "PostgreSQL",
  "postgres": "PostgreSQL",
  "mysql": "MySQL",
  "html": "HTML",
  "css": "CSS",
  "aws": "AWS",
  "gcp": "GCP",
  "github": "GitHub",
  "gitlab": "GitLab",
  "python": "Python",
  "java": "Java",
  "c++": "C++",
  "c#": "C#",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "k8s": "Kubernetes",
  "graphql": "GraphQL",
  "rest api": "REST API",
  "restful": "RESTful",
  "linux": "Linux",
  "macos": "macOS",
  "windows": "Windows",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "redux": "Redux",
  "sql": "SQL",
  "nosql": "NoSQL",
  "expressjs": "Express.js",
  "express": "Express", // Wait, express is fine.
  "git": "Git",
  "django": "Django",
  "flask": "Flask",
  "spring boot": "Spring Boot",
  "springboot": "Spring Boot"
};

/**
 * Replaces tech words in a given string with their proper casing according to the dictionary.
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  let sanitized = text;
  // Iterate through dictionary, sorting by longest keys first to avoid partial word replacement
  const sortedKeys = Object.keys(techDictionary).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    // Word boundary regex, case-insensitive
    // Use \b to ensure we only replace full words (e.g. don't replace 'react' inside 'reactive')
    // Escape special characters in key for RegExp
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi');
    sanitized = sanitized.replace(regex, techDictionary[key]);
  }
  
  return sanitized;
}
