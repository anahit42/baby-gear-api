const mongoose = require('mongoose');

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  invoiceId: String,
  items: [{
    invoiceItemId: String,
    metadata: {
      orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    },
    amount: Number,
  }],
  totalPrice: Number,
  paid: Boolean,
  status: {
    type: String,
    enum: ['draft', 'open', 'paid', 'uncollectible', 'void'],
    default: 'open',
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = InvoiceSchema;
