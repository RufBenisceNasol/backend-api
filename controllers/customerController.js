const Store = require('../models/storeModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

const getCustomerProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Customer profile fetched successfully',
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer profile', details: err.message });
  }
};

const getAllStoresForCustomer = async (req, res) => {
  try {
    const stores = await Store.find().populate('owner', 'name email');
    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores', details: err.message });
  }
};

const viewStore = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).populate('products');
    if (!store) return res.status(404).json({ error: 'Store not found' });

    res.status(200).json(store);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch store', details: err.message });
  }
};


module.exports = {
  getCustomerProfile,
  getAllStoresForCustomer,
  viewStore,
};
