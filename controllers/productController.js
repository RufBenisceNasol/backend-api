const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const fs = require('fs').promises;  // Use fs.promises for cleaner async file handling

// Utility function for file deletion
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
  }
};

// Create a product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, availability } = req.body;
    const sellerId = req.user._id;

    // Find the store associated with the seller
    const store = await Store.findOne({ owner: sellerId });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    let imageUrl;

    // Check if file is uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'product-images');
      imageUrl = result.secure_url;

      // Delete the file from local storage after upload
      await deleteFile(req.file.path);
    } else {
      // If no image is uploaded, set the default image
      imageUrl = Product.schema.path('image').defaultValue;
    }

    // Create the product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      availability,
      sellerId,
      storeId: store._id,  // Ensure the storeId is correctly referenced
      image: imageUrl, // Set the image URL (either uploaded or default)
    });

    // Save the product and update the store with the new product
    const savedProduct = await newProduct.save();
    store.products.push(savedProduct._id);
    await store.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products for a seller
const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const products = await Product.find({ sellerId })
      .populate('storeId', 'storeName')
      .populate('sellerId', 'name email');

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch seller products' });
  }
};

// Get all products (public route)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('storeId', 'storeName')
      .populate('sellerId', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('storeId', 'storeName')
      .populate('sellerId', 'name email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Handle image upload if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'product-images');
      req.body.image = result.secure_url;

      // Delete the file after uploading to Cloudinary
      await deleteFile(req.file.path);
    }

    // Apply updates to the product
    Object.assign(product, req.body);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    await Store.findByIdAndUpdate(product.storeId, {
      $pull: { products: product._id },
    });

    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteAllProductsInStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    // Find the store by ID
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Remove all products related to the store
    await Product.deleteMany({ storeId: storeId });

    // Clear the products array in the store model
    store.products = [];
    await store.save();

    res.status(200).json({ message: 'All products deleted from store' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProductsInStore
};
