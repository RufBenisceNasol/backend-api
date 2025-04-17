const { body, param } = require('express-validator');

// Validation for adding a product to the cart
const addToCartValidation = [
  body('productId')
    .isMongoId().withMessage('Invalid product ID')
    .notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
    .notEmpty().withMessage('Quantity is required'),
];

// Validation for removing an item from the cart
const removeItemFromCartValidation = [
  body('productId')
    .isMongoId().withMessage('Invalid product ID')
    .notEmpty().withMessage('Product ID is required'),
];

// Validation for updating the quantity of an item in the cart
const updateCartItemQuantityValidation = [
  body('productId')
    .isMongoId().withMessage('Invalid product ID')
    .notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
    .notEmpty().withMessage('Quantity is required'),
];

// Validation for clearing the cart (no additional body data needed)
const clearCartValidation = [];

// Export validations
module.exports = {
  addToCartValidation,
  removeItemFromCartValidation,
  updateCartItemQuantityValidation,
  clearCartValidation,
};