const buckets = new Map();

function createRateLimiter({
  windowMs,
  maxRequests,
  message = "Too many requests. Please try again later.",
  keyGenerator = (req) => req.ip,
}) {
  return function rateLimit(req, res, next) {
    const now = Date.now();
    const key = keyGenerator(req);

    if (!key) {
      return next();
    }

    const current = buckets.get(key);

    if (!current || current.expiresAt <= now) {
      buckets.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      res.setHeader("Retry-After", Math.ceil((current.expiresAt - now) / 1000));
      return res.status(429).json({ message });
    }

    current.count += 1;
    buckets.set(key, current);
    return next();
  };
}

module.exports = {
  createRateLimiter,
};
