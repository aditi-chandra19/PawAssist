const { loadEnv } = require("./config/loadEnv");
const express = require("express");
const cors = require("cors");
const { connectDatabase, isDatabaseReady } = require("./config/db");

loadEnv();

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5000;
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((item) => item.trim()).filter(Boolean)
  : [];

if (isProduction && !process.env.AUTH_TOKEN_SECRET) {
  throw new Error("AUTH_TOKEN_SECRET is required in production.");
}

if (isProduction && !allowedOrigins.length) {
  throw new Error("CORS_ORIGIN must be set in production.");
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");

  if (isProduction && (req.secure || req.headers["x-forwarded-proto"] === "https")) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
});
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (!allowedOrigins.length) {
        return callback(null, !isProduction);
      }

      return callback(
        allowedOrigins.includes(origin) ? null : new Error("Origin not allowed by CORS"),
        allowedOrigins.includes(origin),
      );
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pawassist-api",
    database: isDatabaseReady() ? "mongodb" : "memory",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/pets", require("./routes/petRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/app", require("./routes/appRoutes"));

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`PawAssist API running on port ${port}`);
  });
}

startServer();
