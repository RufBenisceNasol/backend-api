const Product = require('../models/productModel');
const Store = require('../models/storeModel');
const uploadToCloudinary = require('../utils/cloudinary');
const fs = require('fs');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, availability } = req.body;
    const sellerId = req.user._id;

    const store = await Store.findOne({ owner: sellerId });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    let imageUrl = undefined;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'products');
      imageUrl = result.secure_url;
      
      // Delete the file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting the file from local storage:', err);
        }
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      availability,
      sellerId,
      storeId: store._id,
      image: imageUrl,
    });

    const savedProduct = await newProduct.save();
    store.products.push(savedProduct._id);
    await store.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if the logged-in user is the seller
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Only update the image if it's provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, 'products');
      req.body.image = result.secure_url;  // Set the new image URL in the request body
      
      // Delete the file after upload
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting the file from local storage:', err);
        }
      });
    }

    // Apply the updates (only image will be updated if passed)
    Object.assign(product, req.body);  // Apply the changes to the product

    // Save the updated product
    const updatedProduct = await product.save();
    res.json(updatedProduct);  // Return the updated product
  } catch (err) {
    console.error(err);  // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

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

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
