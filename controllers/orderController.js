const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order (Checkout)
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, paymentMethod, itemsPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items in cart');
  } else {
    const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
    const totalPrice = Number(itemsPrice) + taxPrice;

    const order = new Order({
      user: req.user._id,
      orderItems,
      paymentMethod,
      itemsPrice,
      taxPrice,
      totalPrice,
      status: 'Processing'
    });

    const createdOrder = await order.save();

    // INVENTORY UPDATE: Decrease stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty }
      });
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to "Confirmed"
const updateOrderToConfirmed = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isConfirmedByAdmin = true;
    order.status = 'Confirmed';
    const updatedOrder = await order.save();

    const io = req.app.get('socketio'); 
    if (io) {
      io.to(order.user.toString()).emit('notification', {
        title: "Order Confirmed! ✅",
        message: `Your order #${order._id} for kit components has been confirmed.`,
        time: new Date()
      });
    }
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete order (Admin Only) & Restore Stock
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // RESTORE STOCK: Add items back to inventory before deleting order
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.qty }
      });
    }

    await order.deleteOne();
    res.json({ message: 'Order purged and inventory restored' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders (Admin only)
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Get logged in user orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get pending orders (Admin only)
const getPendingOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ isConfirmedByAdmin: false }).populate('user', 'id name');
  res.json(orders);
});

module.exports = { 
  addOrderItems, 
  getOrderById, 
  updateOrderToConfirmed, 
  deleteOrder, // Exported new function
  getOrders,
  getMyOrders,
  getPendingOrders 
};