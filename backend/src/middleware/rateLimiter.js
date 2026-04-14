import { ApiError } from "../utils/ApiError.js";

/**
 * Simple in-memory sliding-window rate limiter.
 * No Redis dependency — suitable for single-instance deployments.
 *
 * @param {object} opts
 * @param {number} opts.windowMs   – window duration in milliseconds (default 60 000)
 * @param {number} opts.max        – max requests per window per user (default 30)
 * @param {string} opts.message    – error message on limit exceeded
 * @returns {Function} Express middleware
 */
export function rateLimiter({
  windowMs = 60_000,
  max = 30,
  message = "Too many requests. Please try again later."
} = {}) {
  /** @type {Map<string, number[]>} userId → sorted array of timestamps */
  const hits = new Map();

  // Periodically prune stale entries to prevent memory leaks
  const CLEANUP_INTERVAL = windowMs * 5;
  setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [key, timestamps] of hits) {
      const filtered = timestamps.filter((t) => t > cutoff);
      if (filtered.length === 0) {
        hits.delete(key);
      } else {
        hits.set(key, filtered);
      }
    }
  }, CLEANUP_INTERVAL).unref(); // .unref() so the timer doesn't keep Node alive

  return function rateLimitMiddleware(req, _res, next) {
    // Identify by authenticated user ID; fall back to IP
    const key = req.user?._id?.toString() || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    let timestamps = hits.get(key) || [];
    timestamps = timestamps.filter((t) => t > windowStart);

    if (timestamps.length >= max) {
      return next(new ApiError(429, message));
    }

    timestamps.push(now);
    hits.set(key, timestamps);
    next();
  };
}
