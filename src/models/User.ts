import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false, // Don't return password in queries
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'Users' // Explicitly use 'Users' collection
});

// This will create/use the 'Users' collection in 'wdd430' database
export default mongoose.models.User || mongoose.model('User', UserSchema);