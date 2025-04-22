const mongoose = require('mongoose');
const cron = require('node-cron');
const OrderItem = require('./orderItemModel'); // Reference to OrderItem model

// Order schema definition
const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Placed', 'Shipped', 'Delivered', 'Canceled'],  // Added 'Placed' here
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Pending'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online'],
      default: 'COD',
    },
    customerName: {
      type: String,
      required: false
    },
    contactNumber: {
      type: String,
      required:  false,
    },
    deliveryLocation: {
      type: String,
      required: false
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'e-wallet'],
      required: false
    }, 

    canceledBy: {
      type: String,
      enum: ['Customer', 'Seller'],
      default: null
    }

  },
  { timestamps: true }
);

// Define the Order model before using it in the cron job
const Order = mongoose.model('Order', orderSchema);

// Cron job to remove orders older than 1 minute that are still 'Pending'
cron.schedule('* * * * *', async () => {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60000);

    const pendingOrders = await Order.find({
      status: 'Pending',
      createdAt: { $lt: oneMinuteAgo },
    });

    for (const order of pendingOrders) {
      await Order.findByIdAndDelete(order._id);
      console.log(`Order ${order._id} removed due to timeout.`);
    }
  } catch (error) {
    console.error('Error in cron job for removing pending orders:', error);
  }
});

module.exports = Order;
