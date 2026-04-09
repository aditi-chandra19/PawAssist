const crypto = require("crypto");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, hash, salt) {
  if (!hash || !salt) {
    return false;
  }

  const incoming = crypto.scryptSync(String(password || ""), salt, 64);
  const stored = Buffer.from(hash, "hex");

  if (incoming.length !== stored.length) {
    return false;
  }

  return crypto.timingSafeEqual(incoming, stored);
}

function toBase64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = String(input || "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function signToken(payload, secret, expiresInSeconds = 60 * 60 * 12) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedBody = toBase64Url(JSON.stringify(body));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${encodedHeader}.${encodedBody}.${signature}`;
}

function verifyToken(token, secret) {
  const [encodedHeader, encodedBody, signature] = String(token || "").split(".");

  if (!encodedHeader || !encodedBody || !signature) {
    return { ok: false, reason: "malformed" };
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  const incomingBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    incomingBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(incomingBuffer, expectedBuffer)
  ) {
    return { ok: false, reason: "invalid_signature" };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedBody));

    if (!payload.exp || Math.floor(Date.now() / 1000) >= payload.exp) {
      return { ok: false, reason: "expired" };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "invalid_payload" };
  }
}

function generateOtpCode(length = 6) {
  const max = 10 ** length;
  return String(crypto.randomInt(0, max)).padStart(length, "0");
}

function createId(prefix) {
  if (typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${crypto.randomBytes(12).toString("hex")}`;
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  generateOtpCode,
  createId,
};
