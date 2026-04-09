const { verifyToken } = require("../data/security");

const FALLBACK_AUTH_SECRET = "pawassist-dev-secret-change-me";

function getAuthSecret() {
  return process.env.AUTH_TOKEN_SECRET || FALLBACK_AUTH_SECRET;
}

function extractBearerToken(headerValue) {
  const [scheme, token] = String(headerValue || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return "";
  }

  return token.trim();
}

function requireAuth(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const verification = verifyToken(token, getAuthSecret());

  if (!verification.ok) {
    return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }

  req.auth = verification.payload;
  return next();
}

module.exports = {
  requireAuth,
  getAuthSecret,
};
