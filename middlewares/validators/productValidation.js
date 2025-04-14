const { body } = require('express-validator');

const productValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('category')
    .notEmpty().withMessage('Category is required'),

    body('availability')
    .optional()
    .customSanitizer(value => value.toLowerCase())
    .isIn(['available', 'out of stock'])
    .withMessage('Availability must be either "Available" or "Out of Stock"'),
];

module.exports = productValidation;