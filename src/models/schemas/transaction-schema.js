const mongoose = require('mongoose');

const { Schema } = mongoose;

const TransactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = TransactionSchema;
