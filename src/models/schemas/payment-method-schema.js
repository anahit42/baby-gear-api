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
    unique: true,
  },
  methodType: String,
  isDefault: Boolean,
});

module.exports = PaymentMethodSchema;
