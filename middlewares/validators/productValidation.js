const { body, param } = require('express-validator');

const createProductValidation = [
  // Validate name: not empty and string length between 3 and 50 characters
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Product name must be between 3 and 50 characters'),

  // Validate description: not empty and length between 10 and 500 characters
  body('description')
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 10, max: 500 }).withMessage('Product description must be between 10 and 500 characters'),

  // Validate price: must be a valid float greater than 0
  body('price')
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  // Validate category: not empty
  body('category')
    .notEmpty().withMessage('Product category is required'),

  // Validate availability: must be one of "Available" or "Out of Stock"
  body('availability')
    .isIn(['Available', 'Out of Stock']).withMessage('Availability must be either "Available" or "Out of Stock"'),

  // Optionally validate image if provided (check if URL format is valid)
  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
];

const updateProductValidation = [
  // Validate product ID in the URL: must be a valid MongoDB ObjectId
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),

  // Validate name: optional but if provided, string length between 3 and 50 characters
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters'),

  // Validate description: optional but if provided, length between 10 and 500 characters
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),

  // Validate price: optional but if provided, must be a positive number
  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  // Validate category: optional but if provided, not empty
  body('category')
    .optional()
    .isString()
    .withMessage('Category must be a string')
    .notEmpty().withMessage('Category is required'),

  // Validate availability: optional but if provided, must be one of "Available" or "Out of Stock"
  body('availability')
    .optional()
    .isIn(['Available', 'Out of Stock']).withMessage('Availability must be either "Available" or "Out of Stock"'),

  // Optionally validate image if provided (check if URL format is valid)
  body('image')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
];

module.exports = { createProductValidation, updateProductValidation };
