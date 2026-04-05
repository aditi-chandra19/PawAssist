const { loadEnv } = require("./config/loadEnv");
const express = require("express");
const cors = require("cors");
const { connectDatabase, isDatabaseReady } = require("./config/db");

loadEnv();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pawassist-api",
    database: isDatabaseReady() ? "mongodb" : "memory",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/app", require("./routes/appRoutes"));

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`PawAssist API running on port ${port}`);
  });
}

startServer();
