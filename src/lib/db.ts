import mongoose from 'mongoose';

declare global {
  var mongoose: { conn: any; promise: any };
}

// Use MONGODB_URI not DATABASE_URL
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/wdd430';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Connection options
const options = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
};

// Global cache for connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log('✅ MongoDB connected to database:', mongoose.connection.name);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    cached.promise = null;
    throw error;
  }
}

export default connectDB;