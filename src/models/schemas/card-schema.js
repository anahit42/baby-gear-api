const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  stripeToken: {
    type: String,
    index: true,
  },
  default: Boolean,
});

module.exports = CardSchema;
