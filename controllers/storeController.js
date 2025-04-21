// /controllers/storeController.js
const Store = require('../models/storeModel');

// Create store for seller (used during registration)
const createStoreForSeller = async (user) => {
  const storeName = `${user.name}'s Store`;
  const newStore = new Store({
    storeName,
    owner: user._id,
    products: [],
    image: 'https://res.cloudinary.com/dflcnd7z3/image/upload/v1743873916/store-images/defaultStore.png',
  });

  await newStore.save();
  return newStore;
};

const updateStore = async (req, res) => {
  const storeId = req.params.id;
  const updates = {};

  if (req.body.storeName) {
    updates.storeName = req.body.storeName;
  }

  if (req.file) {
    updates.image = req.file.path;
  }

  try {
    const updatedStore = await Store.findByIdAndUpdate(storeId, updates, { new: true });

    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update store', error: error.message });
  }
};



// Delete store
const deleteStore = async (req, res) => {
  const storeId = req.params.id;

  try {
    const deletedStore = await Store.findByIdAndDelete(storeId);
    if (!deletedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete store', error: error.message });
  }
};

// Get store by owner ID
const getStoreByOwner = async (req, res) => {
  const ownerId = req.params.ownerId;

  try {
    const store = await Store.findOne({ owner: ownerId }).populate('products');
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch store', error: error.message });
  }
};

// 🔥 NEW: Get all stores (for customers)
const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate('owner', 'name email');
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get stores', error: error.message });
  }
};

// 🔥 NEW: Get single store by ID (for customers)
const getStoreById = async (req, res) => {
  const storeId = req.params.id;

  try {
    const store = await Store.findById(storeId).populate('owner', 'name email').populate('products');
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get store', error: error.message });
  }
};

// 🔥 NEW: Get products by store ID (for customers)
const getStoreProducts = async (req, res) => {
  const storeId = req.params.id; // Get store ID from request parameters

  try {
    // Fetch the store by its ID and populate the products field
    const store = await Store.findById(storeId).populate('products');
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // If the store exists, return the products array
    res.status(200).json({
      storeId: store._id,
      storeName: store.storeName,
      products: store.products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products for the store', error: error.message });
  }
};

module.exports = {
  createStoreForSeller,
  updateStore,
  deleteStore,
  getStoreByOwner,
  getAllStores,
  getStoreById, 
  getStoreProducts
};