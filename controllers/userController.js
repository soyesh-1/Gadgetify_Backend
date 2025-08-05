// backend/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Needed for password hashing

// @desc    Get all users (for Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users and exclude their password field for security
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    // req.user.id comes from the authMiddleware
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // If the user sends a new password, hash it securely before saving
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();
      
      // We should also send back a new token that includes the updated name
      const payload = {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email, // Ensure email is in the token
          role: updatedUser.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          // Send back the new token and updated user info
          res.json({
            token,
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
          });
        }
      );

    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- NEW WISHLIST FUNCTIONS ---

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (user) {
      res.json(user.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a product to the wishlist
// @route   POST /api/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      // Check if the product is already in the wishlist
      if (user.wishlist.includes(productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      user.wishlist.push(productId);
      await user.save();
      const populatedUser = await User.findById(req.user.id).populate('wishlist');
      res.status(200).json(populatedUser.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove a product from the wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);

    if (user) {
      // Pull (remove) the product ID from the wishlist array
      user.wishlist.pull(productId);
      await user.save();
      const populatedUser = await User.findById(req.user.id).populate('wishlist');
      res.status(200).json(populatedUser.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
