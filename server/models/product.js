const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phno: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Roses', 'Lilies', 'Tulips'] },
  qty: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('Product', productSchema, 'products');