const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) { return res.status(400).json({ msg: 'Please enter your name' }); }
  try {
    let user = await User.findOne({ email });
    if (user) { return res.status(400).json({ msg: 'User already exists' }); }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id, name: user.name, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) { return res.status(400).json({ msg: 'Invalid Credentials' }); }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { return res.status(400).json({ msg: 'Invalid Credentials' }); }
    const payload = { user: { id: user.id, name: user.name, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      
      // ✅ CORRECTED: This now sends back the token AND the user's details.
      res.json({
        token,
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};