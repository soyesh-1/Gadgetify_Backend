// backend/controllers/orderController.js
const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const { orderItems, shippingInfo, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({
      orderItems: orderItems.map(item => ({
        ...item,
        product: item.id,
        _id: undefined,
      })),
      user: req.user.id,
      shippingInfo,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (req.body.paymentStatus) {
        order.paymentInfo.status = req.body.paymentStatus;
      }
      if (req.body.orderStatus) {
        order.orderStatus = req.body.orderStatus;
      }
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
exports.getOrderById = async (req, res) => {
  try {
    // Find the order by its ID and also populate it with the user's name and email
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    // req.user.id is available because of your authMiddleware
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user's orders:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};