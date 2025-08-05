// backend/controllers/esewaController.js
const crypto = require('crypto');
const Order = require('../models/Order');

// @desc    Initiate a payment with eSewa v2 API
// @route   POST /api/esewa/initiate-payment
// @access  Private
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const transaction_uuid = orderId; // Use our internal Order ID as the unique transaction ID

    const signatureString = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_MERCHANT_CODE}`;

    const hmac = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY);
    hmac.update(signatureString);
    const signature = hmac.digest('base64');

    const formData = {
      amount: amount,
      failure_url: `http://localhost:5173/payment-failure`,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: process.env.ESEWA_MERCHANT_CODE,
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: `http://localhost:5005/api/esewa/payment-success`, // eSewa will redirect to this URL
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transaction_uuid,
    };
    
    res.json(formData);

  } catch (error) {
    console.error('Error initiating eSewa payment:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Handle successful payment callback from eSewa
// @route   GET /api/esewa/payment-success
// @access  Public
exports.handlePaymentSuccess = async (req, res) => {
  try {
    // --- THIS IS THE FIX ---
    // eSewa sends the data in the query parameters of a GET request
    const { data } = req.query;
    
    if (!data) {
      throw new Error("No data received from eSewa in GET request.");
    }
    
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

    if (decodedData.status !== 'COMPLETE') {
      return res.redirect(`http://localhost:5173/payment-failure?error=not_complete`);
    }

    const signatureString = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${decodedData.product_code},signed_field_names=${decodedData.signed_field_names}`;
    
    const hmac = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY);
    hmac.update(signatureString);
    const calculatedSignature = hmac.digest('base64');

    if (calculatedSignature !== decodedData.signature) {
      console.error('CRITICAL: eSewa signature verification failed!');
      return res.redirect(`http://localhost:5173/payment-failure?error=invalid_signature`);
    }

    const orderId = decodedData.transaction_uuid;
    
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentInfo.status = 'Paid';
      order.paymentInfo.id = decodedData.transaction_code;
      await order.save();
    } else {
      console.error(`CRITICAL: Order with ID ${orderId} not found after successful payment.`);
    }

    res.redirect(`http://localhost:5173/order-success`);

  } catch (error) {
    console.error('Error in eSewa success callback:', error);
    res.redirect(`http://localhost:5173/payment-failure?error=server_error`);
  }
};

// @desc    Handle failed payment callback from eSewa
// @route   GET /api/esewa/payment-failure
// @access  Public
exports.handlePaymentFailure = async (req, res) => {
    console.log('eSewa Payment Failed Callback Received:', req.query);
    res.redirect(`http://localhost:5173/payment-failure`);
};
