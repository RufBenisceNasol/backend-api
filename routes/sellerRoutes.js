const express = require('express');
const router = express.Router();

// Middleware
const { authenticate,checkRole } = require('../middlewares/authMiddleware');

const upload = require('../utils/multerStorage');

// Controllers
const { getSellerProfile } = require('../controllers/sellerController');
const {
  createProduct,
  getSellerProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  updateStore,
  deleteStore,
  getStoreByOwner
} = require('../controllers/storeController');

// 🧑‍💼 Seller profile (protected route)
router.get('/profile', authenticate, checkRole('Seller'), getSellerProfile);

// 🛍️ Get seller's store
router.get('/store', authenticate, checkRole('Seller'), getStoreByOwner);

// 🛠️ Update seller's store
router.put('/store/:id', authenticate, checkRole('Seller'), updateStore);

// ❌ Delete seller's store
router.delete('/store/:id', authenticate, checkRole('Seller'), deleteStore);

// 📦 Create a product
router.post(
  '/products',
  authenticate,
  checkRole('Seller'),
  upload.single('image'),
  createProduct
);

// 📦 Get all products by seller
router.get('/products', authenticate, checkRole('Seller'), getSellerProducts);

// ✏️ Update product
router.put(
  '/products/:id',
  authenticate,
  checkRole('Seller'),
  upload.single('image'),
  updateProduct
);

// 🗑️ Delete product
router.delete('/products/:id', authenticate, checkRole('Seller'), deleteProduct);

module.exports = router;
