const mongoose = require('mongoose');

const { Schema } = mongoose;

const PaymentMethodSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  methodId: {
    type: String,
    index: true,
  },
  methodType: String,
  default: Boolean,
});

module.exports = PaymentMethodSchema;
