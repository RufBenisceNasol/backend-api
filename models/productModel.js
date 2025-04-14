const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/dflcnd7z3/image/upload/v1744609432/zqmqydo1eeiup3qvv1vh.jpg',
  },
  category: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    enum: ['Available', 'Out of Stock'],
    default: 'Available',
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
