// Gadgetify_backend/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));


// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/user'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/esewa', require('./routes/esewa'));

// --- Serve Static Assets in Production ---
// This part is for when you deploy your app later
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const dirname = path.resolve();
  app.use('/uploads', express.static(path.join(dirname, '/uploads')));
  // Serve the frontend's build folder
  app.use(express.static(path.join(dirname, '/../Gadgetify_Frontend/dist')));
  // For any route that is not our API, serve the frontend's index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(dirname, '../Gadgetify_Frontend/dist', 'index.html'))
  );
} else {
  // In development, serve the uploads folder statically
  const dirname = path.resolve();
  app.use('/uploads', express.static(path.join(dirname, '/uploads')));
  app.get('/', (req, res) => res.send('Gadgetify API Running'));
}


const PORT = process.env.PORT || 5005;

const startServer = async () => {
  try {
    // --- Connect to Database FIRST ---
    await connectDB();
    
    // --- Then Start the Server ---
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
