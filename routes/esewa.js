// backend/routes/esewa.js
const express = require('express');
const router = express.Router();
const { 
  initiatePayment, 
  handlePaymentSuccess, 
  handlePaymentFailure 
} = require('../controllers/esewaController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for your frontend to call to start the payment process
router.post('/initiate-payment', authMiddleware, initiatePayment);

// --- THIS IS THE FIX ---
// Changed from router.post to router.get to correctly handle eSewa's callback
router.get('/payment-success', handlePaymentSuccess);

// The failure route is also a GET request
router.get('/payment-failure', handlePaymentFailure);

module.exports = router;
