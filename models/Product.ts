import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['fruits', 'vegetables', 'herbs', 'organic', 'dairy', 'grains', 'spices']
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'piece', 'bunch', 'pack', 'liter', 'gram', 'dozen']
  },
  featured: {
    type: Boolean,
    default: false
  },
  organic: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  brand: {
    type: String,
    trim: true
  },
  deliveryTime: {
    type: String,
    enum: ['10 MINS', '15 MINS', '30 MINS', '1 HOUR', '2 HOURS', 'SAME DAY']
  },
  offerText: {
    type: String,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fiber: Number,
    vitamins: [String]
  }
}, {
  timestamps: true
});

ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);