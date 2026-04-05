const mongoose = require("mongoose");

let hasAttemptedConnection = false;
let isMongoReady = false;

async function connectDatabase() {
  if (hasAttemptedConnection) {
    return isMongoReady;
  }

  hasAttemptedConnection = true;

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log("MongoDB URI not provided. Using in-memory fallback store.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || "pawassist",
    });
    isMongoReady = true;
    console.log("MongoDB connected successfully.");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed. Falling back to in-memory store.");
    console.error(error.message);
    isMongoReady = false;
    return false;
  }
}

function isDatabaseReady() {
  return isMongoReady;
}

module.exports = {
  connectDatabase,
  isDatabaseReady,
};
