// backend/controllers/productController.js
const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      stock: req.body.stock,
      specifications: req.body.specifications || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error in createProduct:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Error in getProductById:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  const { name, price, description, image, category, stock, specifications } = req.body;
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.specifications = specifications || product.specifications;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Error in updateProduct:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Search for products by name
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    // Get the keyword from the query string (e.g., /search?keyword=iphone)
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword, // The search term
            $options: 'i', // 'i' makes it case-insensitive
          },
        }
      : {}; // If no keyword, it's an empty search

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    console.error('Error in searchProducts:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get products by category name
// @route   GET /api/products/category/:categoryName
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryName });
    if (products) {
      res.json(products);
    } else {
      // This case might not be hit if find returns an empty array, but it's good practice
      res.status(404).json({ message: 'No products found for this category' });
    }
  } catch (error) {
    console.error("Error in getProductsByCategory:", error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

