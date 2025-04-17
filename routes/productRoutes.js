const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const handleValidation = require('../middlewares/validators/handleValidation');
const {
  createProductValidation,
  updateProductValidation
} = require('../middlewares/validators/productValidation');

// 🟢 Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// 🔐 Seller-only routes
router.post(
  '/',
  authenticate,
  checkRole('Seller'),
  upload.single('image'),
  createProductValidation,
  handleValidation,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  checkRole('Seller'),
  upload.single('image'),
  updateProductValidation,
  handleValidation,
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  checkRole('Seller'),
  deleteProduct
);

module.exports = router;
