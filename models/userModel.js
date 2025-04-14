const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verificationToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['Customer', 'Seller'],
        default: 'Customer',
    },
    store: {
        storeName: String,
        storeId: mongoose.Schema.Types.ObjectId,
        owner: mongoose.Schema.Types.ObjectId,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
