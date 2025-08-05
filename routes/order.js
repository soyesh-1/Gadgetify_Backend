const express = require('express');
const router = express.Router();

// Import controllers and middlewares
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
  getMyOrders,
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// --- USER ROUTES ---

// Create an order -> POST /api/orders
router.post('/', authMiddleware, createOrder);

// Get logged in user's orders -> GET /api/orders/myorders
router.get('/myorders', authMiddleware, getMyOrders);


// --- ADMIN ROUTES ---

// Get all orders (Admin only) -> GET /api/orders
router.get('/', [authMiddleware, adminMiddleware], getAllOrders);

// Get a single order by ID (Admin only) -> GET /api/orders/:id
router.get('/:id', [authMiddleware, adminMiddleware], getOrderById);

// Update an order's status (Admin only) -> PUT /api/orders/:id/status
router.put('/:id/status', [authMiddleware, adminMiddleware], updateOrderStatus);

// Delete an order (Admin only) -> DELETE /api/orders/:id
router.delete('/:id', [authMiddleware, adminMiddleware], deleteOrder);


module.exports = router;