const mongoose = require('mongoose');

const { Schema } = mongoose;

const BucketSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
  }],
  totalPrice: Number,
});

module.exports = BucketSchema;
