const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Helper function to create order item
const createOrderItem = async (product, quantity) => {
  const subtotal = product.price * quantity;
  const orderItem = new OrderItem({
    product: product._id,
    quantity,
    priceAtPurchase: product.price,
    subtotal,
  });

  await orderItem.save();
  return orderItem._id;
};

// Helper function to create order
const createOrder = async (customerId, orderItems, totalAmount, paymentMethod) => {
  const order = new Order({
    customer: customerId,
    items: orderItems,
    totalAmount,
    status: 'Pending',
    paymentStatus: paymentMethod === 'COD' ? 'Unpaid' : 'Pending',
    paymentMethod,
  });

  await order.save();
  return order;
};

// Place Order (Finalize the order)
const placeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { customerName, contactNumber, deliveryLocation, paymentMethod } = req.body;

    if (!customerName || !contactNumber || !deliveryLocation || !paymentMethod) {
      return res.status(400).json({ message: "All fields (customerName, contactNumber, deliveryLocation, paymentMethod) are required to place the order." });
    }

    if (!['e-wallet', 'COD'].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method. Choose either 'e-wallet' or 'COD'." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status === 'Placed') {
      return res.status(400).json({ message: "This order has already been placed." });
    }

    order.customerName = customerName;
    order.contactNumber = contactNumber;
    order.deliveryLocation = deliveryLocation;
    order.paymentMethod = paymentMethod;
    order.paymentStatus = paymentMethod === 'COD' ? 'Unpaid' : 'Pending';
    order.status = 'Placed';

    await order.save();

    res.status(200).json({
      message: "Order placed successfully.",
      order,
    });

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: "Server error while placing order." });
  }
};

// Checkout from Cart
const checkoutFromCart = async (req, res) => {
  try {
    const customerId = req.user._id;
    let cart = await Cart.findOne({ customer: customerId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty. Add items to your cart before proceeding.' });
    }

    let orderItems = [];
    let totalAmount = 0;

    for (let item of cart.items) {
      const product = item.product;
      const quantity = item.quantity;

      if (product.availability === 'Out of Stock') {
        return res.status(400).json({ message: `Product ${product.name} is out of stock.` });
      }

      const orderItemId = await createOrderItem(product, quantity);
      orderItems.push(orderItemId);
      totalAmount += item.subtotal;
    }

    const order = await createOrder(customerId, orderItems, totalAmount, 'COD');

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.status(201).json({ message: 'Checkout successful, order created', order });
  } catch (err) {
    console.error('Error during checkout:', err.message);
    res.status(500).json({ error: 'Failed to complete checkout', details: err.message });
  }
};

// Checkout from Product
const checkoutFromProduct = async (req, res) => {
  const customerId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.availability === 'Out of Stock') {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    const subtotal = product.price * quantity;
    const orderItemId = await createOrderItem(product, quantity);
    const newOrder = await createOrder(customerId, [orderItemId], subtotal, 'COD');

    setTimeout(async () => {
      const currentOrder = await Order.findById(newOrder._id);
      if (currentOrder?.status === 'Pending') {
        await Order.findByIdAndDelete(newOrder._id);
        console.log(`Order ${newOrder._id} removed due to timeout.`);
      }
    }, 60000);

    return res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing checkout', error: error.message });
  }
};

// Get all orders for a customer
const getOrdersForCustomer = async (req, res) => {
  try {
    const customerId = req.user._id;

    const orders = await Order.find({ customer: customerId })
      .populate('items.product', 'name price description image')
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this customer.' });
    }

    return res.status(200).json({
      message: 'Orders fetched successfully.',
      orders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching customer orders.' });
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'Admin';
    const isSeller = req.user.role === 'Seller';

    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('items.product', 'name price description image');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (
      order.customer.toString() !== userId.toString() &&
      !isAdmin &&
      !isSeller
    ) {
      return res.status(403).json({ message: 'You are not authorized to view this order.' });
    }

    if (isSeller) {
      const productIds = order.items.map(item => item.product.toString());
      const sellerProducts = await Product.find({ sellerId: userId }).select('_id');

      const isSellerSellingProduct = productIds.some(productId =>
        sellerProducts.some(sellerProduct => sellerProduct._id.toString() === productId)
      );

      if (!isSellerSellingProduct) {
        return res.status(403).json({ message: 'You are not authorized to view this order.' });
      }
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error fetching order details.' });
  }
};

const cancelOrderBySeller = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { orderId } = req.params;

    // Populate both items and their corresponding products
    const order = await Order.findById(orderId).populate({
      path: 'items',
      populate: {
        path: 'product',
        model: 'Product',
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (!['Pending', 'Placed'].includes(order.status)) {
      return res.status(400).json({
        message: `Only orders with status 'Pending' or 'Placed' can be canceled.`,
      });
    }

    // Ensure products are populated before accessing sellerId
    const sellerOwnsProduct = order.items.some(item => {
      // Check if the product exists and has a sellerId
      if (item.product && item.product.sellerId) {
        return item.product.sellerId.toString() === sellerId.toString();
      }
      return false;
    });

    if (!sellerOwnsProduct) {
      return res.status(403).json({
        message: 'You are not authorized to cancel this order.',
      });
    }

    order.status = 'Canceled';
    order.canceledBy = 'Seller';
    await order.save();

    res.status(200).json({
      message: 'Order canceled successfully by Seller.',
      order,
    });
  } catch (error) {
    console.error('Error canceling order by seller:', error);
    res.status(500).json({ message: 'Server error while canceling order.' });
  }
};

const cancelOrderByCustomer = async (req, res) => {
  try {
    const customerId = req.user._id; // Get the logged-in customer's ID
    const { orderId } = req.params;  // Get the order ID from the URL params

    // Find the order by its ID and populate the product items
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Ensure the order status is either 'Pending' or 'Placed' (meaning it can still be canceled)
    if (!['Pending', 'Placed'].includes(order.status)) {
      return res.status(400).json({ message: `Only orders with status 'Pending' or 'Placed' can be canceled.` });
    }

    // Ensure that the authenticated user is the one who placed the order (customer)
    if (order.customer.toString() !== customerId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this order.' });
    }

    // Update the order status to 'Canceled'
    order.status = 'Canceled';
    await order.save(); // Save the updated order to the database

    // Respond with a success message
    res.status(200).json({
      message: 'Order canceled successfully by customer.',
      order,
    });
  } catch (error) {
    console.error('Error canceling order by customer:', error);
    res.status(500).json({ message: 'Server error while canceling order.' });
  }
};

module.exports = {
  checkoutFromCart,
  checkoutFromProduct,
  placeOrder,
  getOrdersForCustomer,
  getOrderDetails,
  cancelOrderBySeller,
  cancelOrderByCustomer
  
};
