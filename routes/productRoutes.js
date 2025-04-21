const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProductsInStore
} = require('../controllers/productController');

const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const uploadProductImage = require('../utils/uploadProductImage'); // ✅ Updated middleware for product images
const handleValidation = require('../middlewares/validators/handleValidation');
const checkProductOwnership = require('../utils/checkProductOwnership');
const {
  createProductValidation,
  updateProductValidation
} = require('../middlewares/validators/productValidation');

// 🟢 Public routes
router.get('/', getAllProducts);  // Fetch all products
router.get('/:id', getProductById);  // Fetch a product by ID

// 🔐 Seller-only routes

// Create a new product
router.post(
  '/',
  authenticate,  // Ensure the user is authenticated
  checkRole('Seller'),  // Ensure the user is a Seller
  uploadProductImage.single('image'),  // Upload product image (optional)
  createProductValidation,  // Validate product data
  handleValidation,  // Handle validation errors
  createProduct  // Create product
);

// Update an existing product
router.put(
  '/:id',
  authenticate,  // Ensure the user is authenticated
  checkProductOwnership,  // Ensure the user owns the product
  uploadProductImage.single('image'),  // Upload product image (optional)
  updateProductValidation,  // Validate updated product data
  handleValidation,  // Handle validation errors
  updateProduct  // Update product
);

// Delete a product
router.delete(
  '/:id',
  authenticate,  // Ensure the user is authenticated
  checkRole('Seller'),  // Ensure the user is a Seller
  deleteProduct  // Delete product
);

// 🧹 Route to delete all products in a store
router.delete(
  '/store/:storeId/products',
  authenticate,  // Ensure the user is authenticated
  checkRole('Seller'),  // Ensure the user is a Seller
  deleteAllProductsInStore  // Delete all products in a store
);

module.exports = router;
