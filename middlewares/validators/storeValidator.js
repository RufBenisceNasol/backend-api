const { body, validationResult } = require('express-validator');

// Validation rules for creating/updating a store
const validateStore = [
  body('storeName')
    .trim()
    .notEmpty()
    .withMessage('Store name is required')
    .isLength({ min: 3 })
    .withMessage('Store name must be at least 3 characters long'),

  // You can add more rules like address, description, etc. if needed
  // body('address')
  //   .optional()
  //   .isString()
  //   .withMessage('Address must be a valid string'),

  // Final error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateStore;
