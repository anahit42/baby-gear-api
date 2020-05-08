const mongoose = require('mongoose');

const { CategorySchema } = require('./schemas');

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
