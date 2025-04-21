const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const customerRoutes = require('./routes/customerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8000; // Use PORT from environment variables or default to 8000

// Middleware
app.use(morgan('tiny')); // HTTP request logging
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS
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
app.use('/api/customers', customerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ message: 'Something went wrong!' }); // Send a generic error response
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server started on http://0.0.0.0:${port}`);
});
