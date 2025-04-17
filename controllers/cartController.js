const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const price = product.price;
    const subtotal = price * quantity;

    let cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
      cart = new Cart({
        customer: customerId,
        items: [{ product: productId, quantity, subtotal }],
        total: subtotal,
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].subtotal += subtotal;
      } else {
        cart.items.push({ product: productId, quantity, subtotal });
      }

      cart.total = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart', details: err.message });
  }
};

// View cart
const viewCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id }).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart is empty' });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart', details: err.message });
  }
};

const removeItemFromCart = async (req, res) => {
    try {
      const customerId = req.user._id;
      const { productId } = req.body;
  
      // 🐛 DEBUG LOGS:
      console.log('🧾 Customer ID:', customerId);
      console.log('🛒 Product ID to remove:', productId);
  
      let cart = await Cart.findOne({ customer: customerId });
  
      // More logging
      if (!cart) {
        console.log('❌ Cart not found for customer.');
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      console.log('✅ Cart found:', JSON.stringify(cart, null, 2));
  
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );
  
      if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        cart.total -= item.subtotal;
        cart.items.splice(itemIndex, 1);
        console.log('🗑️ Item removed:', productId);
      } else {
        console.log('❌ Item not found in cart:', productId);
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      await cart.save();
      res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (err) {
      console.error('🔥 Error removing item from cart:', err.message);
      res.status(500).json({ error: 'Failed to remove item from cart', details: err.message });
    }
  };
  

// Clear cart
const clearCart = async (req, res) => {
  try {
    const customerId = req.user._id;

    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.total = 0;

    await cart.save();
    res.status(200).json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart', details: err.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
      const customerId = req.user._id;
      const { productId, quantity } = req.body;
  
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Product ID and valid quantity are required' });
      }
  
      const cart = await Cart.findOne({ customer: customerId });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = product.price * quantity;
  
      cart.total = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
  
      await cart.save();
      res.status(200).json({ message: 'Cart item updated', cart });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update item in cart', details: err.message });
    }
  };
  

// Get cart summary (total items and total amount)
const getCartSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id }).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Cart is empty' });

    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = cart.total;

    res.status(200).json({ totalItems, totalAmount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart summary', details: err.message });
  }
};



module.exports = {
    addToCart,
    viewCart,
    removeItemFromCart,
    clearCart,
    updateCartItem, // Add this line
  };