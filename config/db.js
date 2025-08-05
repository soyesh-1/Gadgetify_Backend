// Gadgetify_backend/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  console.log('Attempting to connect to MongoDB...');
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // This will run if the connection is successful
    mongoose.connection.on('connected', () => {
      console.log('Mongoose has successfully connected!');
    });

    // This will run if there is an error after the initial connection
    mongoose.connection.on('error', err => {
      console.error('Mongoose connection error after initial connection:', err);
    });

  } catch (err) {
    console.error('Initial Mongoose connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;