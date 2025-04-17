// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
  addToCart,
  viewCart,
  removeItemFromCart,
  clearCart,
  updateCartItem,
  
} = require('../controllers/cartController');

const { authenticate, checkRole } = require('../middlewares/authMiddleware');

// Routes - Only accessible by authenticated Customers
router.post('/add', authenticate, checkRole('Customer'), addToCart);
router.get('/', authenticate, checkRole('Customer'), viewCart);
router.delete('/remove', authenticate, checkRole('Customer'), removeItemFromCart);
router.delete('/clear', authenticate, checkRole('Customer'), clearCart);
router.patch('/update', authenticate, checkRole('Customer'), updateCartItem); // For updating quantity

module.exports = router;
