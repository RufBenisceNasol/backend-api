const express = require('express');
const router = express.Router();

const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const handleValidation = require('../middlewares/validators/handleValidation');

const {
  getCustomerProfile,
  getAllStoresForCustomer,
  viewStore,
 
} = require('../controllers/customerController');

// 🔒 Get customer profile (only for logged-in customers)
router.get('/profile', authenticate, checkRole('Customer'), getCustomerProfile);

// 🌐 View all stores (public access)
router.get('/stores', getAllStoresForCustomer);

// 🛍️ View a specific store and its products
router.get('/store/:id', viewStore);



module.exports = router;
