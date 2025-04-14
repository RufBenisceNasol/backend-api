// utils/checkOwnership.js
const Store = require('../models/storeModel');

const checkStoreOwnership = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this store' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Ownership check failed', error: error.message });
  }
};

module.exports = checkStoreOwnership;
