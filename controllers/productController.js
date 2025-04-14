const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const uploadToCloudinary = require('../utils/cloudinary'); // make sure this is imported correctly

// CREATE product
const createProduct = async (req, res) => {
    try {
      // Trimmed inputs
      const name = req.body.name?.trim();
      const description = req.body.description?.trim();
      const category = req.body.category?.trim();
      const price = req.body.price;
      const availability = req.body.availability;
  
      // Check if seller has a store
      const store = await Store.findOne({ owner: req.user._id });
      if (!store) {
        return res.status(400).json({ error: 'Seller does not have a store' });
      }
  
      // Image handling with default fallback
      const imageUrl =
        req.file?.path ||
        'https://res.cloudinary.com/dflcnd7z3/image/upload/v1744609432/zqmqydo1eeiup3qvv1vh.jpg';
  
      // Normalize availability
      const normalizedAvailability =
        availability?.trim().toLowerCase() === 'out of stock' ? 'Out of Stock' : 'Available';
  
      // Create product
      const product = new Product({
        name,
        description,
        price,
        category,
        availability: normalizedAvailability,
        storeId: store._id,
        image: imageUrl,
        sellerId: req.user._id,
      });
  
      await product.save();
      res.status(201).json(product);
    } catch (err) {
      console.error('Create Product Error:', err);
      res.status(500).json({ error: 'Failed to create product', details: err.message });
    }
  };
  
  // READ all products for seller
  const getSellerProducts = async (req, res) => {
    try {
      const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products', details: err.message });
    }
  };
  
  // UPDATE product
  const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = {
        ...req.body,
        name: req.body.name?.trim(),
        description: req.body.description?.trim(),
        category: req.body.category?.trim(),
      };
  
      // Normalize availability if provided
      if (updates.availability && typeof updates.availability === 'string') {
        const normalized = updates.availability.trim().toLowerCase();
        if (normalized === 'available') {
          updates.availability = 'Available';
        } else if (normalized === 'out of stock') {
          updates.availability = 'Out of Stock';
        } else {
          delete updates.availability; // invalid, remove
        }
      }
  
      // Optional: Handle updated image
      if (req.file) {
        updates.image = req.file.path;
      }
  
      const product = await Product.findOneAndUpdate(
        { _id: id, sellerId: req.user._id },
        updates,
        { new: true }
      );
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found or unauthorized' });
      }
  
      res.status(200).json(product);
    } catch (err) {
      console.error('Update Product Error:', err);
      res.status(500).json({ error: 'Failed to update product', details: err.message });
    }
  };
  
  // DELETE product
  const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findOneAndDelete({ _id: id, sellerId: req.user._id });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error('Delete Product Error:', err);
      res.status(500).json({ error: 'Failed to delete product', details: err.message });
    }
  };
  
  module.exports = {
    createProduct,
    getSellerProducts,
    updateProduct,
    deleteProduct,
  };