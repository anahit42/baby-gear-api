const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  transactionId: {
    type: Schema.Types.ObjectId,
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending'
  },
  complaints: [{
    reason: {
      type: String,
      enum: ['productQuality', 'failedDelivery']
    },
    comments: String
  }],
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed', 'expired']
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = OrderSchema;
