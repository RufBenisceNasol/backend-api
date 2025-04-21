const Store = require('../models/storeModel');

const checkStoreOwnership = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    console.log('Authenticated User ID:', req.user._id); // Log the user ID
    console.log('Store Owner ID:', store.owner.toString()); // Log the store owner ID

    // Make sure to check if the user ID matches the store's owner
    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this store' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Ownership check failed', error: error.message });
  }
};


module.exports = checkStoreOwnership;
