// Gadgetify_backend/models/Order.js

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    // Link the order to the user who placed it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user', // This links to our User model
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'product', // This links to our Product model
        },
      },
    ],
    shippingInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phoneNo: { type: String, required: true },
    },
    paymentInfo: {
      id: { type: String }, // For a real payment gateway transaction ID
      status: { type: String, default: 'Pending' }, // e.g., 'Pending', 'Paid'
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'Processing', // e.g., 'Processing', 'Shipped', 'Delivered'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('order', OrderSchema);
