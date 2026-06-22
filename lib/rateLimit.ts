export class RateLimiter {
  private cache: Map<string, { count: number; timestamp: number }>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.cache = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Checks if a key has exceeded the rate limit.
   * @param key Usually the IP address or user ID.
   * @returns true if the request is allowed, false if rate limited.
   */
  public check(key: string): boolean {
    const now = Date.now();
    const record = this.cache.get(key);

    if (!record) {
      this.cache.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (now - record.timestamp > this.windowMs) {
      // Window expired, reset
      this.cache.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false; // Rate limited
    }

    record.count += 1;
    this.cache.set(key, record);
    return true;
  }
}

// Global instance to persist across API route invocations during dev
declare global {
  var globalRateLimiter: RateLimiter | undefined;
}

// 5 requests per minute
export const aiRateLimiter = global.globalRateLimiter || new RateLimiter(60 * 1000, 10);

if (process.env.NODE_ENV !== 'production') {
  global.globalRateLimiter = aiRateLimiter;
}
