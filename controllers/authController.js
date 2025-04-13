// /controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail, SendGrid, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationLink) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: 'Verify Your Email - Bufood 🍽️',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);">
                        <h2 style="color: #333;">Welcome to <span style="color: #28a745;">Bufood</span>! 👋</h2>
                        <p style="font-size: 16px; color: #555;">
                            Thanks for signing up! Please verify your email address by clicking the button below:
                        </p>
                        <a href="${verificationLink}"
                           style="display: inline-block; padding: 12px 24px; margin: 20px 0;
                                  background-color: #28a745; color: #fff; text-decoration: none;
                                  border-radius: 6px; font-weight: bold; font-size: 16px;">
                            Verify Email
                        </a>
                        <p style="font-size: 14px; color: #777;">
                            If you did not create this account, you can safely ignore this email.
                        </p>
                        <p style="font-size: 14px; color: #aaa; margin-top: 30px;">
                            &mdash; The Bufood Team
                        </p>
                    </div>
                </div>
            `,
        });
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error.message);
        throw new Error('Could not send verification email');
    }
};


// Register a new user
const register = async (req, res) => {
    const { name, email, contactNumber, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ message: 'User  already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create a new user
        const user = new User({
            name,
            email,
            contactNumber,
            password: hashedPassword,
            verificationToken,
            role: role || 'Customer', // Default to 'Customer' if no role is provided
        });
        await user.save();

        // Send verification email
        const verificationLink = `http://localhost:8000/api/auth/verify/${verificationToken}`;
        await sendVerificationEmail(email, verificationLink); // Use the email service

        res.status(201).json({ message: 'User  registered successfully. Please check your email to verify your account.' });
    } catch (error) {
        console.error('Error during registration:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify email
const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }

        // Update user verification status
        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error during email verification:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error' });
    }
};

// Export the functions
module.exports = { 
    register,
    login,
    verifyEmail,
    sendVerificationEmail
};