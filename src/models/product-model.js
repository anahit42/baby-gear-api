const mongoose = require('mongoose');

const { ProductSchema } = require('./schemas');

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
