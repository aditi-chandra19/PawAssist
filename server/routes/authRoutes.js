const router = require("express").Router();
const { createOtpSession, OTP_TTL_MS, verifyOtpSession } = require("../data/otpStore");
const {
  loginUser,
  updateUser,
  getUserById,
  getBookings,
  getOverview,
  getUserSettings,
  updateUserSettings,
  changeUserPassword,
  deleteUserAccount,
} = require("../data/repository");
const { signToken } = require("../data/security");
const { requireAuth, getAuthSecret } = require("../middleware/auth");
const { createRateLimiter } = require("../middleware/rateLimit");

const authWindowMs = 10 * 60 * 1000;
const otpRequestLimiter = createRateLimiter({
  windowMs: authWindowMs,
  maxRequests: 5,
  message: "Too many OTP requests. Please wait a few minutes before trying again.",
  keyGenerator: (req) => `${req.ip}:otp:${String(req.body?.phone || "").trim() || "unknown"}`,
});
const otpVerifyLimiter = createRateLimiter({
  windowMs: authWindowMs,
  maxRequests: 10,
  message: "Too many verification attempts. Please request a new OTP and try again.",
  keyGenerator: (req) => `${req.ip}:verify:${String(req.body?.phone || "").trim() || "unknown"}`,
});

function isValidPhone(phone) {
  return /^\+?[1-9]\d{9,14}$/.test(String(phone || "").trim());
}

function buildSession(user) {
  const expiresInSeconds = Number(process.env.AUTH_TOKEN_TTL_SECONDS || 60 * 60 * 12);
  const token = signToken(
    {
      sub: user.id,
      phone: user.phone,
      name: user.name,
    },
    getAuthSecret(),
    expiresInSeconds,
  );

  return {
    token,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(),
    user,
  };
}

router.post("/request-otp", otpRequestLimiter, async (req, res) => {
  const { phone } = req.body || {};
  const normalizedPhone = String(phone || "").trim();

  if (!isValidPhone(normalizedPhone)) {
    return res.status(400).json({ message: "Enter a valid phone number in international format." });
  }

  try {
    const session = createOtpSession(normalizedPhone);
    const isProduction = process.env.NODE_ENV === "production";

    if (!isProduction) {
      console.log(`PawAssist dev OTP for ${session.phone}: ${session.code}`);
    }

    return res.json({
      success: true,
      phone: session.phone,
      expiresInMs: OTP_TTL_MS,
      message: "OTP generated successfully.",
      otp: isProduction ? undefined : session.code,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to generate OTP.", error: error.message });
  }
});

router.post("/login-with-otp", otpVerifyLimiter, async (req, res) => {
  const { phone, otp, name, city, petName } = req.body || {};
  const normalizedPhone = String(phone || "").trim();

  if (!isValidPhone(normalizedPhone)) {
    return res.status(400).json({ message: "Enter a valid phone number in international format." });
  }

  if (!String(otp || "").trim()) {
    return res.status(400).json({ message: "OTP is required." });
  }

  const verification = verifyOtpSession(normalizedPhone, otp);

  if (!verification.ok) {
    const messageByReason = {
      missing: "Request a new OTP before trying to log in.",
      expired: "OTP expired. Request a new one.",
      invalid: "Incorrect OTP. Please try again.",
      locked: "Too many incorrect OTP attempts. Request a new code.",
    };

    return res.status(400).json({
      message: messageByReason[verification.reason] || "Unable to verify OTP.",
    });
  }

  try {
    const user = await loginUser({ phone: normalizedPhone, name, city, petName });

    return res.json({
      ...buildSession(user),
      overview: await getOverview(user.id),
      bookings: await getBookings(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in user.", error: error.message });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.auth.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      user,
      overview: await getOverview(user.id),
      bookings: await getBookings(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch account.", error: error.message });
  }
});

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.auth.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch user profile.", error: error.message });
  }
});

router.put("/profile", requireAuth, async (req, res) => {
  try {
    const user = await updateUser(req.auth.sub, req.body || {});

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({
      user,
      overview: await getOverview(user.id),
      bookings: await getBookings(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update user profile.", error: error.message });
  }
});

router.get("/settings", requireAuth, async (req, res) => {
  try {
    const settings = await getUserSettings(req.auth.sub);

    if (!settings) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch user settings.", error: error.message });
  }
});

router.put("/settings", requireAuth, async (req, res) => {
  try {
    const settings = await updateUserSettings(req.auth.sub, req.body || {});

    if (!settings) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update user settings.", error: error.message });
  }
});

router.put("/password", requireAuth, async (req, res) => {
  const { currentPassword, nextPassword } = req.body || {};

  if (!nextPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  if (String(nextPassword).length < 10) {
    return res.status(400).json({ message: "New password must be at least 10 characters." });
  }

  try {
    const result = await changeUserPassword(req.auth.sub, currentPassword, nextPassword);

    if (!result.ok) {
      if (result.reason === "not_found") {
        return res.status(404).json({ message: "User not found." });
      }

      return res.status(400).json({ message: "Current password is incorrect." });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Unable to change password.", error: error.message });
  }
});

router.delete("/account", requireAuth, async (req, res) => {
  try {
    const removed = await deleteUserAccount(req.auth.sub);

    if (!removed) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete account.", error: error.message });
  }
});

module.exports = router;
