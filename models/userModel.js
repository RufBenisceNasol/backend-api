// /models/userModel.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is required
    },
    email: {
        type: String,
        required: true, // Email is required
        unique: true, // Email must be unique
    },
    contactNumber: {
        type: String,
        required: true, // Contact number is required
    },
    password: {
        type: String,
        required: true, // Password is required
    },
    verificationToken: {
        type: String, // Token for email verification
    },
    isVerified: {
        type: Boolean,
        default: false, // Default is not verified
    },
    role: {
        type: String,
        enum: ['Customer', 'Seller'], // Allowed roles
        default: 'Customer', // Default role is Customer
    },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create the User model
const User = mongoose.model('User ', userSchema);

// Export the User model
module.exports = User;