const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: Number,
  deliveryStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending',
  },
  complaints: [{
    reason: {
      type: String,
      enum: ['productQuality', 'failedDelivery'],
    },
    comments: String,
  }],
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed', 'expired'],
    default: 'pending',
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = OrderSchema;
