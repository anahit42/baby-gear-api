const mongoose = require('mongoose');

const { OrderSchema } = require('./schemas');

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
