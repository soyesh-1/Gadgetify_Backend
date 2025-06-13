// Gadgetify_backend/controllers/authController.js

// ... (keep the imports at the top)
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// --- Register User Controller ---
exports.registerUser = async (req, res) => {
  // Get name, email, and password from the request body
  const { name, email, password } = req.body;

  // Add a simple validation check for the name
  if (!name) {
    return res.status(400).json({ msg: 'Please enter your name' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create the new user with the name
    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    // In the JWT payload, let's include the user's name now
    const payload = {
      user: {
        id: user.id,
        name: user.name // Add name to the token payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- Login User Controller ---
// We also update the login payload to include the name
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Add the name to the JWT payload here as well
    const payload = {
      user: {
        id: user.id,
        name: user.name // Add name to the token payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// --- Get Logged In User Controller ---
// This controller remains the same, it will now return the name field automatically
exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

