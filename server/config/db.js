const mongoose = require("mongoose");

let hasAttemptedConnection = false;
let isMongoReady = false;

async function connectDatabase() {
  if (hasAttemptedConnection) {
    return isMongoReady;
  }

  hasAttemptedConnection = true;
  const isProduction = process.env.NODE_ENV === "production";

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    if (isProduction) {
      throw new Error("MONGODB_URI is required in production.");
    }
    console.log("MongoDB URI not provided. Using in-memory fallback store.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || "pawassist",
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
      socketTimeoutMS: 5000,
    });
    isMongoReady = true;
    console.log("MongoDB connected successfully.");
    return true;
  } catch (error) {
    if (isProduction) {
      throw new Error(`MongoDB connection failed in production: ${error.message}`);
    }
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
