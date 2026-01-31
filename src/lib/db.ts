// src/lib/db.ts - No Mongoose dependency
const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectDB() {
  if (!MONGODB_URI) {
    console.log('No MongoDB URI set - running without database');
    return;
  }
  
  console.log('Database would connect to:', MONGODB_URI);
  // Database logic would go here
  return;
}