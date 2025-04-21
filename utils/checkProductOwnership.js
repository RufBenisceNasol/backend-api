const Product = require('../models/productModel');

const checkProductOwnership = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this product' });
    }

    // Optionally attach product to request for reuse in controller
    req.product = product;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ownership check failed' });
  }
};

module.exports = checkProductOwnership;
