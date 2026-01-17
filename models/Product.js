const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true }, // e.g., 'Kits', 'IoT', 'Electronics'
  countInStock: { type: Number, required: true, default: 0 },
  image: { type: String, default: '/images/sample.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);