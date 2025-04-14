const express = require('express');
const router = express.Router();

const {
  updateStore,
  deleteStore,
  getStoreByOwner,
  getAllStores,
  getStoreById,
} = require('../controllers/storeController');

const authenticate = require('../middlewares/authMiddleware');
const checkStoreOwnership = require('../utils/checkOwnership');
const validateStore = require('../middlewares/validators/storeValidator'); // ✅ import store validator

// 🔍 Get all stores (with optional search)
router.get('/', getAllStores);

// 👤 Get store by logged-in owner (should be before ":id" route!)
router.get('/owner/:ownerId', authenticate, getStoreByOwner);

// 📍 Get a specific store by ID (for customers)
router.get('/:id', getStoreById);

// ✏️ Update store - only by owner with validation
router.put('/:id', authenticate, checkStoreOwnership, validateStore, updateStore);

// ❌ Delete store - only by owner
router.delete('/:id', authenticate, checkStoreOwnership, deleteStore);

module.exports = router;
