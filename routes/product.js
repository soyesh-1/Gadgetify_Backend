const express = require('express');
const router = express.Router();

// Import all necessary functions from the controller
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory, // ✅ 1. IMPORT THE NEW FUNCTION
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// --- PUBLIC ROUTES ---

// GET all products
router.get('/', getAllProducts);

// GET /api/products/search?keyword=...
router.get('/search', searchProducts);

// ✅ 2. ADD THE NEW ROUTE FOR CATEGORIES
// This must be defined before the '/:id' route to avoid conflicts
router.get('/category/:categoryName', getProductsByCategory);

// GET a single product by its ID
router.get('/:id', getProductById);


// --- ADMIN-ONLY ROUTES ---

// POST create a new product
router.post('/', [authMiddleware, adminMiddleware], createProduct);

// PUT update a product
router.put('/:id', [authMiddleware, adminMiddleware], updateProduct);

// DELETE a product
router.delete('/:id', [authMiddleware, adminMiddleware], deleteProduct);

module.exports = router;