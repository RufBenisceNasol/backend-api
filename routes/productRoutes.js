const express = require('express');
const router = express.Router();

const {
  createProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const authenticate = require('../middlewares/authMiddleware');
const checkSeller = require('../middlewares/roleMiddleware');
const upload = require('../utils/multerStorage'); // Multer config for Cloudinary
const productValidation = require('../middlewares/validators/productValidation');
const handleValidation = require('../middlewares/validators/handleValidation');

// Apply auth + seller check for all routes below
router.use(authenticate, checkSeller);

// 🆕 Create a product (with image upload)
router.post(
  '/',
  upload.single('image'),           // Handles file upload from 'image' field
  productValidation,                // Express-validator checks
  handleValidation,                 // Sends error if validation fails
  createProduct                     // Controller
);

// 📦 Get all seller products
router.get('/', getSellerProducts);

// ✏️ Update product by ID
router.put('/:id', updateProduct);

// ❌ Delete product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
