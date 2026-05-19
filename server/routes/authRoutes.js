const router = require("express").Router();
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
const authRequestLimiter = createRateLimiter({
  windowMs: authWindowMs,
  maxRequests: 10,
  message: "Too many authentication attempts. Please wait a few minutes before trying again.",
  keyGenerator: (req) => `${req.ip}:auth:${String(req.body?.phone || "").trim() || "unknown"}`,
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

async function respondWithUserSession(res, payload) {
  const user = await loginUser(payload);

  return res.json(buildSession(user));
}

router.post("/request-otp", authRequestLimiter, async (req, res) => {
  const { phone } = req.body || {};
  const normalizedPhone = String(phone || "").trim();

  if (!isValidPhone(normalizedPhone)) {
    return res.status(400).json({ message: "Enter a valid phone number in international format." });
  }

  try {
    return res.json({
      success: true,
      phone: normalizedPhone,
      expiresInMs: 0,
      message: "OTP is no longer required. Continue to log in directly.",
      otp: "000000",
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to continue right now.", error: error.message });
  }
});

router.post("/login", authRequestLimiter, async (req, res) => {
  const { phone } = req.body || {};
  const normalizedPhone = String(phone || "").trim();

  if (!isValidPhone(normalizedPhone)) {
    return res.status(400).json({ message: "Enter a valid phone number in international format." });
  }

  try {
    return await respondWithUserSession(res, { phone: normalizedPhone });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in user.", error: error.message });
  }
});

router.post("/register", authRequestLimiter, async (req, res) => {
  const { phone, name, city, petName } = req.body || {};
  const normalizedPhone = String(phone || "").trim();
  const normalizedName = String(name || "").trim();

  if (!isValidPhone(normalizedPhone)) {
    return res.status(400).json({ message: "Enter a valid phone number in international format." });
  }

  if (!normalizedName) {
    return res.status(400).json({ message: "Name is required." });
  }

  try {
    return await respondWithUserSession(res, {
      phone: normalizedPhone,
      name: normalizedName,
      city,
      petName,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to register user.", error: error.message });
  }
});

router.post("/login-with-otp", authRequestLimiter, async (req, res) => {
  const { phone, name, city, petName } = req.body || {};
  const normalizedPhone = String(phone || "").trim();

  if (!isValidPhone(normalizedPhone)) {
    return res.status(400).json({ message: "Enter a valid phone number in international format." });
  }

  try {
    return await respondWithUserSession(res, {
      phone: normalizedPhone,
      name,
      city,
      petName,
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
