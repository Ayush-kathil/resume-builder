export function formatResumeDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  const trimmed = dateString.trim();
  const lower = trimmed.toLowerCase();
  
  if (lower === 'present' || lower === 'current') return 'Present';

  // If it's just a year "2024", return it
  if (/^\d{4}$/.test(trimmed)) return trimmed;

  // Try parsing the date assuming UTC to avoid timezone shift bugs
  // ISO format like YYYY-MM-DD or YYYY-MM
  const parsedDate = new Date(trimmed.includes('T') ? trimmed : `${trimmed}T00:00:00Z`);
  
  if (isNaN(parsedDate.getTime())) {
    // Fallback if parsing fails
    return trimmed;
  }

  // Format explicitly as MMM YYYY using UTC methods to prevent timezone shifting
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[parsedDate.getUTCMonth()];
  const year = parsedDate.getUTCFullYear();

  return `${month} ${year}`;
}
