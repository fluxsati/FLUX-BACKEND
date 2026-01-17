const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Product' 
      },
    }
  ],
  paymentMethod: { 
    type: String, 
    required: true, 
    default: 'UPI/COD' // Updated for Indian context
  },
  // --- ADD THESE PRICING FIELDS ---
  itemsPrice: { type: Number, required: true, default: 0.0 },
  taxPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date }, // Fixed the syntax here
  
  isConfirmedByAdmin: { type: Boolean, required: true, default: false },
  status: { 
    type: String, 
    required: true,
    default: 'Processing' // Processing, Confirmed, Out for Delivery, Delivered
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);