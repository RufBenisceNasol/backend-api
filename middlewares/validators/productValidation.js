const { body } = require('express-validator');

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('availability')
    .optional()
    .isIn(['Available', 'Out of Stock']).withMessage('Availability must be "Available" or "Out of Stock"'),
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty'),

  body('price')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),

  body('category')
    .optional()
    .trim()
    .notEmpty().withMessage('Category cannot be empty'),

  body('availability')
    .optional()
    .isIn(['Available', 'Out of Stock']).withMessage('Availability must be "Available" or "Out of Stock"'),
];

module.exports = {
  createProductValidation,
  updateProductValidation
};
