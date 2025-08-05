// Gadgetify_backend/updateUsers.js

const mongoose = require('mongoose');
const User = require('./models/User'); // Import your User model
require('dotenv').config(); // Load your .env variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for script...');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err.message);
    process.exit(1);
  }
};

const updateExistingUsers = async () => {
  // First, connect to the database
  await connectDB();

  try {
    // Find all users where the 'role' field does NOT exist
    const usersToUpdate = await User.find({ role: { $exists: false } });

    if (usersToUpdate.length === 0) {
      console.log('All users already have roles. No update needed.');
      return;
    }

    console.log(`Found ${usersToUpdate.length} user(s) to update...`);

    // Loop through each user and add the default fields
    for (const user of usersToUpdate) {
      user.role = 'user'; // Set default role
      
      // Set a default name if it doesn't exist
      if (!user.name) {
        // You could use part of their email or a generic name
        user.name = user.email.split('@')[0]; // e.g., 'soyeshxrestha' from 'soyeshxrestha@gmail.com'
      }
      
      await user.save(); // Save the updated user document
      console.log(`Updated user: ${user.email}`);
    }

    console.log('All users have been updated successfully!');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    // IMPORTANT: Close the database connection when the script is done
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run the script
updateExistingUsers();