const mongoose = require('mongoose');

const { TransactionSchema } = require('./schemas');

const TransactionModel = mongoose.model('Transaction', TransactionSchema);

module.exports = TransactionModel;
