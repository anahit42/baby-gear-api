const mongoose = require('mongoose');

const { PaymentMethodSchema } = require('./schemas');

const PaymentMethodModel = mongoose.model('PaymentMethod', PaymentMethodSchema);

module.exports = PaymentMethodModel;
