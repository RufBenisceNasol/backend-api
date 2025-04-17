const express = require('express');
const router = express.Router();

const {
  updateStore,
  deleteStore,
  getStoreByOwner,
  getAllStores,
  getStoreById,
  getStoreProducts,
} = require('../controllers/storeController');

const { authenticate } = require('../middlewares/authMiddleware'); // ✅ FIXED
const checkStoreOwnership = require('../utils/checkOwnership');
const validateStore = require('../middlewares/validators/storeValidator');

// 🔍 Get all stores (with optional search)
router.get('/', getAllStores);

// 👤 Get store by logged-in owner
router.get('/owner/:ownerId', authenticate, getStoreByOwner);

// 📍 Get a specific store by ID (for customers)
router.get('/:id', getStoreById);

// ✏️ Update store - only by owner with validation
router.put('/:id', authenticate, checkStoreOwnership, validateStore, updateStore);

// ❌ Delete store - only by owner
router.delete('/:id', authenticate, checkStoreOwnership, deleteStore);

// 🛒 Get all products in a store by store ID (for customers)
router.get('/:id/products', getStoreProducts);  // Add this route

module.exports = router;
