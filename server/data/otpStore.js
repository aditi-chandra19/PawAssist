const { generateOtpCode, hashPassword, verifyPassword } = require("./security");

const otpSessions = new Map();

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;

function normalizePhone(phone) {
  return String(phone || "").trim();
}

function generateOtp() {
  return generateOtpCode(OTP_LENGTH);
}

function createOtpSession(phone) {
  const normalizedPhone = normalizePhone(phone);
  const code = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;
  const digest = hashPassword(code);

  otpSessions.set(normalizedPhone, {
    codeHash: digest.hash,
    codeSalt: digest.salt,
    expiresAt,
    attempts: 0,
  });

  return {
    phone: normalizedPhone,
    code,
    expiresAt,
  };
}

function verifyOtpSession(phone, otp) {
  const normalizedPhone = normalizePhone(phone);
  const normalizedOtp = String(otp || "").trim();
  const session = otpSessions.get(normalizedPhone);

  if (!session) {
    return { ok: false, reason: "missing" };
  }

  if (Date.now() > session.expiresAt) {
    otpSessions.delete(normalizedPhone);
    return { ok: false, reason: "expired" };
  }

  if (session.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpSessions.delete(normalizedPhone);
    return { ok: false, reason: "locked" };
  }

  if (
    normalizedOtp.length !== OTP_LENGTH ||
    !verifyPassword(normalizedOtp, session.codeHash, session.codeSalt)
  ) {
    session.attempts += 1;
    otpSessions.set(normalizedPhone, session);
    return { ok: false, reason: session.attempts >= MAX_VERIFY_ATTEMPTS ? "locked" : "invalid" };
  }

  otpSessions.delete(normalizedPhone);
  return { ok: true };
}

module.exports = {
  OTP_LENGTH,
  OTP_TTL_MS,
  MAX_VERIFY_ATTEMPTS,
  createOtpSession,
  verifyOtpSession,
};
