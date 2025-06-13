// Gadgetify_backend/server.js

// Load environment variables from .env file right at the top
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ extended: false })); // Allows us to accept JSON data in the body

app.get('/', (req, res) => res.send('Gadgetify API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
// Later you can add: app.use('/api/products', require('./routes/products'));

// Use the PORT from the .env file, or default to 5000
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));