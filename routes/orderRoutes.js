const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  updateOrderToConfirmed,
  getOrders,
  getPendingOrders,
  getOrderById,
  getMyOrders,
  deleteOrder // 1. Added the new deleteOrder import
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// --- Standard Routes ---
router.route('/')
  .post(protect, addOrderItems) 
  .get(protect, admin, getOrders); 

// 2. IMPORTANT: Specific routes must come before dynamic /:id routes
router.get('/myorders', protect, getMyOrders); 
router.get('/pending', protect, admin, getPendingOrders);

// --- Specific Order routes ---
router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder); // 3. Added DELETE route for Admin

// 4. Update status route
router.put('/:id/confirm', protect, admin, updateOrderToConfirmed);

module.exports = router;