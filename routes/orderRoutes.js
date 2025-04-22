const express = require('express');
const router = express.Router();
const {
  checkoutFromProduct,
  checkoutFromCart,
  placeOrder,
  getOrdersForCustomer,
  getOrderDetails,
  cancelOrderBySeller,
  cancelOrderByCustomer
} = require('../controllers/orderController');
const { authenticate, checkRole } = require('../middlewares/authMiddleware');

// ✅ Checkout from product (Direct product purchase)
router.post('/checkout-from-product', authenticate, checkRole('Customer'), checkoutFromProduct);

// ✅ Checkout from cart (Items selected from the cart)
router.post('/checkout-cart', authenticate, checkRole('Customer'), checkoutFromCart);

// ✅ Place order (finalize order)
router.post('/place-order/:orderId', authenticate, checkRole('Customer'), placeOrder);

// ✅ Get all orders for a customer
router.get('/customer', authenticate, getOrdersForCustomer);

// ✅ Get order details by orderId
router.get('/:orderId', authenticate, getOrderDetails);

// ✅ Seller cancels order
router.patch('/cancel-by-seller/:orderId', authenticate, checkRole('Seller'), cancelOrderBySeller);

// ✅ Customer's cancellation request
router.patch('/cancel-by-customer/:orderId', authenticate, checkRole('Customer'), cancelOrderByCustomer);



module.exports = router;
