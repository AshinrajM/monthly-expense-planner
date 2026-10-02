import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, error: null };
}

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    cached.error = "MONGODB_URI environment variable is missing!";
    console.warn("⚠️ " + cached.error);
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("✅ Successfully connected to MongoDB Atlas!");
      cached.error = null;
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.error = e.message;
    console.error("❌ MongoDB Atlas connection error:", e.message);
    return null;
  }

  return cached.conn;
}

export function getLastDbError() {
  return cached ? cached.error : null;
}
