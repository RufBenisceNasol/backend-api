const { body, param, check } = require('express-validator');
const Product = require('../../models/productModel'); // Ensure Product model is imported

// Validator for placing an order (when placing from cart or product)
const placeOrderValidation = [
  body('customerName')
    .notEmpty().withMessage('Customer name is required.')
    .isString().withMessage('Customer name must be a string.'),

  body('contactNumber')
    .notEmpty().withMessage('Contact number is required.')
    .isMobilePhone().withMessage('Invalid contact number format.'),

  body('deliveryLocation')
    .notEmpty().withMessage('Delivery location is required.')
    .isString().withMessage('Delivery location must be a string.'),

  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required.')
    .isIn(['e-wallet', 'COD']).withMessage('Invalid payment method. Choose either "e-wallet" or "COD".'),
];

// Validator for checking out from the cart (ensure products exist and stock is available)
const checkoutFromCartValidation = [
  // This can be expanded to check for empty cart or more details about cart items.
  check('customerId')
    .isMongoId().withMessage('Invalid customer ID format.'),
];

// Validator for order ID parameters
const orderIdValidation = [
  param('orderId')
    .isMongoId().withMessage('Invalid order ID format.')
];

// Validator for canceling an order (check order status and ownership)
const cancelOrderValidation = [
  param('orderId')
    .isMongoId().withMessage('Invalid order ID format.')
];

// Validator for checking out from product (ensure valid product and quantity)
const checkoutFromProductValidation = [
  body('productId')
    .isMongoId().withMessage('Invalid product ID format.')
    .custom(async (productId) => {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.availability === 'Out of Stock') {
        throw new Error('Product is out of stock');
      }
    }),

  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1.')
    .custom(async (quantity, { req }) => {
      const productId = req.body.productId;
      const product = await Product.findById(productId);
      if (product && quantity > product.stock) {
        throw new Error('Not enough stock for this product.');
      }
      return true;
    }),
];

module.exports = {
  placeOrderValidation,
  checkoutFromCartValidation,
  orderIdValidation,
  cancelOrderValidation,
  checkoutFromProductValidation,
};
