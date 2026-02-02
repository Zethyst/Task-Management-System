import rateLimit from "express-rate-limit";

// Strict rate limiter for authentication routes (login/signup)
// Prevents brute force attacks
export const authRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || "900000"), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || "10"), // 10 requests per window
  message: {
    error: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip trust proxy validation since we've configured it securely (trust proxy: 1)
  validate: {
    trustProxy: false,
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many authentication attempts. Please try again later.",
      retryAfter: Math.round(parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || "900000") / 1000), // seconds
    });
  },
});

// General API rate limiter for all other routes
// Prevents API abuse while allowing normal usage
export const apiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_API_WINDOW_MS || "900000"), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_API_MAX || "150"), // 150 requests per window
  message: {
    error: "Too many requests. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip trust proxy validation since we've configured it securely (trust proxy: 1)
  validate: {
    trustProxy: false,
  },
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: Math.round(parseInt(process.env.RATE_LIMIT_API_WINDOW_MS || "900000") / 1000), // seconds
    });
  },
});
