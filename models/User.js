// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // ✅ Correct wishlist ref to 'Product'
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product', // ✅ MUST match mongoose.model('Product', ...) capitalization
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);
