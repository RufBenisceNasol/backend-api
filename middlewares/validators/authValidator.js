const { body } = require('express-validator');

const registerValidation = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

    body('email')
        .isEmail().withMessage('Please enter a valid email'),

    body('contactNumber')
        .notEmpty().withMessage('Contact number is required')
        .isMobilePhone().withMessage('Invalid contact number'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('role')
        .optional()
        .isIn(['Customer', 'Seller']).withMessage('Invalid role'),
];

const loginValidation = [
    body('email')
        .isEmail().withMessage('Please enter a valid email'),

    body('password')
        .notEmpty().withMessage('Password is required'),
];

module.exports = {
    registerValidation,
    loginValidation,
};
