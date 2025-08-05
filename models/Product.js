// Gadgetify_backend/models/Product.js

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter a product price'],
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Please enter a product category'],
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    default: 1,
  },
  // --- ADD THIS SPECIFICATIONS FIELD ---
  specifications: [
    {
      name: String,
      value: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('product', ProductSchema);