import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    enum: ['jewelry', 'home-decor', 'clothing', 'art', 'other'],
    required: true,
  },
  images: [{
    type: String,
    default: [],
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
    min: [0, 'Stock cannot be negative'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'products',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for formatted date
ProductSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for stock status
ProductSchema.virtual('stockStatus').get(function() {
  if (this.stock > 10) return 'In Stock';
  if (this.stock > 0) return 'Low Stock';
  return 'Out of Stock';
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);