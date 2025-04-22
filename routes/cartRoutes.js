// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
  addToCart,
  viewCart,
  removeItemFromCart,
  clearCart,
  updateCartItem,
  checkout,  // Add the checkout route here
} = require('../controllers/cartController');

const { authenticate, checkRole } = require('../middlewares/authMiddleware');

// Routes - Only accessible by authenticated Customers
router.post('/add', authenticate, checkRole('Customer'), addToCart);

// View cart items
router.get('/', authenticate, checkRole('Customer'), viewCart);

// Remove item from cart
router.delete('/remove', authenticate, checkRole('Customer'), removeItemFromCart);

// Clear cart
router.delete('/clear', authenticate, checkRole('Customer'), clearCart);

// Update cart item (e.g., change quantity)
router.patch('/update', authenticate, checkRole('Customer'), updateCartItem); // For updating quantity


module.exports = router;
