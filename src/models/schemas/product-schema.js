const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: String,
  description: String,
  price: String,
  properties: {
    color: String,
    size: String,
    weight: String,
    ageFrom: Number,
    ageTo: Number,
  },
  customProperties: Schema.Types.Mixed,
  condition: {
    type: String,
    enum: ['new', 'very good', 'good', 'acceptable'],
  },
  status: {
    type: String,
    enum: ['active', 'deleted', 'not-available'],
    default: 'active',
  },
  quantity: Number,
  brand: String,
  country: String,
  images: [String],
  issueDate: Date,
  category: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = ProductSchema;
