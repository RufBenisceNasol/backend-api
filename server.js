// server.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8000; // Use PORT from environment variables or default to 8000

// Middleware
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection (🚫 Removed deprecated options)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB'))
    .catch(err => {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with failure
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ message: 'Something went wrong!' }); // Send a generic error response
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});
